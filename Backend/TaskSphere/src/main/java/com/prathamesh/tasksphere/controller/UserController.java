package com.prathamesh.tasksphere.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prathamesh.tasksphere.dto.UserResponse;
import com.prathamesh.tasksphere.service.UserService;

import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping("/me")
	public ResponseEntity<UserResponse> getCurrentUser() {
		return new ResponseEntity<>(userService.getProfile(), HttpStatus.OK);
	}

	@GetMapping("/search")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ADMIN')")
	public ResponseEntity<Page<UserResponse>> searchUsers(@RequestParam @Size(min = 1) String query,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		return new ResponseEntity<>(userService.searchUsers(query, page, size), HttpStatus.OK);
	}

	@GetMapping("/members")
	public ResponseEntity<Page<UserResponse>> getMembers(@RequestParam(required = false) String name,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

		return ResponseEntity.ok(userService.getOrganizationMembers(name, page, size));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('OWNER')")
	public ResponseEntity<Void> removeMember(@PathVariable UUID id) {
		userService.removeMemberFromOrganization(id);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/members/{userId}")
	@PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
	public ResponseEntity<Void> addMemberToOrganization(@PathVariable List<UUID> userId) {
		userService.addMemberToOrganization(userId);
		return ResponseEntity.ok().build();
	}
}