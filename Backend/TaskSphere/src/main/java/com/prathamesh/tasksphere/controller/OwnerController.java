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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prathamesh.tasksphere.dto.OrganizationResponse;
import com.prathamesh.tasksphere.dto.UserResponse;
import com.prathamesh.tasksphere.service.OwnerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OWNER')")
public class OwnerController {

	private final OwnerService ownerService;

	@GetMapping("/org")
	public ResponseEntity<OrganizationResponse> getMyOrganization() {
		return new ResponseEntity<>(ownerService.getMyOrganization(), HttpStatus.OK);
	}

	@GetMapping("/members")
	public ResponseEntity<List<UserResponse>> getMembers() {
		return new ResponseEntity<>(ownerService.getOrganizationMembers(), HttpStatus.OK);
	}



	@PostMapping("/members/{userId}")
	public ResponseEntity<UserResponse> addMember(@PathVariable UUID userId) {
		return new ResponseEntity<>(ownerService.addMember(userId), HttpStatus.OK);
	}

	@PutMapping("/members/{id}/{role}")
	public ResponseEntity<UserResponse> updateRole(@PathVariable UUID id, @PathVariable String role) {
		return new ResponseEntity<>(ownerService.updateRole(id, role), HttpStatus.OK);
	}

	@DeleteMapping("/members/{id}")
	public ResponseEntity<Void> removeMember(@PathVariable UUID id) {
		ownerService.removeMember(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
