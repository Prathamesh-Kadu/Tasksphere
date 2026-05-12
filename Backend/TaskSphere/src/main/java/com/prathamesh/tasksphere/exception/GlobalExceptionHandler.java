package com.prathamesh.tasksphere.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<ApiError> handleEmailExists(EmailAlreadyExistsException ex, HttpServletRequest request) {
		ApiError error = ApiError.builder().timestamp(LocalDateTime.now()).statusCode(HttpStatus.CONFLICT.value())
				.error("Registration Error").message(ex.getMessage()).path(request.getRequestURI()).build();
		return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<ApiError> handleInvalidCredential(InvalidCredentialsException ex,
			HttpServletRequest request) {
		ApiError error = ApiError.builder().timestamp(LocalDateTime.now()).statusCode(HttpStatus.UNAUTHORIZED.value())
				.error("Login Error").message(ex.getMessage()).path(request.getRequestURI()).build();
		return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex,
			HttpServletRequest request) {
		Map<String, String> errors = new HashMap<>();

		ex.getBindingResult().getAllErrors().forEach((error) -> {
			String fieldName = ((FieldError) error).getField();
			String errorMessage = error.getDefaultMessage();
			errors.put(fieldName, errorMessage);
		});

		return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(OrganizationAlreadyExistsException.class)
	public ResponseEntity<ApiError> handleOrganizationExists(OrganizationAlreadyExistsException ex,
			HttpServletRequest request) {
		ApiError error = ApiError.builder().timestamp(LocalDateTime.now()).statusCode(HttpStatus.CONFLICT.value())
				.error("Organization error").message(ex.getMessage()).path(request.getRequestURI()).build();
		return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiError> handleResourcesNotExists(ResourceNotFoundException ex, HttpServletRequest request) {
		ApiError error = ApiError.builder().timestamp(LocalDateTime.now()).statusCode(HttpStatus.NOT_FOUND.value())
				.error("Resources not found").message(ex.getMessage()).path(request.getRequestURI()).build();
		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(UserOrganizationConflictException.class)
	public ResponseEntity<ApiError> handleUserOrganizationConflict(UserOrganizationConflictException ex,
			HttpServletRequest request) {
		ApiError error = ApiError.builder().timestamp(LocalDateTime.now()).statusCode(HttpStatus.CONFLICT.value())
				.error("User role error").message(ex.getMessage()).path(request.getRequestURI()).build();
		return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiError> handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {

		ApiError apiError = ApiError.builder().timestamp(LocalDateTime.now()).statusCode(HttpStatus.FORBIDDEN.value())
				.error("User accessibility error").message("You do not have permission to access this resource")
				.path(request.getRequestURI()).build();

		return new ResponseEntity<>(apiError, HttpStatus.FORBIDDEN);
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<ApiError> handleAuthenticationException(AuthenticationException ex,
			HttpServletRequest request) {

		ApiError apiError = ApiError.builder().timestamp(LocalDateTime.now())
				.statusCode(HttpStatus.UNAUTHORIZED.value()).error("User authentication error")
				.message("Authentication failed: " + ex.getMessage()).path(request.getRequestURI()).build();

		return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(UnlinkedUserException.class)
	public ResponseEntity<ApiError> handleUserOrganizationLinked(UnlinkedUserException ex, HttpServletRequest request) {

		ApiError apiError = ApiError.builder().timestamp(LocalDateTime.now()).statusCode(HttpStatus.NOT_FOUND.value())
				.error("User error").message(ex.getMessage()).path(request.getRequestURI()).build();

		return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(RoleAssignmentException.class)
	public ResponseEntity<ApiError> handleUserRole(RoleAssignmentException ex, HttpServletRequest request) {

		ApiError apiError = ApiError.builder().timestamp(LocalDateTime.now()).statusCode(HttpStatus.BAD_REQUEST.value())
				.error("User role error").message(ex.getMessage()).path(request.getRequestURI()).build();

		return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(IllegalActionException.class)
	public ResponseEntity<ApiError> handleUserAction(IllegalActionException ex, HttpServletRequest request) {

		ApiError apiError = ApiError.builder().timestamp(LocalDateTime.now()).statusCode(HttpStatus.BAD_REQUEST.value())
				.error("User action error").message(ex.getMessage()).path(request.getRequestURI()).build();

		return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
	}

}
