package com.prathamesh.tasksphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
	private Long totalTasks;
    private Long pendingTasks;
    private Long completedTasks;
    private Long totalProjects;
    private Long totalUsers;
    private Long totalOrganizations;
}
