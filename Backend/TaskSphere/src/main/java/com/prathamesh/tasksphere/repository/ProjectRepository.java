package com.prathamesh.tasksphere.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prathamesh.tasksphere.model.Project;

public interface ProjectRepository extends JpaRepository<Project, UUID>{
	 List<Project> findByOrganization_Id(UUID organizationId);
	 Optional<Project> findByIdAndOrganization_Id(UUID projectId, UUID organizationId);
	 List<Project> findByMembers_Id(UUID userId);
}
