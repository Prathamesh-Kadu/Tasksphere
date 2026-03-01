package com.prathamesh.tasksphere.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prathamesh.tasksphere.model.Role;
import com.prathamesh.tasksphere.model.User;

public interface UserRepository extends JpaRepository<User, UUID> {
	Optional<User> findByEmail(String email);
	boolean existsByRole(Role role);
}