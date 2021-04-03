import React from "react";
import {RouteComponentProps} from "react-router-dom";

interface AuthenticationPageProps extends RouteComponentProps {

}

export class AuthenticationPage extends React.Component<AuthenticationPageProps> {
    render = () => {
        return (
            <div>
                Здесь будет страница с авторизацией

            </div>
        );
    }
}

