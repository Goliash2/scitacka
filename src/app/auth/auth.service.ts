import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private innerUserIsAuthenticated = true;
  private innerUserId = 'abc';

  get userIsAuthenticated() {
    return this.innerUserIsAuthenticated;
  }

  get userId() {
    return this.innerUserId;
  }

  constructor() { }
  login() {
    this.innerUserIsAuthenticated = true;
  }
  logout() {
    this.innerUserIsAuthenticated = false;
  }
}
