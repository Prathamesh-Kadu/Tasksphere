package com.prathamesh.tasksphere.service;

import com.prathamesh.tasksphere.dto.LoginRequest;
import com.prathamesh.tasksphere.dto.LoginResponse;
import com.prathamesh.tasksphere.dto.RegisterRequest;
import com.prathamesh.tasksphere.dto.RegisterResponse;

public interface AuthService {
	RegisterResponse register(RegisterRequest request);
	LoginResponse login(LoginRequest request);
}
