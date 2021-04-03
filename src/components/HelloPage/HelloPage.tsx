import React from "react";
import {RouteComponentProps} from "react-router-dom";

interface HelloPageProps extends RouteComponentProps {

}

export class HelloPage extends React.Component<HelloPageProps> {
    render() {
        return (
            <div>
                Привет!
            </div>
        );
    }
}
