import React from 'react';
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import './App.css';

import AuthenticationPage from "../AuthenticationPage";
import ProjectsPage from "../ProjectsPage";
import TopBar from "../TopBar"
import AuthPage from "../AuthPage";
import ProjectPage from "../ProjectPage"

import {Callback} from "react-oidc";
import {UserService} from "../../services";
import {ApiClient, User} from "../../client";
import CreateProjectModal from "../CreateProjectModal";
import BuildConfigPage from "../BuildConfigPage";


interface AppProps extends RouteComponentProps { }
interface AppState {
    user?: User
}

export class App extends React.Component<AppProps, AppState> {
    userService: UserService;
    apiClient: ApiClient;

    constructor(props: AppProps) {
        super(props);
        this.userService = new UserService();
        this.apiClient = new ApiClient(this.userService, 'https://localhost:10101');
        this.state = {user: undefined};
    }

    async componentDidMount() {
        await this.trySetUser();
    }

    private async trySetUser() {
        if (!await this.userService.isUserAuthorized())
            return;
        let user = await this.apiClient.users.getCurrentUser();
        if (!user.isRegistered)
        {
            await this.register();
            user = await this.apiClient.users.getCurrentUser();
        }
        this.setState({user: user})
    }

    private async singIn() {
        await this.trySetUser();
    }

    private async register() {
        await this.apiClient.users.register();
    }

    render() {
        return (
            <div className="App">
                <div className="header">
                    <TopBar user={this.state.user} goHome={() => {this.props.history.push('/')}}/>
                </div>
                <Switch>
                    <Route exact path="/sign-in" render={(_ => <AuthenticationPage user={this.state.user}/>)}/>
                    <Route exact path="/sign-in/google" render={_ => <AuthPage userManager={this.userService.userManager}/> }/>
                    <Route
                        path="/sign-in/callback/google"
                        render={(routeProps) => {
                            return <Callback
                                onSuccess={async (_) => {
                                    await this.singIn();

                                    routeProps.history.push('/');
                                }}
                                onError={(error) => {
                                    console.log('openid error', error);
                                }}
                                userManager={this.userService.userManager}
                            />;}}/>
                    <Route exact path="/create-project" render={(_ => <CreateProjectModal client={this.apiClient}/>) }/>
                    <Route exact path={"/projects/:id"} render={(_ => this.state.user ? <ProjectPage user={this.state.user} apiClient={this.apiClient}/> : <AuthenticationPage user={this.state.user}/>)}/>
                    <Route exact path={"/projects/:projectId/buildConfigs/:buildConfigId"} render={(_ => this.state.user ? <BuildConfigPage user={this.state.user} apiClient={this.apiClient}/> : <AuthenticationPage user={this.state.user}/>)}/>
                    <Route exact path="/" render={(_ => this.state.user ? <ProjectsPage apiClient={this.apiClient} user={this.state.user}/> : <AuthenticationPage user={this.state.user}/>)}/>
                </Switch>
            </div>
        );
    }
}
