import {Component, OnDestroy, OnInit} from '@angular/core';
import {Shift} from './shift.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {LoadingController, NavController} from '@ionic/angular';
import {ShiftService} from './shift.service';
import {UserService} from '../user.service';
import {User} from '../user.model';
import {Location} from '@angular/common';
// @ts-ignore
import PouchDB from 'pouchdb-browser';
// @ts-ignore
import PouchDBFind from 'pouchdb-find';
import {AuthService} from '../auth/auth.service';
PouchDB.plugin(PouchDBFind);

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit, OnDestroy {
  isLoading = false;
  shiftId: number;
  shift: Shift;
  user: User;
  shiftSub: Subscription;
  userSub: Subscription;
  userDb = new PouchDB('user');
  shiftDb = new PouchDB('shift');


  constructor(
      private route: ActivatedRoute,
      private navCtrl: NavController,
      private shiftService: ShiftService,
      private userService: UserService,
      private loadingCtrl: LoadingController,
      private location: Location,
      private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('home');
        return;
      }
      this.shiftId = Number(paramMap.get('id'));
      this.getShift();
    });
    this.isLoading = true;
    this.userDb.createIndex({
      index: {fields: ['email']}
    }).then(() => {
      this.userDb.find({
        selector: {
          email: {$eq: this.authService.userId}
        }
      }).then(user => {
        if (user.docs.length > 0) {
          this.user = this.userService.userFromObjectDb(user.docs[0]);
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

  ionViewDidEnter() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('home');
        return;
      }
      this.shiftId = Number(paramMap.get('id'));
      this.getShift();
    });
  }

  getShift() {
    this.isLoading = true;
    this.shiftDb.createIndex({
      index: {fields: ['id']}
    }).then(() => {
      this.shiftDb.find({
        selector: {
          id: {$eq: this.shiftId}
        }
      }).then(user => {
        if (user.docs.length > 0) {
          this.shift = this.shiftService.shiftFromObjectDb(user.docs[0]);
          this.isLoading = false;
        } else {
          this.shiftSub = this.shiftService.getShift(this.shiftId).subscribe(shift => {
            if (shift === 'Unknown shift') {
              console.log('Shift not found');
              this.isLoading = false;
            } else {
              this.shift = shift;
              console.log(shift);
              this.location.replaceState('/survey/' + this.shiftId);
              this.insertShiftDb(shift);
              this.isLoading = false;
            }
          });
        }
      });
    });
  }

  insertShiftDb(shift) {
    this.shiftDb.post(shift).then(() => {
      console.log('Shift inserted to db - OK');
    }).catch((err) => {
      console.error(err);
    });
  }

  onChangeShift($event) {
    this.shiftId = $event.target.value;
    this.getShift();
  }

  ngOnDestroy(): void {
    if (this.shiftSub) {
      this.shiftSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

}
