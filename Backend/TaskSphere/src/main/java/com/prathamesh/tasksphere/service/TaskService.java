package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import com.prathamesh.tasksphere.dto.TaskRequest;
import com.prathamesh.tasksphere.dto.TaskResponse;

public interface TaskService {
	TaskResponse createTask(TaskRequest request);
	List<TaskResponse> getTasksByProject(UUID projectId);
	TaskResponse getTask(UUID taskId);
	TaskResponse updateTask(UUID id, TaskRequest request);
	void deleteTask(UUID id);
	List<TaskResponse> getMyTasks();
}
