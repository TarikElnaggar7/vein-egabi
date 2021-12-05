import { Injectable } from '@angular/core';
import { SessionManager } from '../../utilities/SessionManager';
// import decode from 'jwt-decode';  //to get expiration 
@Injectable()
export class AuthService {
    public getToken(): string {
        // return localStorage.getItem('token');
        return SessionManager.getToken();
    }
    //   public isAuthenticated(): boolean {
    //     // get the token
    //     const token = this.getToken();
    //     // return a boolean reflecting 
    //     // whether or not the token is expired
    //     return tokenNotExpired(null, token);
    //   }
}