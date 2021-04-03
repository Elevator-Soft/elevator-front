import React from "react";
import {Profile} from "../../models/Profile/Profile";
import {UserManager} from "oidc-client"
import {makeUserManager} from "react-oidc"
import {RouteComponentProps} from "react-router-dom";

interface GoogleAuthPageProps extends RouteComponentProps {
    profile?: Profile;
    userManager: UserManager;
}

interface GoogleAuthPageState {
    profile?: Profile;
}

export class GoogleAuthPage extends React.PureComponent<GoogleAuthPageProps, GoogleAuthPageState> {

    constructor(props: GoogleAuthPageProps) {
        super(props);

        this.setState({profile: undefined})
    }

    async componentDidMount() {
        const user = await this.props.userManager.getUser();
        console.log(user);
        if (!user) {
            await this.props.userManager.signinRedirect()
        } else {
            this.props.history.push('/');
        }
    }

    render() {
        return "Авторизуемся.."
    }
}
