package com.prathamesh.tasksphere.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prathamesh.tasksphere.dto.TaskRequest;
import com.prathamesh.tasksphere.dto.TaskResponse;
import com.prathamesh.tasksphere.service.TaskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/task")
@RequiredArgsConstructor
public class TaskController {

	private final TaskService taskService;

	@PostMapping
	@PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
	public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
		return new ResponseEntity<>(taskService.createTask(request),HttpStatus.CREATED);
	}

	@GetMapping("/project/{projectId}")
	@PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
	public ResponseEntity<List<TaskResponse>> getTasksByProject(@PathVariable UUID projectId){
		return new ResponseEntity<>(taskService.getTasksByProject(projectId),HttpStatus.OK);
	}

	@GetMapping("/{taskId}")
	@PreAuthorize("hasRole('OWNER') or hasRole('ADMIN') or hasRole('MEMBER')")
	public ResponseEntity<TaskResponse> getTask(@PathVariable UUID taskId) {
		return new ResponseEntity<>(taskService.getTask(taskId),HttpStatus.OK);
	}

	@PutMapping("/{taskId}")
	@PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
	public ResponseEntity<TaskResponse> updateTask(@PathVariable UUID taskId,
			@Valid @RequestBody TaskRequest request) {
		return new ResponseEntity<>(taskService.updateTask(taskId, request),HttpStatus.OK);
	}
 
	@DeleteMapping("/{taskId}")
	@PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
	public ResponseEntity<String> deleteTask(@PathVariable UUID taskId) {
		taskService.deleteTask(taskId);
		return new ResponseEntity<>("Task deleted",HttpStatus.OK);
	}

	@GetMapping("/my-tasks")
	@PreAuthorize("hasRole('MEMBER')")
	public ResponseEntity<List<TaskResponse>> getMyTasks() {
		return new ResponseEntity<>(taskService.getMyTasks(),HttpStatus.OK);
	}
}