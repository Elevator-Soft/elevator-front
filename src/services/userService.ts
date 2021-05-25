import {makeUserManager} from "react-oidc";
import {UserManager} from "oidc-client";
import { User } from "../client";

export class UserService {
    userManager: UserManager;
    private user?: User;
    private token?: string;

    constructor() {
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
            redirect_uri: 'http://localhost:3000/sign-in/callback/google', //временно так
            post_logout_redirect_uri: 'http://localhost:3000',
        });
    }

    private async setToken() {
        const user = await this.userManager.getUser();
        this.token = user?.id_token;
    }

    async getToken(): Promise<string> {
        await this.setToken();

        if (!this.token)
            throw Error('User is not authorized');

        return this.token;
    }

    async isUserAuthorized(): Promise<boolean> {
        await this.setToken();
        return !!this.token;
    }
}
