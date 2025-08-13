import config from "../conf/config";
import { Client, Account, ID } from "appwrite";




export class AuthService{
    client = new Client();
    account ;

    constructor() {
        this.client 
            .setEndpoint(config.appwriteURL)
            .setProject(config.appwriteProjectID);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if(userAccount) {
                //  call another method
                return this.login({email, password});
                // return userAccount;
            }else{
                 return userAccount
            }
        } catch (error) {
            throw error;
        }
    }

    async login({email, password}) {
        try {
            const userSession = await this.account.createEmailPasswordSession(email, password);
            return userSession;
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            throw error;
        }

        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions("current");
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;
