package com.prathamesh.tasksphere.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.prathamesh.tasksphere.model.TaskStatus;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskRequest {
	@NotBlank(message = "Title is required and cannot be empty")
	private String title;
	
	@NotBlank(message = "Description is required and cannot be empty")
	private String description;
	
	@FutureOrPresent(message = "Date must be today or in the future")
	@NotNull(message = "Due date is mandatory")
	private LocalDateTime dueDate;
	
	@NotNull(message = "Project ID is required")
	private UUID projectId;
	
	@NotNull(message = "Assigned user ID is required")
	private UUID assignedTo;
	
	private TaskStatus status;
}
