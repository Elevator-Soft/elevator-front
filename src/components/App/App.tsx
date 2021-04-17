import React from 'react';
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import './App.css';

import AuthenticationPage from "../AuthenticationPage";
import ProjectsPage from "../ProjectsPage";
import TopBar from "../TopBar"
import AuthPage from "../AuthPage";
import NoAuthenticatedUserPage from "../NoAuthenticatedUserPage";

import {Callback} from "react-oidc";
import {UserManager} from "oidc-client";
import {Profile} from "../../models/Profile/Profile";
import {UserService} from "../../services";
import {ApiClient} from "../../client";



interface AppProps extends RouteComponentProps { }
interface AppState {
    profile?: Profile
}

export class App extends React.Component<AppProps, AppState> {
    userService: UserService;
    apiClient: ApiClient;

    constructor(props: AppProps) {
        super(props);
        this.userService = new UserService();
        this.apiClient = new ApiClient(this.userService, 'https://localhost:10101');
        this.state = {profile: undefined};
    }

    async componentDidMount() {
        await this.userService.setUser();
        this.setState({profile: this.userService.profile});
        console.log('setting user');

        this.forceUpdate();
    }

    componentDidUpdate(prevProps: Readonly<AppProps>, prevState: Readonly<AppState>, snapshot?: any): void {
        console.log('updated')
    }

    setUser() {
        console.log('setting user');
        this.setState({profile: this.userService.profile})
    }

    render() {
        console.log('render app');
        return (
            <div className="App">
                <div className="header">
                    <TopBar profile={this.state.profile}/>
                </div>
                <Switch>
                    <Route exact path="/sign-in" render={(_ => <AuthenticationPage/>)}/>
                    <Route exact path="/sign-in/google" render={_ => <AuthPage userManager={this.userService.userManager}/> }/>
                    <Route
                        path="/sign-in/callback/google"
                        render={(routeProps) => {
                            return <Callback
                                onSuccess={async (user) => {
                                    routeProps.history.push('/');
                                    await this.userService.setUser();
                                    this.setUser();
                                }}
                                onError={(error) => {
                                    console.log('openid error', error);
                                }}
                                userManager={this.userService.userManager}
                            />;}}/>
                    <Route exact path="/" render={(_ => this.state.profile ? <ProjectsPage apiClient={this.apiClient} profile={this.state.profile}/> : <NoAuthenticatedUserPage/>)}/>
                </Switch>
            </div>
        );
    }
}
