package com.prathamesh.tasksphere.dto;

import com.prathamesh.tasksphere.model.TaskStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskStatusUpdateRequest {
    @NotNull(message = "Status cannot be null")
    private TaskStatus status;
}