package com.zeropscopilot.mapper;

import com.zeropscopilot.dto.response.DeploymentStageResponse;
import com.zeropscopilot.entity.DeploymentStage;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DeploymentStageMapper {
    
    DeploymentStageResponse toResponse(DeploymentStage entity);
}
