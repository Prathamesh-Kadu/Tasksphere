package com.prathamesh.tasksphere.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationResponse {
	private UUID id;
	private String name;
	private String description;
	private LocalDateTime createdAt;
	private long projectCount;
	private long userCount;
	private List<UserResponse> owners;

	public OrganizationResponse(UUID id, String name, String description, LocalDateTime createdAt, long projectCount,
			long userCount) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.createdAt = createdAt;
		this.projectCount = projectCount;
		this.userCount = userCount;
	}
}
