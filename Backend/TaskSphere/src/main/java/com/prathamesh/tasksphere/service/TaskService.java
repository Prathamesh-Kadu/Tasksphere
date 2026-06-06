package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.prathamesh.tasksphere.dto.TaskRequest;
import com.prathamesh.tasksphere.dto.TaskResponse;
import com.prathamesh.tasksphere.model.TaskStatus;

public interface TaskService {
	TaskResponse createTask(TaskRequest request);
	TaskResponse getTask(UUID taskId);
	TaskResponse updateTask(UUID id, TaskRequest request);
	void deleteTask(UUID id);
	List<TaskResponse> getMyTasks();
	Page<TaskResponse> getTasks(String search, int page, int size);
	void updateTaskStatus(UUID taskId, TaskStatus newStatus);
}
