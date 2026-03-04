package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import com.prathamesh.tasksphere.dto.AssignOwnerRequest;
import com.prathamesh.tasksphere.dto.OrganizationRequest;
import com.prathamesh.tasksphere.dto.OrganizationResponse;

public interface OrganizationService {
	OrganizationResponse createOrganization(OrganizationRequest request);
	List<OrganizationResponse> getAllOrganizations();
	OrganizationResponse getOrganizationById(UUID organizationId);
	OrganizationResponse updateOrganization(UUID organizationId,OrganizationRequest request);
	void deleteOrganization(UUID organizationId);
	void assignOwner(AssignOwnerRequest request);
}
