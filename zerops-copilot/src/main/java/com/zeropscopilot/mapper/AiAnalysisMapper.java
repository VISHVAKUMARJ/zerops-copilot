package com.zeropscopilot.mapper;

import com.zeropscopilot.dto.request.CreateAiAnalysisRequest;
import com.zeropscopilot.dto.response.AiAnalysisResponse;
import com.zeropscopilot.entity.AiAnalysis;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Builder;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface AiAnalysisMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deployment", ignore = true)
    AiAnalysis toEntity(CreateAiAnalysisRequest request);

    @Mapping(source = "deployment.id", target = "deploymentId")
    AiAnalysisResponse toResponse(AiAnalysis entity);
}
