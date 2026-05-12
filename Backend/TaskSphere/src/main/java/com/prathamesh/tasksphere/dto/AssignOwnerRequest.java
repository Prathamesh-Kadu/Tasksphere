package com.prathamesh.tasksphere.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignOwnerRequest {

    @NotNull(message = "User ID is required")
    private List<UUID> userIds;

    @NotNull(message = "Organization ID is required")
    private UUID organizationId;
}