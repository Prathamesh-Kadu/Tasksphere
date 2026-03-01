package com.prathamesh.tasksphere.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.prathamesh.tasksphere.model.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
	boolean existsByName(String name);
}