package com.prathamesh.tasksphere.service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

import com.prathamesh.tasksphere.dto.AssignAdminRequest;
import com.prathamesh.tasksphere.dto.ProjectRequest;
import com.prathamesh.tasksphere.dto.ProjectResponse;
import com.prathamesh.tasksphere.exception.ResourceNotFoundException;
import com.prathamesh.tasksphere.exception.UnlinkedUserException;
import com.prathamesh.tasksphere.model.Project;
import com.prathamesh.tasksphere.model.Role;
import com.prathamesh.tasksphere.model.User;
import com.prathamesh.tasksphere.repository.ProjectRepository;
import com.prathamesh.tasksphere.repository.TaskRepository;
import com.prathamesh.tasksphere.repository.UserRepository;
import com.prathamesh.tasksphere.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService {

	private final ProjectRepository projectRepository;
	private final UserRepository userRepository;
	private final TaskRepository taskRepository;

	private User getLoggedInUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
		return userDetails.getUser();
	}

	private UUID getOrgIdOrThrow(User user) {
		if (user.getOrganization() == null) {
			throw new UnlinkedUserException(
					"Action failed: User ID " + user.getId() + " is not currently associated with any organization.");
		}
		return user.getOrganization().getId();
	}

	@Override
	@Transactional
	public ProjectResponse createProject(ProjectRequest request) {

	    User currentUser = getLoggedInUser();

	    User existingUser = userRepository.findById(currentUser.getId())
	            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

	    getOrgIdOrThrow(existingUser);

	    Project project = Project.builder()
	            .name(request.getName())
	            .description(request.getDescription())
	            .organization(existingUser.getOrganization())
	            .build();

	    Project savedProject = projectRepository.save(project);
	    projectRepository.safeAddMember(savedProject.getId(), existingUser.getId());

	    return ProjectResponse.builder()
	            .id(savedProject.getId())
	            .name(savedProject.getName())
	            .description(savedProject.getDescription())
	            .build();
	}

	@Override
	public Page<ProjectResponse> getProjects(String search, int page, int size) {

		User user = getLoggedInUser();
		Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

		Page<Project> projectPage;

		if (user.getRole() == Role.SUPER_ADMIN) {
			projectPage = projectRepository.findAllWithOrganization(search, pageable);
		} else if (user.getRole() == Role.OWNER) {
			UUID orgId = getOrgIdOrThrow(user);
			projectPage = projectRepository.findByOrganization_Id(orgId, search, pageable);
		} else if (user.getRole() == Role.ADMIN || user.getRole() == Role.MEMBER) {
			projectPage = projectRepository.findByMemberId(user.getId(), search, pageable);
		} else {
			throw new AccessDeniedException("Unauthorized");
		}

		return projectPage.map(p -> {

			List<String> adminNames = userRepository.findAdminNamesByProjectId(p.getId());

			if (adminNames == null) {
				adminNames = List.of();
			}

			ProjectResponse.ProjectResponseBuilder builder = ProjectResponse.builder().createdAt(p.getCreatedAt())
					.id(p.getId()).name(p.getName()).description(p.getDescription()).admins(adminNames);

			if (user.getRole() == Role.SUPER_ADMIN && p.getOrganization() != null) {
				builder.organizationName(p.getOrganization().getName());
			} else if (p.getOrganization() != null) {
				builder.organizationName(p.getOrganization().getName());
			}

			return builder.build();
		});
	}

	@Override
	public ProjectResponse getProject(UUID id) {

		User user = getLoggedInUser();
		getOrgIdOrThrow(user);

		Project existingProject = projectRepository.findByIdAndOrganization_Id(id, user.getOrganization().getId())
				.orElseThrow(() -> new ResourceNotFoundException("Project not found"));

		return ProjectResponse.builder().id(existingProject.getId()).name(existingProject.getName())
				.description(existingProject.getDescription()).build();
	}

	@Override
	@Transactional
	public ProjectResponse updateProject(UUID id, ProjectRequest request) {

		User user = getLoggedInUser();
		getOrgIdOrThrow(user);

		Project project = projectRepository.findByIdAndOrganization_Id(id, user.getOrganization().getId())
				.orElseThrow(() -> new ResourceNotFoundException("Project not found"));

		project.setName(request.getName());
		project.setDescription(request.getDescription());

		Project existingProject = projectRepository.save(project);

		return ProjectResponse.builder().id(existingProject.getId()).name(existingProject.getName())
				.description(existingProject.getDescription()).build();
	}

	@Override
	@Transactional
	public void deleteProject(UUID id) {

	    User user = getLoggedInUser();
	    UUID orgId = getOrgIdOrThrow(user);

	    Project project = projectRepository.findByIdAndOrganization_Id(id, orgId)
	            .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
	    taskRepository.deleteByProjectId(project.getId());

	    projectRepository.deleteProjectMembers(project.getId());

	    project.getMembers().clear();

	    projectRepository.delete(project);
	}

	@Override
	@Transactional
	public void assignMemberToProject(List<UUID> userIds) {
		User loggedAdmin = getLoggedInUser();
		UUID orgId = getOrgIdOrThrow(loggedAdmin);

		Project project = projectRepository.findProjectByAdminMember(loggedAdmin.getId(), orgId)
				.orElseThrow(() -> new ResourceNotFoundException("No project found assigned to this Admin"));

		List<User> usersToAdd = userRepository.findAllById(userIds);

		for (User user : usersToAdd) {
			if (user.getOrganization() == null || !user.getOrganization().getId().equals(orgId)) {
				throw new UnlinkedUserException("User " + user.getName() + " is not part of your organization");
			}
		}

		for (User user : usersToAdd) {
			projectRepository.addMemberLink(project.getId(), user.getId());
		}
	}

	@Override
	@Transactional
	public void assignAdminToProject(AssignAdminRequest request) {
	    User currentUser = getLoggedInUser();
	    UUID orgId = getOrgIdOrThrow(currentUser);

	    Project project = projectRepository.findByIdAndOrganization_Id(request.getProjectId(), orgId)
	            .orElseThrow(() -> new ResourceNotFoundException("Project not found within your organization"));

	    List<User> currentAdmins = userRepository.findAdminsByProjectId(project.getId());

	    Set<UUID> newAdminIds = request.getUserIds() != null ? new HashSet<>(request.getUserIds()) : Collections.emptySet();

	    for (User oldAdmin : currentAdmins) {
	        if (!newAdminIds.contains(oldAdmin.getId())) {
	            
	            boolean managesOtherProjects = projectRepository.existsByAdminIdAndIdNot(oldAdmin.getId(), project.getId());
	            
	            if (!managesOtherProjects) {
	                oldAdmin.setRole(Role.MEMBER);
	                userRepository.save(oldAdmin); 
	            }
	        }
	    }
	    projectRepository.clearAllAdminsFromProject(project.getId());

	    if (newAdminIds.isEmpty()) {
	        return;
	    }

	    List<User> targetUsers = userRepository.findAllById(request.getUserIds());
	    if (targetUsers.isEmpty()) {
	        throw new ResourceNotFoundException("No valid users found for the provided IDs");
	    }

	    for (User user : targetUsers) {
	        if (!user.getOrganization().getId().equals(orgId)) {
	            throw new AccessDeniedException("User " + user.getName() + " does not belong to your organization");
	        }

	        if (user.getRole() != Role.ADMIN) {
	            user.setRole(Role.ADMIN);
	            userRepository.save(user); 
	        }
	        projectRepository.safeAddMember(project.getId(), user.getId());
	    }
	}
	@Override
	@Transactional
	public void removeMemberFromProject(UUID userId) {
		User loggedAdmin = getLoggedInUser();
		UUID orgId = getOrgIdOrThrow(loggedAdmin);

		Project project = projectRepository.findProjectByAdminMember(loggedAdmin.getId(), orgId)
				.orElseThrow(() -> new ResourceNotFoundException("No project found assigned to this Admin"));

		projectRepository.removeMemberLink(project.getId(), userId);

		taskRepository.deleteByProjectIdAndAssignedToId(project.getId(), userId);

	}

}
