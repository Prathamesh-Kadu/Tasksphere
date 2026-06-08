package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prathamesh.tasksphere.dto.UserResponse;
import com.prathamesh.tasksphere.exception.ResourceNotFoundException;
import com.prathamesh.tasksphere.exception.UnlinkedUserException;
import com.prathamesh.tasksphere.exception.UserOrganizationConflictException;
import com.prathamesh.tasksphere.model.Organization;
import com.prathamesh.tasksphere.model.Role;
import com.prathamesh.tasksphere.model.User;
import com.prathamesh.tasksphere.repository.ProjectRepository;
import com.prathamesh.tasksphere.repository.UserRepository;
import com.prathamesh.tasksphere.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final UserRepository userRepository;
	private final ProjectRepository projectRepository;

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
	@Transactional(readOnly = true)
	public UserResponse getProfile() {
	    User detachedUser = getLoggedInUser();
	    
	    User existingUser = userRepository.findById(detachedUser.getId())
	            .orElseThrow(() -> new ResourceNotFoundException("User profile session lost"));

	    UserResponse.UserResponseBuilder builder = UserResponse.builder()
	            .id(existingUser.getId())
	            .name(existingUser.getName())
	            .email(existingUser.getEmail())
	            .role(existingUser.getRole());

	    if (existingUser.getRole() == Role.OWNER) {
	        if (existingUser.getOrganization() != null) {
	            builder.organizationName(existingUser.getOrganization().getName());
	        }
	    } 
	    else if (existingUser.getRole() == Role.ADMIN || existingUser.getRole() == Role.MEMBER) {
	        
	        List<String> projectNames = projectRepository.findProjectNamesByUserId(existingUser.getId());
	        builder.projectNames(projectNames);
	        
	        if (existingUser.getOrganization() != null) {
	            builder.organizationName(existingUser.getOrganization().getName());
	        }
	    }

	    return builder.build();
	}

	@Override
	public Page<UserResponse> searchUsers(String name, int page, int size) {

		User loggedUser = getLoggedInUser();
		Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
		Page<User> users;

		if (loggedUser.getRole() == Role.ADMIN) {
			UUID orgId = getOrgIdOrThrow(loggedUser);
			users = userRepository.searchInOrganization(orgId, loggedUser.getId(), name, pageable);
		} else {
			users = userRepository.findByOrganizationIdIsNullAndNameContainingIgnoreCase(name, pageable);
		}

		return users.map(user -> UserResponse.builder().id(user.getId()).name(user.getName()).email(user.getEmail())
				.role(user.getRole()).build());
	}

	public Page<UserResponse> getOrganizationMembers(String name, int page, int size) {
	    User logged = getLoggedInUser();
	    UUID orgId = getOrgIdOrThrow(logged);
	    Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

	    Page<User> userPage;

	    if (logged.getRole() == Role.SUPER_ADMIN) {
	        userPage = userRepository.searchGlobal(name, pageable);
	    } else if (logged.getRole() == Role.OWNER) {
	        userPage = userRepository.searchInOrganization(orgId, logged.getId(), name, pageable);
	    } else if (logged.getRole() == Role.ADMIN) {
	        userPage = userRepository.searchInProjectByAdmin(logged.getId(), orgId, name, pageable);
	    } else if (logged.getRole() == Role.MEMBER) {
	        userPage = userRepository.searchInProjectByMember(logged.getId(), name, pageable);
	    } else {
	        throw new AccessDeniedException("Unauthorized");
	    }

	    return userPage.map(user -> {
	        String orgName = (user.getOrganization() != null) ? user.getOrganization().getName() : "N/A";
	       
	        List<String> projects = null;
	        
	        if (logged.getRole() == Role.OWNER || logged.getRole() == Role.SUPER_ADMIN) {
	            projects = projectRepository.findProjectNamesByUserId(user.getId());


	            if (projects == null) {
	                projects = List.of();
	            }
	        }

	        return UserResponse.builder()
	                .id(user.getId())
	                .name(user.getName())
	                .email(user.getEmail())
	                .role(user.getRole())
	                .organizationName(orgName)
	                .projectNames(projects)
	                .build();
	    });
	}
	@Transactional
	@Override
	public void removeMemberFromOrganization(UUID targetUserId) {
		User user = getLoggedInUser();
		Organization org = user.getOrganization();

		User targetUser = userRepository.findById(targetUserId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (targetUser.getOrganization() == null || !targetUser.getOrganization().getId().equals(org.getId())) {
			throw new ResourceNotFoundException("Target user does not belong to your organization");
		}

		projectRepository.removeUserFromAllProjects(targetUserId);

		if (targetUser.getProjects() != null) {
			targetUser.getProjects().clear();
		}

		targetUser.setOrganization(null);
		targetUser.setActive(false);

		userRepository.save(targetUser);
	}

	@Transactional
	@Override
	public void addMemberToOrganization(List<UUID> userId) {

		User owner = getLoggedInUser();
		Organization org = owner.getOrganization();

		List<User> targetUsers = userRepository.findAllById(userId);

		if (targetUsers.size() != userId.size()) {
			throw new ResourceNotFoundException("One or more users were not found");
		}

		for (User targetUser : targetUsers) {
			if (targetUser.getOrganization() != null) {
				throw new UserOrganizationConflictException(
						"User " + targetUser.getName() + " is already in an organization");
			}

			targetUser.setOrganization(org);
			targetUser.setActive(true);
			targetUser.setRole(Role.MEMBER);
		}

		userRepository.saveAll(targetUsers);
	}
}
