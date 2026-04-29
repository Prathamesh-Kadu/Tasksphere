package com.prathamesh.tasksphere.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prathamesh.tasksphere.dto.UserResponse;
import com.prathamesh.tasksphere.model.User;
import com.prathamesh.tasksphere.repository.UserRepository;
import com.prathamesh.tasksphere.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final UserRepository userRepository;

	private User getLoggedInUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
		return userDetails.getUser();
	}

	@Override
	public UserResponse getProfile() {
		User existingUser = getLoggedInUser();

		return new UserResponse(existingUser.getId(), existingUser.getName(), existingUser.getEmail(),
				existingUser.getRole());
	}

	@Override
	public Page<UserResponse> searchUsers(String name, int page, int size) {
		
		Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

		Page<User> users = userRepository.findByOrganizationIdIsNullAndNameContainingIgnoreCase(name, pageable);

		return users.map(user -> UserResponse.builder().id(user.getId()).name(user.getName()).email(user.getEmail())
				.role(user.getRole()).build());
	}
}
