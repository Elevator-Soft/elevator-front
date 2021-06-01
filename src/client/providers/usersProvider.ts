import {User} from '../models'
import {BaseProvider} from "./baseProvider";

export class UsersProvider extends BaseProvider{
    public getCurrentUser(): Promise<User> {
        const url = this.apiUrl + '/users/me';
        return this.get<User>(url);
    }

    public register(): Promise<User> {
        const url = this.apiUrl + '/users/me/register';
        return this.post<User>(url);
    }

    public getAllIds(): Promise<Array<string>> {
        const url = this.apiUrl + '/users';
        return this.get<Array<string>>(url);
    }
}
