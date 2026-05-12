package com.prathamesh.tasksphere.exception;

public class OrganizationAlreadyExistsException extends RuntimeException {
	public OrganizationAlreadyExistsException(String message) {
		super(message);
	}
}
