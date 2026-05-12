package com.prathamesh.tasksphere.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prathamesh.tasksphere.dto.ProjectRequest;
import com.prathamesh.tasksphere.dto.ProjectResponse;
import com.prathamesh.tasksphere.service.ProjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {

	private final ProjectService projectService;

	@PostMapping
	@PreAuthorize("hasRole('OWNER')")
	public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request) {
		return new ResponseEntity<>(projectService.createProject(request), HttpStatus.CREATED);
	}

	@GetMapping
	@PreAuthorize("hasRole('OWNER') or hasRole('ADMIN') or hasRole('MEMBER')")
	public ResponseEntity<List<ProjectResponse>> getProjects() {
		return new ResponseEntity<>(projectService.getProjects(), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('OWNER') or hasRole('ADMIN') or hasRole('MEMBER')")
	public ResponseEntity<ProjectResponse> getProject(@PathVariable UUID id) {
		return new ResponseEntity<>(projectService.getProject(id), HttpStatus.OK);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('OWNER')")
	public ResponseEntity<ProjectResponse> updateProject(@PathVariable UUID id,
			@Valid @RequestBody ProjectRequest request) {
		return new ResponseEntity<>(projectService.updateProject(id, request), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('OWNER')")
	public ResponseEntity<String> deleteProject(@PathVariable UUID id) {
		projectService.deleteProject(id);
		return new ResponseEntity<>("Project deleted", HttpStatus.OK);
	}

	@PostMapping("/{projectId}/members/{userId}")
	@PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
	public ResponseEntity<String> assignMember(@PathVariable UUID projectId,@PathVariable UUID userId) {
		projectService.assignMemberToProject(projectId,userId);
		return new ResponseEntity<>("Member assigned to project", HttpStatus.OK);
	}
}
