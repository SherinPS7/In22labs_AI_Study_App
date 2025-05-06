import { account } from "@/config/appwrite";
import { AppConstants } from "@/constants/appwrite";
import { CreateUserTypes, LoginUserTypes, VerifyUserTypes } from "@/types/auth-types";
import { AppErrServer } from "@/utils/app-err";
import { ID, OAuthProvider } from "appwrite";

export async function CreateUser(values : CreateUserTypes) {
    try {
        const promise = await account.create(
            ID.unique(),
            values.email,
            values.password,
            `${values.firstname} ${values.lastname}`
        );
        return promise.$id;
    } catch (error) {
        AppErrServer(error);
    }
};

export async function LoginUser(values : LoginUserTypes) {
    try {
        const promise = await account.createEmailPasswordSession(
            values.email,
            values.password
        );
        return promise.$id;
    } catch (error) {
        AppErrServer(error);
    }
};

export async function LogoutUser() {
    try {
        await account.deleteSession(
            'current'
        );
    } catch (error) {
        AppErrServer(error);
    }
};

export async function GetCurrentSession() {
    try {
        const promise = await account.get();
        if (!promise) {
            return null;
        }
        return promise;
    } catch (error) {
        AppErrServer(error);
    }
};

export async function LoginOauthgoogle() {
    try {
        await account.createOAuth2Session(
            OAuthProvider.Google,
            `${AppConstants.endpoint}/set-state`,
            `${AppConstants.endpoint}/sign-up`
        )
    } catch (error) {
        AppErrServer(error);
    }
};

export async function createVerification() {
    try {
        const verificationUrl = AppConstants.endpoint+"/verify-user"
        const promise = await account.createVerification(
            verificationUrl
        );

        return promise;
    } catch (error) {
        AppErrServer(error);
    }
};

export async function updateVerification(values : VerifyUserTypes) {
    try {
        const promise = await account.updateVerification(
            values.userId,
            values.secret
        );
        return promise;
    } catch (error) {
        AppErrServer(error);
    }
};

export async function createPasswordRecovery(email : string) {
    try {
        const endpoint = AppConstants.endpoint+"/reset-password";
        console.log(endpoint);
        const promise = account.createRecovery(email, endpoint);
        return promise;
    } catch (error) {
        AppErrServer(error);
    }
};

export async function updatePasswordRecovery(values : {
    userId : string;
    secret : string;
    password : string;
    confirmpassword : string;
}) {
    try {   
        if (values.password !== values.confirmpassword) {
            throw new Error("Passwords does not match");
        };

        const promise = account.updateRecovery(
            values.userId,
            values.secret,
            values.password
        );
        return promise;
    } catch (error) {
        AppErrServer(error);
    }
};