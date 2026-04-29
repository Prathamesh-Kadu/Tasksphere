package com.prathamesh.tasksphere.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
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
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	public ResponseEntity<Page<UserResponse>> searchUsers(@RequestParam @Size(min = 1) String query, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		return new ResponseEntity<>(userService.searchUsers(query, page, size), HttpStatus.OK);
	}
}