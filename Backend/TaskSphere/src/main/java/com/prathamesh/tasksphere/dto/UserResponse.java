package com.prathamesh.tasksphere.dto;

import java.util.UUID;

import com.prathamesh.tasksphere.model.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
	private UUID id;
	private String name;
	private String email;
	private Role role;
}
