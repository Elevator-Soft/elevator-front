import React from "react";
import {RouteComponentProps} from "react-router-dom";

interface NoAuthenticatedUserPageProps extends RouteComponentProps {

}

export class NoAuthenticatedUserPage extends React.PureComponent<NoAuthenticatedUserPageProps> {
    render() {
        return (
            <div>Я не знаю кто ты уйди нахер</div>
        );
    }
}
