import {Component, OnDestroy, OnInit} from '@angular/core';
import {Shift} from './shift.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {LoadingController, NavController} from '@ionic/angular';
import {ShiftService} from './shift.service';
import {UserService} from '../user.service';
import {User} from '../user.model';
import {Location} from '@angular/common';

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


  constructor(
      private route: ActivatedRoute,
      private navCtrl: NavController,
      private shiftService: ShiftService,
      private userService: UserService,
      private loadingCtrl: LoadingController,
      private location: Location
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
    this.userSub = this.userService.getUser().subscribe(user => {
      if (user === 'Unknown user') {
        console.log('User not found');
        this.isLoading = false;
      } else {
        this.user = user;
        console.log(user);
        this.isLoading = false;
      }
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
    this.shiftSub = this.shiftService.getShift(this.shiftId).subscribe(shift => {
      if (shift === 'Unknown shift') {
        console.log('Shift not found');
        this.isLoading = false;
      } else {
        this.shift = shift;
        console.log(shift);
        this.location.replaceState('/survey/' + this.shiftId);
        this.isLoading = false;
      }
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
