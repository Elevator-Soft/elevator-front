import React from 'react';
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import './App.css';

import AuthenticationPage from "../AuthenticationPage";
import ProjectsPage from "../ProjectsPage";
import TopBar from "../TopBar"
import AuthPage from "../AuthPage";
import ProjectPage from "../ProjectPage"

import {Callback} from "react-oidc";
import {Profile} from "../../models/Profile/Profile";
import {UserService} from "../../services";
import {ApiClient} from "../../client";
import CreateProjectModal from "../CreateProjectModal";



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
        this.state = {profile: this.userService.profile};
    }

    async componentDidMount() {
        await this.userService.setUser();
        this.setUser();
    }

    setUser() {
        this.setState({profile: this.userService.profile})
    }

    render() {
        return (
            <div className="App">
                <div className="header">
                    <TopBar profile={this.state.profile}/>
                </div>
                <Switch>
                    <Route exact path="/sign-in" render={(_ => <AuthenticationPage profile={this.state.profile}/>)}/>
                    <Route exact path="/sign-in/google" render={_ => <AuthPage userManager={this.userService.userManager}/> }/>
                    <Route
                        path="/sign-in/callback/google"
                        render={(routeProps) => {
                            return <Callback
                                onSuccess={async (user) => {
                                    await this.userService.setUser();
                                    this.setUser();
                                    routeProps.history.push('/');
                                }}
                                onError={(error) => {
                                    console.log('openid error', error);
                                }}
                                userManager={this.userService.userManager}
                            />;}}/>
                    <Route exact path="/create-project" render={(_ => <CreateProjectModal client={this.apiClient}/>) }/>
                    <Route exact path={"/projects/:id"} component={ProjectPage}/>
                    <Route exact path="/" render={(_ => this.state.profile ? <ProjectsPage apiClient={this.apiClient} profile={this.state.profile}/> : <AuthenticationPage profile={this.state.profile}/>)}/>
                </Switch>
            </div>
        );
    }
}
