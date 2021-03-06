import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {NgForm} from '@angular/forms';
// @ts-ignore
import PouchDB from 'pouchdb-browser';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  userDb = new PouchDB('user');

  constructor(private authService: AuthService, private router: Router, private loadingController: LoadingController) { }

  ngOnInit() {
      this.userDb.get('_local/activeuser').then(res => {
          if ((res as any).email) {
              this.onLogin((res as any).email);
          }
      }).catch(() => {
          console.log('Nenalezen aktivni uzivatel - prihlaste se.');
      });
  }

  onLogin(email) {
    this.isLoading = true;
    this.authService.login(email);
    this.loadingController
        .create({keyboardClose: true, message: 'Logging in...'})
        .then(loadingEl => {
          loadingEl.present();
          setTimeout(() => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/home');
          }, 1500);
        });
  }

  onSubmit(form: NgForm) {
      if (!form.valid) {
          return;
      }
      const email = form.value.email;
      const pass = form.value.password;
      console.log(email, pass);
      if (this.isLogin) {
          // send request to login servers
      } else {
          // send request to signup servers
      }

      this.onLogin(email);
  }

    onSwitchAuthMode() {
      this.isLogin = !this.isLogin;
    }
}
