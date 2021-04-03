import React from 'react';
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import './App.css';

import AuthenticationPage from "../AuthenticationPage";
import HelloPage from "../HelloPage";
import TopBar from "../TopBar"
import GoogleAuthPage from "../GoogleAuthPage";
import {Callback, makeUserManager} from "react-oidc";
import {UserManager} from "oidc-client";
import {Profile} from "../../models/Profile/Profile";

interface AppProps extends RouteComponentProps { }
interface AppState {
    profile?: Profile
}

export class App extends React.Component<AppProps, AppState> {
    userManager: UserManager;

    constructor(props: AppProps) {
        super(props);

        this.userManager = makeUserManager({
            clockSkew: 300,
            authority: 'https://accounts.google.com',
            scope: 'openid profile email',
            loadUserInfo: true,
            monitorSession: true, // NOTE: for logout sync to work across tabs
            filterProtocolClaims: true,
            automaticSilentRenew: true,
            client_id: '498787926402-3g4k9qteipbiahitls1r709is6fule9a.apps.googleusercontent.com',
            response_type: 'token id_token',
            redirect_uri: 'http://localhost:3000/sign-in/callback',
            post_logout_redirect_uri: 'http://localhost:3000',
        });

        this.state = {profile: undefined};
    }

    async componentDidMount() {
        await this.setUser();
    }

    async setUser() {
        const user = await this.userManager.getUser();
        console.log(user);

        if (!user?.profile)
            return;

        if (!user.profile.given_name || !user.profile.name)
            return;

        this.setState({profile: {id: user.profile.given_name, name: user.profile.name}})
    }

    render() {
        return (
            <div className="App">
                <div className="header">
                    <TopBar profile={this.state.profile}/>
                </div>
                <Switch>
                    <Route exact path="/sign-in" render={(_ => <AuthenticationPage/>)}/>
                    <Route exact path="/hello" render={(_ => <HelloPage/>)}/>
                    <Route exact path="/sign-in/google" render={_ => <GoogleAuthPage userManager={this.userManager}/> }/>
                    <Route
                        path="/sign-in/callback"
                        render={(routeProps) => {
                            return <Callback
                                onSuccess={async (user) => {
                                    routeProps.history.push('/');
                                    await this.setUser();
                                }}
                                onError={(error) => {
                                    console.log('openid error', error);
                                }}
                                userManager={this.userManager}
                            />;}}/>
                </Switch>
            </div>
        );
    }
}
