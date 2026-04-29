package com.prathamesh.tasksphere.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prathamesh.tasksphere.dto.AssignOwnerRequest;
import com.prathamesh.tasksphere.dto.OrganizationRequest;
import com.prathamesh.tasksphere.dto.OrganizationResponse;
import com.prathamesh.tasksphere.dto.UserResponse;
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

		return OrganizationResponse.builder().id(existingOrganization.getId()).name(existingOrganization.getName())
				.description(existingOrganization.getDescription()).build();
	}

	@Override
	public List<OrganizationResponse> getAllOrganizations() {
		return organizationRepository.findAll().stream().map((e) -> OrganizationResponse.builder().id(e.getId())
				.name(e.getName()).description(e.getDescription()).build()).toList();
	}

	@Override
	public OrganizationResponse getOrganizationById(UUID organizationId) {
		OrganizationResponse response = organizationRepository.findDetailedInfoById(organizationId)
				.orElseThrow(() -> new ResourceNotFoundException("Organization not found with ID: " + organizationId));

		List<User> owners = userRepository.findByOrganizationIdAndRole(organizationId, Role.OWNER);

		response.setOwners(owners.stream()
				.map(u -> UserResponse.builder().id(u.getId()).name(u.getName()).email(u.getEmail()).build()).toList());

		return response;
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

		return OrganizationResponse.builder().id(existingOrganization.getId()).name(existingOrganization.getName())
				.description(existingOrganization.getDescription()).build();
	}

	@Override
	@Transactional
	public void deleteOrganization(UUID organizationId) {
		Organization existingOrganization = organizationRepository.findById(organizationId)
				.orElseThrow(() -> new ResourceNotFoundException("Organization not found with ID: " + organizationId));

		for (User user : existingOrganization.getUsers()) {
			user.setOrganization(null);
		}
		existingOrganization.getUsers().clear();

		organizationRepository.delete(existingOrganization);
	}

	@Override
	@Transactional
	public void assignOwner(AssignOwnerRequest request) {
		Organization organization = organizationRepository.findById(request.getOrganizationId()).orElseThrow(
				() -> new ResourceNotFoundException("Organization not found with Id: " + request.getOrganizationId()));

		List<User> existingOwners = userRepository.findByOrganizationIdAndRole(organization.getId(), Role.OWNER);
		
		Set<UUID> incomingIds = new HashSet<>(request.getUserIds());
		Set<UUID> existingIds = existingOwners.stream()
				.map(user-> user.getId())
				.collect(Collectors.toSet());
		
		List<User> usersToRemove = existingOwners.stream()
	            .filter(user -> !incomingIds.contains(user.getId()))
	            .toList();
		
		for (User user : usersToRemove) {
	        user.setOrganization(null);
	        user.setRole(Role.MEMBER);
	    }
		
		List<UUID> usersToAdd = incomingIds.stream()
	            .filter(id -> !existingIds.contains(id))
	            .toList();
		
		for (UUID userId : usersToAdd) {
	        User user = userRepository.findById(userId)
	                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
	        
	        if (user.getOrganization() != null) {
	            throw new UserOrganizationConflictException("User " + user.getName() + " is already in an organization.");
	        }

	        user.setOrganization(organization);
	        user.setRole(Role.OWNER);
	    }

	}

}
