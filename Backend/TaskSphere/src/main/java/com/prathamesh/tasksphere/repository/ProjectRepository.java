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
import org.springframework.transaction.annotation.Transactional;

import com.prathamesh.tasksphere.model.Project;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
	long countByOrganizationId(UUID organizationId);

	@Query("SELECT p.id FROM Project p JOIN p.members m WHERE m.id = :userId")
	List<UUID> findProjectIdsByUserId(@Param("userId") UUID userId);

	List<Project> findByOrganization_Id(UUID organizationId);

	Optional<Project> findByIdAndOrganization_Id(UUID projectId, UUID organizationId);

	List<Project> findByMembers_Id(UUID userId);

	@Query("SELECT COUNT(p) > 0 FROM Project p JOIN p.members m WHERE m.id = :userId AND p.id != :currentProjectId")
	boolean existsByAdminIdAndIdNot(@Param("userId") UUID userId, @Param("currentProjectId") UUID currentProjectId);

	@Modifying
	@Query(value = "DELETE FROM project_members WHERE user_id = :userId", nativeQuery = true)
	void removeUserFromAllProjects(@Param("userId") UUID userId);

	@Query("SELECT p FROM Project p LEFT JOIN FETCH p.organization "
			+ "WHERE (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
	Page<Project> findAllWithOrganization(@Param("search") String search, Pageable pageable);

	@Query("SELECT p FROM Project p WHERE p.organization.id = :orgId "
			+ "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
	Page<Project> findByOrganization_Id(@Param("orgId") UUID orgId, @Param("search") String search, Pageable pageable);

	@Query("SELECT p FROM Project p JOIN p.members m WHERE m.id = :userId "
			+ "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
	Page<Project> findByMemberId(@Param("userId") UUID userId, @Param("search") String search, Pageable pageable);

	@Modifying
	@Transactional
	@Query(value = "DELETE FROM project_members WHERE project_id = :projectId", nativeQuery = true)
	void deleteProjectMembers(@Param("projectId") UUID projectId);

	@Query("SELECT p FROM Project p " + "JOIN p.members m "
			+ "WHERE m.id = :adminId AND m.role = com.prathamesh.tasksphere.model.Role.ADMIN "
			+ "AND p.organization.id = :orgId")
	Optional<Project> findProjectByAdminMember(@Param("adminId") UUID adminId, @Param("orgId") UUID orgId);

	@Query(value = "DELETE FROM project_members WHERE project_id = :projectId AND user_id = :userId", nativeQuery = true)
	void removeMemberLink(@Param("projectId") UUID projectId, @Param("userId") UUID userId);

	@Modifying
	@Query(value = "INSERT IGNORE INTO project_members (project_id, user_id) VALUES (:projectId, :userId)", nativeQuery = true)
	void addMemberLink(@Param("projectId") UUID projectId, @Param("userId") UUID userId);

	@Query("SELECT p.name FROM Project p JOIN p.members m WHERE m.id = :userId")
	List<String> findProjectNamesByUserId(@Param("userId") UUID userId);

	@Modifying
	@Query(value = "INSERT IGNORE INTO project_members (project_id, user_id) VALUES (:projectId, :userId)", nativeQuery = true)
	void safeAddMember(@Param("projectId") UUID projectId, @Param("userId") UUID userId);

	@Modifying
	@Query(value = "DELETE FROM project_members WHERE project_id = :projectId AND user_id = :userId", nativeQuery = true)
	void safeRemoveMember(@Param("projectId") UUID projectId, @Param("userId") UUID userId);

	@Modifying
	@Query(value = "DELETE FROM project_members WHERE project_id = :projectId AND user_id IN (SELECT u.id FROM users u WHERE u.role = 'ADMIN')", nativeQuery = true)
	void clearAllAdminsFromProject(@Param("projectId") UUID projectId);

	@Modifying
	@Query(value = "DELETE pm FROM project_members pm INNER JOIN projects p ON pm.project_id = p.id WHERE p.organization_id = :orgId", nativeQuery = true)
	void deleteProjectMembersByOrganizationId(@Param("orgId") UUID orgId);

	@Modifying
	@Query("DELETE FROM Project p WHERE p.organization.id = :orgId")
	void deleteByOrganizationId(@Param("orgId") UUID orgId);
}
