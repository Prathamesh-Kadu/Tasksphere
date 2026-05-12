package com.prathamesh.tasksphere.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prathamesh.tasksphere.model.Task;

public interface TaskRepository extends JpaRepository<Task, UUID>{
	List<Task> findByProject_Id(UUID projectId);

    List<Task> findByAssignedTo_Id(UUID userId);

    Optional<Task> findByIdAndProject_Id(UUID taskId, UUID projectId);
}
