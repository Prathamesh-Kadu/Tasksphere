package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.prathamesh.tasksphere.dto.UserResponse;

public interface UserService {
	public UserResponse getProfile();

	Page<UserResponse> searchUsers(String name, int page, int size);
	
	Page<UserResponse> getOrganizationMembers(String name, int page, int size);
	
	void removeMemberFromOrganization(UUID targetUserId);
	
	void addMemberToOrganization(List<UUID> userId);
}
