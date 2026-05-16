package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.prathamesh.tasksphere.dto.AssignAdminRequest;
import com.prathamesh.tasksphere.dto.ProjectRequest;
import com.prathamesh.tasksphere.dto.ProjectResponse;

public interface ProjectService {
	ProjectResponse createProject(ProjectRequest request);

	Page<ProjectResponse> getProjects(String search, int page, int size);

	ProjectResponse getProject(UUID id);

	ProjectResponse updateProject(UUID id, ProjectRequest request);

	void deleteProject(UUID id);

	void assignMemberToProject(List<UUID> userIds);

	void assignAdminToProject(AssignAdminRequest request);
	
	void removeMemberFromProject(UUID userId);
}
