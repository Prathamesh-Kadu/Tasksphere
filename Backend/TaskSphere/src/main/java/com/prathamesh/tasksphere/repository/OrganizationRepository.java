package com.prathamesh.tasksphere.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.prathamesh.tasksphere.dto.OrganizationResponse;
import com.prathamesh.tasksphere.model.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
	boolean existsByName(String name);

	@Query("Select new com.prathamesh.tasksphere.dto.OrganizationResponse(" + "o.id, o.name, o.description, o.createdAt,"
			+ "(Select count(p) from Project p where p.organization = o),"
			+ "(Select count(u) from User u where u.organization = o))" + "From Organization o where o.id = :id")
	Optional<OrganizationResponse> findDetailedInfoById(@Param("id") UUID id);
}