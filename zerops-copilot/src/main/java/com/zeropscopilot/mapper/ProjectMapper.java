package com.zeropscopilot.mapper;

import com.zeropscopilot.dto.request.CreateProjectRequest;
import com.zeropscopilot.dto.response.ProjectResponse;
import com.zeropscopilot.entity.RepositoryProject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deployments", ignore = true)
    RepositoryProject toEntity(CreateProjectRequest request);

    ProjectResponse toResponse(RepositoryProject entity);
}