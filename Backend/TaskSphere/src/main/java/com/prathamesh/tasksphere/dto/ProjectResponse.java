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
public class ProjectResponse {
	private UUID id;
	private String name;
	private String description;
	private String organizationName;
	private LocalDateTime createdAt;
	private List<String> admins;
}
