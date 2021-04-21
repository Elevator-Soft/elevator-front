import React from "react";
import {RouteComponentProps} from "react-router-dom";

interface ProjectPageParams {
    id: string;
}

interface ProjectPageProps extends RouteComponentProps<ProjectPageParams>{

}

export class ProjectPage extends React.PureComponent<ProjectPageProps> {
    render() {
        return "There will be page for project with id " + this.props.match.params.id;
    }
}
