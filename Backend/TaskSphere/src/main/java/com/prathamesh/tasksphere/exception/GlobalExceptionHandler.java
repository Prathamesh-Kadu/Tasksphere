package com.prathamesh.tasksphere.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<ApiError> handleEmailExists(EmailAlreadyExistsException ex, HttpServletRequest request){
		ApiError error = ApiError.builder()
				.timestamp(LocalDateTime.now())
				.statusCode(HttpStatus.CONFLICT.value())
				.error("Registration Error")
				.message(ex.getMessage())
				.path(request.getRequestURI())
				.build();
		return new ResponseEntity<>(error,HttpStatus.CONFLICT);
	}

	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<ApiError> handleInvalidCredential(InvalidCredentialsException ex, HttpServletRequest request){
		ApiError error = ApiError.builder()
				.timestamp(LocalDateTime.now())
				.statusCode(HttpStatus.UNAUTHORIZED.value())
				.error("Login Error")
				.message(ex.getMessage())
				.path(request.getRequestURI())
				.build();
		return new ResponseEntity<>(error,HttpStatus.UNAUTHORIZED);
	}
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request){
		Map<String, String> errors = new HashMap<>();
		
		ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
		
		return new ResponseEntity<>(errors,HttpStatus.BAD_REQUEST);
	}
}
