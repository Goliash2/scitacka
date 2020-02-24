import { Injectable } from '@angular/core';
// @ts-ignore
import PouchDB from 'pouchdb-browser';
// @ts-ignore
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginFromDb = false;
  private innerUserIsAuthenticated = true;
  private innerUserId = 'davidjurik@email.cz';
  private userDb = new PouchDB('user');

  get userIsAuthenticated() {
    if (this.loginFromDb) {
      return this.innerUserIsAuthenticated;
    } else {
      return this.getUserDbInfo('auth').then(res => {
        return res;
      });
    }
  }

  get userId() {
    if (this.loginFromDb) {
      return this.innerUserId;
    } else {
      return this.getUserDbInfo('email').then(() => {
        return this.innerUserId;
      });
    }
  }

  constructor() { }

  async getUserDbInfo(par) {
    return await this.userDb.get('_local/activeuser').then(res => {
      if ((res as any).email) {
        this.loginFromDb = true;
        this.innerUserIsAuthenticated = true;
        this.innerUserId = (res as any).email;
        if (par === 'email') {
          return (res as any).email;
        } else {
          return true;
        }
      } else {
        if (par === 'email') {
          return 'User not logged in';
        } else {
          return false;
        }
      }
    }).catch(err => {
      console.log(err);
      if (par === 'email') {
        return 'User not logged in';
      } else {
        return false;
      }
    });
  }

  login(userId) {
    this.innerUserId = userId;
    this.innerUserIsAuthenticated = true;
    this.userDb.put({
      _id: '_local/activeuser',
      email: userId
    }, {force: true});
  }

  logout() {
    this.innerUserIsAuthenticated = false;
    this.userDb.get('_local/activeuser').then(doc => {
      (doc as any)._deleted = true;
      return this.userDb.put(doc);
    }).then(result => {
      console.log('Uzivatel odhlasen');
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
    // this.userDb.remove({
    //   _id: '_local/activeuser',
    // });
  }
}
