import {Component, OnDestroy, OnInit} from '@angular/core';
import { ViewChild } from '@angular/core';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {UserService} from '../user.service';
import {User} from '../user.model';
import {Subscription} from 'rxjs';
// @ts-ignore
import PouchDB from 'pouchdb-browser';
// @ts-ignore
import PouchDBFind from 'pouchdb-find';
import {AuthService} from '../auth/auth.service';
PouchDB.plugin(PouchDBFind);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  scannerActive = false;
  joinCode: string;
  user: User;
  userStatus = false;
  userSub: Subscription;
  isLoading = false;
  userDb = new PouchDB('user');
  userEmail = this.authService.userId;

  @ViewChild('scanner', { static: false })
  scanner: ZXingScannerComponent;
  private theBackCamera: any;

  /**
   * Some method.
   */
  doSomething(): void {
    this.scanner.device = this.getBackCamera();
  }

  scanSuccessHandler($event) {
    console.log($event);
    this.joinCode = $event;
    this.startScanner();
  }

  /**
   * Returns the back camera for ya.
   */
  getBackCamera() {
    return this.theBackCamera;
  }

  startScanner() {
    this.scannerActive = !this.scannerActive;
  }

  constructor( private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userDb.createIndex({
      index: {fields: ['email']}
    }).then(() => {
      this.userDb.find({
        selector: {
          email: {$eq: this.userEmail}
        }
      }).then(user => {
        if (user.docs.length > 0) {
          this.user = this.userService.userFromObjectDb(user.docs[0]);
          this.userStatus = true;
          this.isLoading = false;
        } else {
          this.userSub = this.userService.getUser().subscribe(userReq => {
            if (userReq === 'Unknown user') {
              console.log('User not found');
              this.isLoading = false;
            } else {
              this.user = userReq;
              this.insertUserDb(userReq);
              console.log(userReq);
              this.userStatus = true;
              this.isLoading = false;
            }
          });
        }
      });
    });
  }

  insertUserDb(user) {
    this.userDb.post(user).then(() => {
      console.log('Document inserted OK');
    }).catch((err) => {
      console.error(err);
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
