package com.prathamesh.tasksphere.service;

import org.springframework.data.domain.Page;

import com.prathamesh.tasksphere.dto.UserResponse;

public interface UserService {
	public UserResponse getProfile();

	Page<UserResponse> searchUsers(String name, int page, int size);
}
