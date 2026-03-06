package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prathamesh.tasksphere.dto.ProjectRequest;
import com.prathamesh.tasksphere.dto.ProjectResponse;
import com.prathamesh.tasksphere.exception.ResourceNotFoundException;
import com.prathamesh.tasksphere.exception.UnlinkedUserException;
import com.prathamesh.tasksphere.model.Project;
import com.prathamesh.tasksphere.model.Role;
import com.prathamesh.tasksphere.model.User;
import com.prathamesh.tasksphere.repository.ProjectRepository;
import com.prathamesh.tasksphere.repository.UserRepository;
import com.prathamesh.tasksphere.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService {

	private final ProjectRepository projectRepository;
	private final UserRepository userRepository;
	

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

		User user = getLoggedInUser();
		getOrgIdOrThrow(user);

		Project project = Project.builder().name(request.getName()).description(request.getDescription())
				.organization(user.getOrganization()).createdBy(user.getId()).build();

		Project existingProject = projectRepository.save(project);

		return ProjectResponse.builder().id(existingProject.getId()).name(existingProject.getName())
				.description(existingProject.getDescription()).build();
	}

	@Override
	public List<ProjectResponse> getProjects() {

		User user = getLoggedInUser();

		List<Project> projects;

		if (user.getRole() == Role.MEMBER) {
			projects = projectRepository.findByMembers_Id(user.getId());
		} else {
			projects = projectRepository.findByOrganization_Id(user.getOrganization().getId());
		}

		return projects.stream().map(
				p -> ProjectResponse.builder().id(p.getId()).name(p.getName()).description(p.getDescription()).build())
				.toList();
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
		getOrgIdOrThrow(user);

		Project project = projectRepository.findByIdAndOrganization_Id(id, user.getOrganization().getId())
				.orElseThrow(() -> new ResourceNotFoundException("Project not found"));

		projectRepository.delete(project);
	}
	
	@Override
	@Transactional
	public void assignMemberToProject(UUID projectId,UUID userId) {

	    User loggedUser = getLoggedInUser();
	    getOrgIdOrThrow(loggedUser);

	    Project project = projectRepository
	            .findByIdAndOrganization_Id(projectId, loggedUser.getOrganization().getId())
	            .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

	    User user = userRepository
	            .findByIdAndOrganizationId(userId, loggedUser.getOrganization().getId())
	            .orElseThrow(() -> new UnlinkedUserException("User not in same organization"));

	    project.getMembers().add(user);

	    projectRepository.save(project);
	}
}
