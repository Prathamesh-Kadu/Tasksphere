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

import com.prathamesh.tasksphere.dto.AssignOwnerRequest;
import com.prathamesh.tasksphere.dto.OrganizationRequest;
import com.prathamesh.tasksphere.dto.OrganizationResponse;
import com.prathamesh.tasksphere.service.OrganizationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/org")
@RequiredArgsConstructor
public class OrganizationController {
	private final OrganizationService organizationService;

	@PostMapping
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	public ResponseEntity<OrganizationResponse> createOrganization(@Valid @RequestBody OrganizationRequest request) {
		return new ResponseEntity<>(organizationService.createOrganization(request),HttpStatus.CREATED);
	}

	@GetMapping
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	public ResponseEntity<List<OrganizationResponse>> getAllOrganizations() {
		return new ResponseEntity<>(organizationService.getAllOrganizations(),HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	public ResponseEntity<OrganizationResponse> getOrganizationById(@PathVariable UUID id) {
		return new ResponseEntity<>(organizationService.getOrganizationById(id),HttpStatus.OK);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	public ResponseEntity<OrganizationResponse> updateOrganization(@PathVariable UUID id, @Valid @RequestBody OrganizationRequest request) {
	    return new ResponseEntity<>(organizationService.updateOrganization(id, request),HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	public ResponseEntity<Void> deleteOrganization(@PathVariable UUID id) {
		organizationService.deleteOrganization(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@PutMapping("/assign-owner")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	public ResponseEntity<Void>  assignOwner(@Valid @RequestBody AssignOwnerRequest request) {
	    organizationService.assignOwner(request);
	    return new ResponseEntity<>(HttpStatus.OK);
	}
}
