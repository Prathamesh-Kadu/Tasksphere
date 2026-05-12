package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prathamesh.tasksphere.dto.TaskRequest;
import com.prathamesh.tasksphere.dto.TaskResponse;
import com.prathamesh.tasksphere.exception.ResourceNotFoundException;
import com.prathamesh.tasksphere.model.Project;
import com.prathamesh.tasksphere.model.Task;
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

	private User getLoggedUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
		return userDetails.getUser();
	}

	@Override
	@Transactional
	public TaskResponse createTask(TaskRequest request) {

		User user = getLoggedUser();

		Project project = projectRepository.findById(request.getProjectId())
				.orElseThrow(() -> new ResourceNotFoundException("Project not found"));

		User assignedUser = null;

		if (request.getAssignedTo() != null) {
			assignedUser = userRepository.findById(request.getAssignedTo())
					.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		}

		Task task = new Task();
		task.setTitle(request.getTitle());
		task.setDescription(request.getDescription());
		task.setProject(project);
		task.setAssignedTo(assignedUser);
		task.setDueDate(request.getDueDate());
		task.setCreatedBy(user.getId());

		Task saved = taskRepository.save(task);

		return TaskResponse.builder().id(saved.getId()).title(saved.getTitle()).description(saved.getDescription())
				.status(saved.getStatus()).projectId(saved.getProject().getId()).dueDate(saved.getDueDate())
				.assignedUserId(saved.getAssignedTo().getId()).build();
	}

	@Override
	public List<TaskResponse> getTasksByProject(UUID projectId) {

		List<Task> tasks = taskRepository.findByProject_Id(projectId);

		return tasks.stream()
				.map(t -> TaskResponse.builder().id(t.getId()).title(t.getTitle()).description(t.getDescription())
						.status(t.getStatus()).projectId(t.getProject().getId())
						.assignedUserId(t.getAssignedTo().getId()).dueDate(t.getDueDate()).build())
				.toList();
	}

	public TaskResponse getTask(UUID taskId) {

		Task task = taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("Task not found"));

		return TaskResponse.builder().id(task.getId()).title(task.getTitle()).description(task.getDescription())
				.status(task.getStatus()).projectId(task.getProject().getId()).dueDate(task.getDueDate())
				.assignedUserId(task.getAssignedTo().getId()).build();
	}

	@Override
	@Transactional
	public TaskResponse updateTask(UUID id, TaskRequest request) {

		Task task = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));

		task.setTitle(request.getTitle());
		task.setDescription(request.getDescription());
		task.setStatus(request.getStatus());
		task.setDueDate(request.getDueDate());

		if (request.getAssignedTo() != null) {
			User user = userRepository.findById(request.getAssignedTo())
					.orElseThrow(() -> new ResourceNotFoundException("User not found"));

			task.setAssignedTo(user);
		}

		Task saved = taskRepository.save(task);

		return TaskResponse.builder().id(saved.getId()).title(saved.getTitle()).description(saved.getDescription())
				.status(saved.getStatus()).projectId(saved.getProject().getId()).dueDate(saved.getDueDate())
				.assignedUserId(saved.getAssignedTo().getId()).build();
	}

	@Override
	@Transactional
	public void deleteTask(UUID id) {

		Task task = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));

		taskRepository.delete(task);
	}

	@Override
	public List<TaskResponse> getMyTasks() {

		User user = getLoggedUser();

		List<Task> tasks = taskRepository.findByAssignedTo_Id(user.getId());

		return tasks.stream()
				.map(t -> TaskResponse.builder().id(t.getId()).title(t.getTitle()).description(t.getDescription())
						.status(t.getStatus()).projectId(t.getProject().getId())
						.assignedUserId(t.getAssignedTo().getId()).dueDate(t.getDueDate()).build())
				.toList();
	}
}
