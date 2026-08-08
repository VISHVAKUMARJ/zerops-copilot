package com.zeropscopilot.mapper;

import com.zeropscopilot.dto.request.CreateDeploymentLogRequest;
import com.zeropscopilot.dto.response.DeploymentLogResponse;
import com.zeropscopilot.entity.DeploymentLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Builder;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface DeploymentLogMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "stage", ignore = true)
    @Mapping(target = "timestamp", ignore = true)
    DeploymentLog toEntity(CreateDeploymentLogRequest request);

    @Mapping(source = "stage.id", target = "stageId")
    DeploymentLogResponse toResponse(DeploymentLog entity);
}
