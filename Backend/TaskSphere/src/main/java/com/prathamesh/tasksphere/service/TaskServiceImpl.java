package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prathamesh.tasksphere.dto.TaskRequest;
import com.prathamesh.tasksphere.dto.TaskResponse;
import com.prathamesh.tasksphere.exception.ResourceNotFoundException;
import com.prathamesh.tasksphere.exception.UnlinkedUserException;
import com.prathamesh.tasksphere.model.Project;
import com.prathamesh.tasksphere.model.Role;
import com.prathamesh.tasksphere.model.Task;
import com.prathamesh.tasksphere.model.TaskStatus;
import com.prathamesh.tasksphere.model.User;
import com.prathamesh.tasksphere.repository.ProjectRepository;
import com.prathamesh.tasksphere.repository.TaskRepository;
import com.prathamesh.tasksphere.repository.UserRepository;
import com.prathamesh.tasksphere.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
	private final TaskRepository taskRepository;
	private final ProjectRepository projectRepository;
	private final UserRepository userRepository;

	private UUID getOrgIdOrThrow(User user) {
		if (user.getOrganization() == null) {
			throw new UnlinkedUserException(
					"Action failed: User ID " + user.getId() + " is not currently associated with any organization.");
		}
		return user.getOrganization().getId();
	}

	private User getLoggedUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
		return userDetails.getUser();
	}

	@Override
	@Transactional
	public TaskResponse createTask(TaskRequest request) {
		User creator = getLoggedUser();

		if (creator.getRole() == Role.MEMBER) {
			throw new AccessDeniedException("Members are not allowed to create tasks");
		}

		UUID orgId = getOrgIdOrThrow(creator);

		Project project = projectRepository.findById(request.getProjectId())
				.orElseThrow(() -> new ResourceNotFoundException("Project not found"));

		if (!project.getOrganization().getId().equals(orgId)) {
			throw new AccessDeniedException("Project does not belong to your organization");
		}

		User assignedToUser = userRepository.findById(request.getAssignedTo())
				.orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

		if (assignedToUser.getOrganization() == null || !assignedToUser.getOrganization().getId().equals(orgId)) {
			throw new AccessDeniedException("Assigned user does not belong to your organization");
		}

		Task task = Task.builder().title(request.getTitle()).description(request.getDescription())
				.status(TaskStatus.TODO) // Fresh tasks default to TODO
				.dueDate(request.getDueDate()).project(project).assignedTo(assignedToUser).createdBy(creator.getId())
				.build();

		Task savedTask = taskRepository.save(task);

		return TaskResponse.builder().id(savedTask.getId()).title(savedTask.getTitle())
				.description(savedTask.getDescription()).status(savedTask.getStatus()).dueDate(savedTask.getDueDate())
				.assignedToUser(assignedToUser.getName()).projectName(project.getName())
				.organizationName(project.getOrganization().getName()).build();
	}

	@Override
	@Transactional(readOnly = true)
	public Page<TaskResponse> getTasks(String search, int page, int size) {
		User user = getLoggedUser();
		Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").ascending());

		Page<Task> taskPage;

		if (user.getRole() == Role.SUPER_ADMIN) {
			taskPage = taskRepository.findAllGlobal(search, pageable);
		} else if (user.getRole() == Role.OWNER) {
			UUID orgId = getOrgIdOrThrow(user);
			taskPage = taskRepository.findByOrganizationId(orgId, search, pageable);
		} else if (user.getRole() == Role.ADMIN) {
			taskPage = taskRepository.findByAdminProjectScope(user.getId(), search, pageable);
		} else if (user.getRole() == Role.MEMBER) {
			taskPage = taskRepository.findByAssignedUserId(user.getId(), search, pageable);
		} else {
			throw new AccessDeniedException("Unauthorized");
		}

		return taskPage.map(task -> {
			TaskResponse.TaskResponseBuilder builder = TaskResponse.builder().id(task.getId()).title(task.getTitle())
					.description(task.getDescription()).status(task.getStatus()).dueDate(task.getDueDate());

			if (user.getRole() == Role.ADMIN || user.getRole() == Role.OWNER || user.getRole() == Role.SUPER_ADMIN) {
				if (task.getAssignedTo() != null) {
					builder.assignedToUser(task.getAssignedTo().getName());
				}
			}

			if (user.getRole() == Role.OWNER || user.getRole() == Role.SUPER_ADMIN || user.getRole() == Role.ADMIN) {
				if (task.getProject() != null) {
					builder.projectName(task.getProject().getName());
				}
			}

			if (user.getRole() == Role.SUPER_ADMIN) {
				if (task.getProject() != null && task.getProject().getOrganization() != null) {
					builder.organizationName(task.getProject().getOrganization().getName());
				}
			}

			return builder.build();
		});
	}

	public TaskResponse getTask(UUID taskId) {
	    User user = getLoggedUser();

	    if (user.getRole() != Role.ADMIN) {
	        throw new AccessDeniedException("Access denied: This resource is restricted to Admins");
	    }

	    Task task = taskRepository.findById(taskId)
	            .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

	   
	    boolean isWithinScope = taskRepository.existsByIdAndProjectMembersId(taskId, user.getId()); 
	    if (!isWithinScope) {
	        throw new AccessDeniedException("You do not have permission to access tasks outside your project scope");
	    }

	    TaskResponse.TaskResponseBuilder builder = TaskResponse.builder()
	            .id(task.getId())
	            .title(task.getTitle())
	            .description(task.getDescription())
	            .status(task.getStatus())
	            .dueDate(task.getDueDate());

	    if (task.getAssignedTo() != null) {
	        builder.assignedToUser(task.getAssignedTo().getName());
	    }

	    if (task.getProject() != null) {
	        builder.projectName(task.getProject().getName());
	        
	      
	        if (task.getProject().getOrganization() != null) {
	            builder.organizationName(task.getProject().getOrganization().getName());
	        }
	    }

	    return builder.build();
	}

	@Override
	@Transactional
	public TaskResponse updateTask(UUID id, TaskRequest request) {
	    User actor = getLoggedUser();
	    UUID orgId = getOrgIdOrThrow(actor);

	    Task task = taskRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

	    if (!task.getProject().getOrganization().getId().equals(orgId)) {
	        throw new AccessDeniedException("You are not authorized to update tasks outside your organization");
	    }

	    task.setTitle(request.getTitle());
	    task.setDescription(request.getDescription());
	    task.setStatus(request.getStatus());
	    task.setDueDate(request.getDueDate());

	    if (request.getProjectId() != null) {
	        Project project = projectRepository.findById(request.getProjectId())
	                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

	        if (!project.getOrganization().getId().equals(orgId)) {
	            throw new AccessDeniedException("Target project does not belong to your organization");
	        }
	        task.setProject(project);
	    }

	    if (request.getAssignedTo() != null) {
	        User assignedToUser = userRepository.findById(request.getAssignedTo())
	                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

	        if (assignedToUser.getOrganization() == null || !assignedToUser.getOrganization().getId().equals(orgId)) {
	            throw new AccessDeniedException("Assigned user does not belong to your organization");
	        }
	        task.setAssignedTo(assignedToUser);
	    }

	    Task saved = taskRepository.save(task);

	    return TaskResponse.builder()
	            .id(saved.getId())
	            .title(saved.getTitle())
	            .description(saved.getDescription())
	            .status(saved.getStatus())
	            .dueDate(saved.getDueDate())
	            .assignedToUser(saved.getAssignedTo() != null ? saved.getAssignedTo().getName() : null)
	            .projectName(saved.getProject() != null ? saved.getProject().getName() : null)
	            .organizationName(saved.getProject() != null && saved.getProject().getOrganization() != null 
	                ? saved.getProject().getOrganization().getName() : null)
	            .build();
	}
	@Override
	@Transactional
	public void deleteTask(UUID id) {
	    User actor = getLoggedUser();
	    UUID orgId = getOrgIdOrThrow(actor);

	    Task task = taskRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

	    if (task.getProject() == null || 
	        task.getProject().getOrganization() == null || 
	        !task.getProject().getOrganization().getId().equals(orgId)) {
	        throw new AccessDeniedException("You are not authorized to delete tasks outside your organization");
	    }

	    taskRepository.delete(task);
	}

	@Override
	public List<TaskResponse> getMyTasks() {

		User user = getLoggedUser();

		List<Task> tasks = taskRepository.findByAssignedTo_Id(user.getId());

		return tasks
				.stream().map(t -> TaskResponse.builder().id(t.getId()).title(t.getTitle())
						.description(t.getDescription()).status(t.getStatus()).dueDate(t.getDueDate()).build())
				.toList();
	}
	
	@Override
	@Transactional
	public void updateTaskStatus(UUID taskId, TaskStatus newStatus) {
	    User actor = getLoggedUser();
	    UUID orgId = getOrgIdOrThrow(actor);

	    Task task = taskRepository.findById(taskId)
	            .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

	    UUID taskOrgId = (task.getProject() != null && task.getProject().getOrganization() != null) 
	            ? task.getProject().getOrganization().getId() 
	            : null;

	    if (orgId == null || !orgId.equals(taskOrgId)) {
	        throw new AccessDeniedException("Access denied: Task does not belong to your organization");
	    }
	    if (actor.getRole() == Role.MEMBER) {
	        boolean isWithinScope = taskRepository.existsByIdAndProjectMembersId(taskId, actor.getId()); 
	        if (!isWithinScope) {
	            throw new AccessDeniedException("You do not have permission to modify this task");
	        }
	    }

	    taskRepository.updateTaskStatusDirectly(taskId, newStatus);
	}
}
