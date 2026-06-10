package com.prathamesh.tasksphere.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.prathamesh.tasksphere.model.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse { 
	private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDateTime dueDate;
    private String assignedToUser;   
    private String projectName;
    private String organizationName;
}
