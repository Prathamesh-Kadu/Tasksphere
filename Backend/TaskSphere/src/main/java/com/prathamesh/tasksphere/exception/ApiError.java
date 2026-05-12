package com.prathamesh.tasksphere.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiError {
	private LocalDateTime timestamp;
	private int statusCode;
	private String error;
	private String message;
	private String path;
}
