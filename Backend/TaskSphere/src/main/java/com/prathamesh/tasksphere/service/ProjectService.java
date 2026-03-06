package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import com.prathamesh.tasksphere.dto.ProjectRequest;
import com.prathamesh.tasksphere.dto.ProjectResponse;

public interface ProjectService {
	ProjectResponse createProject(ProjectRequest request);

	List<ProjectResponse> getProjects();

	ProjectResponse getProject(UUID id);

	ProjectResponse updateProject(UUID id, ProjectRequest request);

	void deleteProject(UUID id);
	
	void assignMemberToProject(UUID projectId,UUID userId);
}
