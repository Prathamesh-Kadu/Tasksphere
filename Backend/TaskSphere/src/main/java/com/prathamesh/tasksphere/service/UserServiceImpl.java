package com.prathamesh.tasksphere.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prathamesh.tasksphere.dto.UserResponse;
import com.prathamesh.tasksphere.model.User;
import com.prathamesh.tasksphere.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	
	private User getLoggedInUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
		return userDetails.getUser();
	}
	
	@Override
	public UserResponse getProfile() {
		User existingUser = getLoggedInUser();  
		
        return new UserResponse(existingUser.getId(),existingUser.getName(),existingUser.getEmail(),existingUser.getRole());
    }
}
