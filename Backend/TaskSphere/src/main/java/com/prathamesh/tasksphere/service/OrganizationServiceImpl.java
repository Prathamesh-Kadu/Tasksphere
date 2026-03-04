package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prathamesh.tasksphere.dto.AssignOwnerRequest;
import com.prathamesh.tasksphere.dto.OrganizationRequest;
import com.prathamesh.tasksphere.dto.OrganizationResponse;
import com.prathamesh.tasksphere.exception.OrganizationAlreadyExistsException;
import com.prathamesh.tasksphere.exception.ResourceNotFoundException;
import com.prathamesh.tasksphere.exception.UserOrganizationConflictException;
import com.prathamesh.tasksphere.model.Organization;
import com.prathamesh.tasksphere.model.Role;
import com.prathamesh.tasksphere.model.User;
import com.prathamesh.tasksphere.repository.OrganizationRepository;
import com.prathamesh.tasksphere.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrganizationServiceImpl implements OrganizationService {
	private final OrganizationRepository organizationRepository;
	private final UserRepository userRepository;

	@Override
	@Transactional
	public OrganizationResponse createOrganization(OrganizationRequest request) {
		if (organizationRepository.existsByName(request.getName())) {
			throw new OrganizationAlreadyExistsException(
					"Organization with name " + request.getName() + " already exists");
		}

		Organization newOrganization = Organization.builder().name(request.getName())
				.description(request.getDescription()).build();
		Organization existingOrganization = organizationRepository.save(newOrganization);

		return new OrganizationResponse(existingOrganization.getId(), existingOrganization.getName(),
				existingOrganization.getDescription());
	}

	@Override
	public List<OrganizationResponse> getAllOrganizations() {
		return organizationRepository.findAll().stream().map((e) -> OrganizationResponse.builder().id(e.getId())
				.name(e.getName()).description(e.getDescription()).build()).toList();
	}

	@Override
	public OrganizationResponse getOrganizationById(UUID organizationId) {
		Organization existingOrganization = organizationRepository.findById(organizationId)
				.orElseThrow(() -> new ResourceNotFoundException("Organization not found with ID: " + organizationId));
		return OrganizationResponse.builder().id(existingOrganization.getId()).name(existingOrganization.getName())
				.description(existingOrganization.getDescription()).build();
	}

	@Override
	@Transactional
	public OrganizationResponse updateOrganization(UUID organizationId, OrganizationRequest request) {

		Organization existingOrganization = organizationRepository.findById(organizationId)
				.orElseThrow(() -> new ResourceNotFoundException("Organization not found with ID: " + organizationId));

		if (!existingOrganization.getName().equals(request.getName())
				&& organizationRepository.existsByName(request.getName())) {
			throw new OrganizationAlreadyExistsException(
					"Organization with name " + request.getName() + " already exists");
		}
		existingOrganization.setName(request.getName());
		existingOrganization.setDescription(request.getDescription());

		return new OrganizationResponse(existingOrganization.getId(), existingOrganization.getName(),
				existingOrganization.getDescription());
	}

	@Override
	@Transactional
	public void deleteOrganization(UUID organizationId) {
		Organization existingOrganization = organizationRepository.findById(organizationId)
				.orElseThrow(() -> new ResourceNotFoundException("Organization not found with ID: " + organizationId));
		organizationRepository.delete(existingOrganization);
	}

	@Override
	@Transactional
	public void assignOwner(AssignOwnerRequest request) {
		Organization organization = organizationRepository.findById(request.getOrganizationId()).orElseThrow(
				() -> new ResourceNotFoundException("Organization not found with Id: " + request.getOrganizationId()));

		User user = userRepository.findById(request.getUserId())
				.orElseThrow(() -> new ResourceNotFoundException("User not found with Id: " + request.getUserId()));

		if (user.getOrganization() != null) {
			throw new UserOrganizationConflictException("User with ID " + user.getId()
					+ " is already assigned to organization: " + user.getOrganization().getName());
		}

		user.setOrganization(organization);
		user.setRole(Role.OWNER);

		userRepository.save(user);
	}

}
