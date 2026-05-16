package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import com.prathamesh.tasksphere.dto.OrganizationResponse;
import com.prathamesh.tasksphere.dto.UserResponse;

public interface OwnerService {
	OrganizationResponse getMyOrganization();
	List<UserResponse> getOrganizationMembers();
	void removeMember(UUID userId);
	
}
