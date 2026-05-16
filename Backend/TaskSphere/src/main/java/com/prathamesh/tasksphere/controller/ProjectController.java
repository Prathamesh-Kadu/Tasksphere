package com.prathamesh.tasksphere.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prathamesh.tasksphere.dto.AssignAdminRequest;
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

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('OWNER')")
	public ResponseEntity<ProjectResponse> updateProject(@PathVariable UUID id,
			@Valid @RequestBody ProjectRequest request) {
		return new ResponseEntity<>(projectService.updateProject(id, request), HttpStatus.OK);
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER','ADMIN')")
	public ResponseEntity<Page<ProjectResponse>> getProjects(@RequestParam(required = false) String search,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		return new ResponseEntity<>(projectService.getProjects(search, page, size), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('OWNER') or hasRole('ADMIN') or hasRole('MEMBER')")
	public ResponseEntity<ProjectResponse> getProject(@PathVariable UUID id) {
		return new ResponseEntity<>(projectService.getProject(id), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('OWNER')")
	public ResponseEntity<String> deleteProject(@PathVariable UUID id) {
		projectService.deleteProject(id);
		return new ResponseEntity<>("Project deleted", HttpStatus.OK);
	}

	@PostMapping("/my-project/members")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<String> assignMember(@RequestBody List<UUID> userIds) {
		projectService.assignMemberToProject(userIds);
		return new ResponseEntity<>("Member assigned to project", HttpStatus.OK);
	}

	@PutMapping("/assign-admin")
	@PreAuthorize("hasRole('OWNER')")
	public ResponseEntity<String> assignProjectAdmin(@Valid @RequestBody AssignAdminRequest request) {
		projectService.assignAdminToProject(request);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/my-project/members/{userId}")
	public ResponseEntity<Void> removeMemberFromMyProject(@PathVariable UUID userId) {
	    projectService.removeMemberFromProject(userId);
	    return ResponseEntity.ok().build();
	}
}
