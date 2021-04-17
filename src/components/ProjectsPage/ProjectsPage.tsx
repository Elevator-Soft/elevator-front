import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {ApiClient, Project} from "../../client";
import {Profile} from "../../models/Profile/Profile";

import styles from "./ProjectPage.module.css";

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
        console.log(this.props.profile);
        if (!this.props.profile)
            return;

        const projects = await this.props.apiClient.projects.getAllProjects();
        this.setState({projects: projects});
    }

    componentDidUpdate(prevProps: Readonly<ProjectsPageProps>, prevState: Readonly<ProjectsPageState>, snapshot?: any): void {
        console.log('updated project page')
    }

    renderProject(project: Project) {
        return (
            <div className={styles.project}>
                <p>{'Id: ' + project.id}</p>
                <p>{'Name: ' + project.name}</p>
            </div>
        )
    }

    render() {
        return (
            <div className={styles.container}>
                { this.state.projects ? this.state.projects.map(this.renderProject) : "Нечего показывать иди нахуй"}
            </div>
        );
    }
}
