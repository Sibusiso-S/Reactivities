export interface IUser {
    username : string;
    displayName : string;
    token : string;
    image? : string;
}

export interface IUserFormValues {
    email : string;
    pasword : string;
    displayName? : string;
    username? : string;
}
