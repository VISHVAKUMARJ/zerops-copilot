package com.zeropscopilot.mapper;

import com.zeropscopilot.dto.request.CreateDeploymentRequest;
import com.zeropscopilot.dto.response.DeploymentResponse;
import com.zeropscopilot.entity.Deployment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Builder;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true), uses = {DeploymentStageMapper.class})
public interface DeploymentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "stages", ignore = true)
    @Mapping(target = "aiAnalysis", ignore = true)
    Deployment toEntity(CreateDeploymentRequest request);

    @Mapping(source = "project.id", target = "projectId")
    DeploymentResponse toResponse(Deployment entity);
}
