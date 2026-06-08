package com.prathamesh.tasksphere.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prathamesh.tasksphere.dto.DashboardResponse;
import com.prathamesh.tasksphere.model.Role;
import com.prathamesh.tasksphere.model.TaskStatus;
import com.prathamesh.tasksphere.model.User;
import com.prathamesh.tasksphere.repository.OrganizationRepository;
import com.prathamesh.tasksphere.repository.ProjectRepository;
import com.prathamesh.tasksphere.repository.TaskRepository;
import com.prathamesh.tasksphere.repository.UserRepository;
import com.prathamesh.tasksphere.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

	private final UserRepository userRepository;
	private final ProjectRepository projectRepository;
	private final TaskRepository taskRepository;
	private final OrganizationRepository organizationRepository;

	private User getLoggedInUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
		return userDetails.getUser();
	}

	@Override
	@Transactional(readOnly = true)
	public DashboardResponse getDashboardStatistics() {
		User user = getLoggedInUser();
		UUID userId = user.getId();
		Role role = user.getRole();

		DashboardResponse.DashboardResponseBuilder builder = DashboardResponse.builder();

		switch (role) {
		case SUPER_ADMIN:
			builder.totalOrganizations(organizationRepository.count());
			builder.totalUsers(userRepository.count());
			builder.totalProjects(projectRepository.count());
			builder.totalTasks(taskRepository.count());
			break;

		case OWNER:
			UUID orgId = user.getOrganization() != null ? user.getOrganization().getId() : null;
			if (orgId != null) {
				builder.totalUsers(userRepository.countByOrganizationId(orgId));
				builder.totalProjects(projectRepository.countByOrganizationId(orgId));
				builder.totalTasks(taskRepository.countByProjectOrganizationId(orgId));
				builder.pendingTasks(taskRepository.countByProjectOrganizationIdAndStatusNot(orgId, TaskStatus.DONE));
				builder.completedTasks(taskRepository.countByProjectOrganizationIdAndStatus(orgId, TaskStatus.DONE));
			}
			break;

		case ADMIN:
			List<UUID> adminProjectIds = projectRepository.findProjectIdsByUserId(userId);
			builder.totalProjects((long) adminProjectIds.size());

			if (!adminProjectIds.isEmpty()) {
				builder.totalUsers(userRepository.countDistinctUsersInProjects(adminProjectIds));
				builder.totalTasks(taskRepository.countByProjectIdIn(adminProjectIds));
				builder.pendingTasks(taskRepository.countByProjectIdInAndStatusNot(adminProjectIds, TaskStatus.DONE));
				builder.completedTasks(taskRepository.countByProjectIdInAndStatus(adminProjectIds, TaskStatus.DONE));
			} else {
				builder.totalUsers(0L);
				builder.totalTasks(0L);
				builder.pendingTasks(0L);
				builder.completedTasks(0L);
			}
			break;

		case MEMBER:
			builder.totalTasks(taskRepository.countByAssignedToId(userId));
			builder.pendingTasks(taskRepository.countByAssignedToIdAndStatusNot(userId, TaskStatus.DONE));
			builder.completedTasks(taskRepository.countByAssignedToIdAndStatus(userId, TaskStatus.DONE));
			break;
		}

		return builder.build();
	}
}