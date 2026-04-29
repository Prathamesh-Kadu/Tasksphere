package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import com.prathamesh.tasksphere.dto.OrganizationResponse;
import com.prathamesh.tasksphere.dto.UserResponse;

public interface OwnerService {
	OrganizationResponse getMyOrganization();
	UserResponse addMember(UUID userId);
	List<UserResponse> getOrganizationMembers();
	UserResponse updateRole(UUID userId, String role);
	void removeMember(UUID userId);
	
}
