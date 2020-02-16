import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private innerUserIsAuthenticated = true;
  private innerUserId = 'davidjurik@email.cz';

  get userIsAuthenticated() {
    return this.innerUserIsAuthenticated;
  }

  get userId() {
    return this.innerUserId;
  }

  constructor() { }
  login(userId) {
    this.innerUserId = userId;
    this.innerUserIsAuthenticated = true;
  }
  logout() {
    this.innerUserIsAuthenticated = false;
  }
}
