import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {ApiClient, Project} from "../../client";
import {Profile} from "../../models/Profile/Profile";

import NoProjectsPage from "./NoProjectsPage"

import styles from "./ProjectPage.module.css";
import {ProjectCard} from "../ProjectCard/ProjectCard";

interface ProjectsPageProps extends RouteComponentProps {
    apiClient: ApiClient;
    profile?: Profile;
}

interface ProjectsPageState {
    projects?: Project[];
}

export class ProjectsPage extends React.Component<ProjectsPageProps, ProjectsPageState> {
    constructor(props: ProjectsPageProps) {
        super(props);
        this.state = { projects: undefined };
    }

    async componentDidMount() {
        if (!this.props.profile)
            return;

        const projects = await this.props.apiClient.projects.getAllProjects();
        this.setState({projects: projects});
    }

    renderProject(project: Project) {
        return <ProjectCard key={project.id} id={project.id} name={project.name}/>;
    }

    render() {
        if (!this.state.projects)
            return (
                <div className={styles.container}>
                    <div>
                        "Loading..."
                    </div>
                </div>
            );

        if (this.state.projects.length === 0) {
            return <NoProjectsPage/>
        }

        return (
            <div className={styles.container}>
                { this.state.projects.map(this.renderProject) }
            </div>
        );
    }
}
