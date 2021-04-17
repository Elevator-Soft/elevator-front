import {makeUserManager} from "react-oidc";
import {UserManager} from "oidc-client";
import {Profile} from "../models/Profile/Profile";

export class UserService {
    userManager: UserManager;
    profile?: Profile;

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

    async setUser() {
        console.log('setting user');

        const user = await this.userManager.getUser();

        if (!user?.profile)
        {
            console.log('return because no profile')
            return;
        }

        if (!user.profile.given_name || !user.profile.name || !user.id_token)
        {
            console.log('return because no properties in profile')
            return;
        }


        this.profile = { id: user.profile.name, name: user.profile.name, token: user.id_token };

        console.log(this.profile);
    }

    getToken(): string {
        if (!this.profile)
            throw Error('User is not authorized');

        return this.profile.token
    }

    isUserAuthorized(): boolean {
        console.log(this.profile);
        return !!this.profile;
    }
}
