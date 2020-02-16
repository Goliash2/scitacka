import {Component, OnDestroy, OnInit} from '@angular/core';
import { ViewChild } from '@angular/core';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {UserService} from '../user.service';
import {User} from '../user.model';
import {Subscription} from 'rxjs';

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

  constructor( private userService: UserService) {}

  ngOnInit(): void {
    this.userSub = this.userService.getUser().subscribe(user => {
      if (user === 'Unknown user') {
        console.log('User not found');
      } else {
        this.user = user;
        this.userStatus = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
