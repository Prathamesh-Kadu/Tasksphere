package com.prathamesh.tasksphere.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prathamesh.tasksphere.dto.OrganizationResponse;
import com.prathamesh.tasksphere.dto.UserResponse;
import com.prathamesh.tasksphere.exception.IllegalActionException;
import com.prathamesh.tasksphere.exception.OrganizationAlreadyExistsException;
import com.prathamesh.tasksphere.exception.ResourceNotFoundException;
import com.prathamesh.tasksphere.exception.RoleAssignmentException;
import com.prathamesh.tasksphere.exception.UnlinkedUserException;
import com.prathamesh.tasksphere.model.Organization;
import com.prathamesh.tasksphere.model.Role;
import com.prathamesh.tasksphere.model.User;
import com.prathamesh.tasksphere.repository.OrganizationRepository;
import com.prathamesh.tasksphere.repository.UserRepository;
import com.prathamesh.tasksphere.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OwnerServiceImpl implements OwnerService {
	private final UserRepository userRepository;
	private final OrganizationRepository organizationRepository;

	private User getLoggedInUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
		return userDetails.getUser();
	}

	private UUID getOrgIdOrThrow(User user) {
		if (user.getOrganization() == null) {
			throw new UnlinkedUserException(
					"Action failed: User ID " + user.getId() + " is not currently associated with any organization.");
		}
		return user.getOrganization().getId();
	}

	@Override
	public OrganizationResponse getMyOrganization() {

		User logged = getLoggedInUser();
		UUID orgId = getOrgIdOrThrow(logged);

		Organization org = organizationRepository.findById(orgId).orElseThrow(
				() -> new ResourceNotFoundException("Organization not found for users Id: " + logged.getId()));

		OrganizationResponse dto = new OrganizationResponse();
		dto.setId(org.getId());
		dto.setName(org.getName());
		dto.setDescription(org.getDescription());

		return dto;
	}

	@Override
	@Transactional
	public UserResponse addMember(UUID userId) {

		User logged = getLoggedInUser();
		UUID orgId = getOrgIdOrThrow(logged);

		User existUser = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

		if (existUser.getOrganization() != null) {
			throw new OrganizationAlreadyExistsException(
					"User already part of an organization name: " + existUser.getOrganization().getName());
		}

		Organization organization = organizationRepository.findById(orgId)
				.orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

		existUser.setOrganization(organization);
		existUser.setRole(Role.MEMBER);

		User user = userRepository.save(existUser);
		return UserResponse.builder().id(user.getId()).name(user.getName()).email(user.getEmail()).role(user.getRole())
				.build();
	}

	@Override
	public List<UserResponse> getOrganizationMembers() {

		User logged = getLoggedInUser();
		UUID orgId = getOrgIdOrThrow(logged);

		List<User> users = userRepository.findByOrganizationId(orgId);

		return users.stream().map(user -> UserResponse.builder().id(user.getId()).email(user.getEmail())
				.name(user.getName()).role(user.getRole()).build()).toList();
	}

	@Override
	@Transactional
	public UserResponse updateRole(UUID userId, String role) {

		Set<String> roles = new HashSet<>(Set.of("OWNER", "ADMIN", "MEMBER", "SUPER_ADMIN"));
		if (!roles.contains(role)) {
			throw new RoleAssignmentException(role + " is not a valid role.");
		}

		User logged = getLoggedInUser();
		UUID orgId = getOrgIdOrThrow(logged);

		User target = userRepository.findByIdAndOrganizationId(userId, orgId)
				.orElseThrow(() -> new UnlinkedUserException("User not in part of your organization"));

		if (target.getRole() == Role.OWNER) {
			throw new RoleAssignmentException("Cannot modify OWNER role");
		}

		Role newRole = Role.valueOf(role);

		if (newRole == Role.OWNER) {
			throw new RoleAssignmentException("Cannot assign OWNER role");
		} else if (newRole == Role.SUPER_ADMIN) {
			throw new RoleAssignmentException("Cannot assign Super_Admin role");
		}
		target.setRole(newRole);

		User user = userRepository.save(target);
		return UserResponse.builder().id(user.getId()).email(user.getEmail()).name(user.getName()).role(user.getRole())
				.build();
	}

	@Override
	public List<UserResponse> searchUsers(String name) {

		List<User> users = userRepository.findByOrganizationIdIsNullAndNameContainingIgnoreCase(name);

		return users.stream().map(user -> UserResponse.builder().id(user.getId()).name(user.getName())
				.email(user.getEmail()).role(user.getRole()).build()).toList();
	}

	@Override
	@Transactional
	public void removeMember(UUID userId) {

		User logged = getLoggedInUser();
		UUID orgId = getOrgIdOrThrow(logged);

		if (logged.getId().equals(userId)) {
			throw new IllegalActionException("Owner cannot remove himself");
		}

		User target = userRepository.findByIdAndOrganizationId(userId, orgId)
				.orElseThrow(() -> new ResourceNotFoundException("User not in your organization"));

		target.setOrganization(null);
		target.setRole(Role.MEMBER);

		userRepository.save(target);
	}
}
