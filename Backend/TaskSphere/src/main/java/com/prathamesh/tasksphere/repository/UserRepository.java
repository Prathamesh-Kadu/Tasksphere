package com.prathamesh.tasksphere.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.prathamesh.tasksphere.model.Role;
import com.prathamesh.tasksphere.model.User;

public interface UserRepository extends JpaRepository<User, UUID> {
	Optional<User> findByEmail(String email);
	
	List<User> findByOrganizationId(UUID organizationId);

	Optional<User> findByIdAndOrganizationId(UUID userId, UUID organizationId);

	Page<User> findByOrganizationIdIsNullAndNameContainingIgnoreCase(String name, Pageable pageable);
	
	List<User> findByOrganizationIdAndRole(UUID organizationId, Role role);
	
}