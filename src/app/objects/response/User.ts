export interface User {
    createDate: string;
    lastUpdate: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    oldPasswords: string;
    numberOfLoginAttempts: number;
    roles: string[];
    context: Context;
}

interface Context {
    'cms-user-id': string;
}
