package com.prathamesh.tasksphere.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.prathamesh.tasksphere.model.Role;
import com.prathamesh.tasksphere.model.User;

public interface UserRepository extends JpaRepository<User, UUID> {
	Optional<User> findByEmail(String email);

	List<User> findByOrganizationId(UUID organizationId);

	Optional<User> findByIdAndOrganizationId(UUID userId, UUID organizationId);

	Page<User> findByOrganizationIdIsNullAndNameContainingIgnoreCase(String name, Pageable pageable);

	List<User> findByOrganizationIdAndRole(UUID organizationId, Role role);

	@Query("SELECT u FROM User u LEFT JOIN FETCH u.organization " + "WHERE u.role <> 'SUPER_ADMIN' "
			+ "AND (:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')))")
	Page<User> searchGlobal(String name, Pageable pageable);

	@Query("SELECT u FROM User u WHERE u.organization.id = :orgId " + "AND u.id <> :loggedUserId " + // Exclude the
																										// logged-in
																										// user
			"AND u.role <> 'SUPER_ADMIN' "
			+ "AND (:name IS NULL OR :name = '' OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')))")
	Page<User> searchInOrganization(@Param("orgId") UUID orgId, @Param("loggedUserId") UUID loggedUserId,
			@Param("name") String name, Pageable pageable);
	

}