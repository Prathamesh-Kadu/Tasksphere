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

import com.prathamesh.tasksphere.model.Task;
import com.prathamesh.tasksphere.model.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, UUID> {
	List<Task> findByProject_Id(UUID projectId);

	List<Task> findByAssignedTo_Id(UUID userId);

	Optional<Task> findByIdAndProject_Id(UUID taskId, UUID projectId);

	@Modifying
	@Query("DELETE FROM Task t WHERE t.project.id = :projectId AND t.assignedTo.id = :userId")
	void deleteByProjectIdAndAssignedToId(@Param("projectId") UUID projectId, @Param("userId") UUID userId);

	@Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))")
	Page<Task> findAllGlobal(@Param("search") String search, Pageable pageable);

	@Query("SELECT t FROM Task t JOIN t.project p WHERE p.organization.id = :orgId "
			+ "AND LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))")
	Page<Task> findByOrganizationId(@Param("orgId") UUID orgId, @Param("search") String search, Pageable pageable);

	@Query("SELECT t FROM Task t JOIN t.project p JOIN p.members m WHERE m.id = :adminId "
			+ "AND LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))")
	Page<Task> findByAdminProjectScope(@Param("adminId") UUID adminId, @Param("search") String search,
			Pageable pageable);

	@Query("SELECT t FROM Task t WHERE t.assignedTo.id = :memberId "
			+ "AND LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))")
	Page<Task> findByAssignedUserId(@Param("memberId") UUID memberId, @Param("search") String search,
			Pageable pageable);

	@Query("SELECT COUNT(t) > 0 FROM Task t JOIN t.project.members m WHERE t.id = :taskId AND m.id = :userId")
	boolean existsByIdAndProjectMembersId(@Param("taskId") UUID taskId, @Param("userId") UUID userId);

	@Modifying
	@Query("UPDATE Task t SET t.status = :status WHERE t.id = :taskId")
	int updateTaskStatusDirectly(@Param("taskId") UUID taskId, @Param("status") TaskStatus status);

	long countByAssignedToId(UUID userId);

	long countByAssignedToIdAndStatus(UUID userId, TaskStatus status);

	long countByAssignedToIdAndStatusNot(UUID userId, TaskStatus status);

	long countByProjectIdIn(List<UUID> projectIds);

	long countByProjectIdInAndStatus(List<UUID> projectIds, TaskStatus status);

	long countByProjectIdInAndStatusNot(List<UUID> projectIds, TaskStatus status);

	long countByProjectOrganizationId(UUID organizationId);

	long countByProjectOrganizationIdAndStatus(UUID organizationId, TaskStatus status);

	long countByProjectOrganizationIdAndStatusNot(UUID organizationId, TaskStatus status);

	@Modifying
	@Query("DELETE FROM Task t WHERE t.project.id = :projectId")
	void deleteByProjectId(@Param("projectId") UUID projectId);

	@Modifying
	@Query("DELETE FROM Task t WHERE t.project.organization.id = :orgId")
	void deleteByOrganizationId(@Param("orgId") UUID orgId);
}
