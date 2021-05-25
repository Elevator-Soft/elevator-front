export interface User {
    id: string;
    name: string;
    email: string;
    isRegistered: boolean;
    projectAccesses: ProjectAccesses;
}

export interface ProjectAccesses {
    admin: Array<string>;
    user: Array<string>;
}
