package com.zeropscopilot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "repository_projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryProject extends BaseEntity {

    @NotBlank(message = "Project name cannot be blank")
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank(message = "Repository URL cannot be blank")
    @Column(name = "repository_url", nullable = false)
    private String repositoryUrl;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Deployment> deployments = new ArrayList<>();
}