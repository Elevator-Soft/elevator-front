import React from "react";

import styles from './ProjectCard.module.css'

interface ProjectCardProps {
    id: string;
    name: string;
}

export class ProjectCard extends React.PureComponent<ProjectCardProps> {
    render() {
        return (<div className={styles.projectContainer}>
            <a className={styles.projectName} href={"projects/" + this.props.id}>{this.props.name}</a>
        </div>);
    }
}
