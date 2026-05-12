package com.prathamesh.tasksphere.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prathamesh.tasksphere.dto.LoginRequest;
import com.prathamesh.tasksphere.dto.LoginResponse;
import com.prathamesh.tasksphere.dto.RegisterRequest;
import com.prathamesh.tasksphere.dto.RegisterResponse;
import com.prathamesh.tasksphere.exception.EmailAlreadyExistsException;
import com.prathamesh.tasksphere.exception.InvalidCredentialsException;
import com.prathamesh.tasksphere.model.Role;
import com.prathamesh.tasksphere.model.User;
import com.prathamesh.tasksphere.repository.UserRepository;
import com.prathamesh.tasksphere.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	@Override
	public RegisterResponse register(RegisterRequest request) {
		
		if (userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new EmailAlreadyExistsException("This email address is already registered.");
		}

		User newUser = User.builder()
				.name(request.getName())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.MEMBER).build();

		User existingUser = userRepository.save(newUser);

		return new RegisterResponse(existingUser.getId(), existingUser.getName(), existingUser.getEmail());
	}

	@Override
	public LoginResponse login(LoginRequest request) {
		User existingUser = userRepository.findByEmail(request.getEmail()).orElseThrow(()->new InvalidCredentialsException("Invalid credentials"));
		if(!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
			throw new InvalidCredentialsException("Invalid credentials");
		}
		String token = jwtService.generateToken(existingUser);
		return new LoginResponse(existingUser.getId(),existingUser.getName(),existingUser.getEmail(),existingUser.getRole(),token);
	}

}
