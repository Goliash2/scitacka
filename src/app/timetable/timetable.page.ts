import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {TimetableService} from './timetable.service';
import {Subscription} from 'rxjs';
import {IonSlides} from '@ionic/angular';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.page.html',
  styleUrls: ['./timetable.page.scss'],
})
export class TimetablePage implements OnInit, OnDestroy {
  timetable: object;
  currentStopKey: number;
  boarding: number[];
  alight: number[];
  isLoading = false;
  private timetableSub: Subscription;
  // private passengersCurrentNumber: number[];
  // private passengersBoarded: number[];
  // private passengersAlight: number[];
  @ViewChild('slider', { read: IonSlides, static: false }) slider: IonSlides;
  private boardedPlus() {
    this.boarding[this.currentStopKey]++;
  }
  private boardedMinus() {
    this.boarding[this.currentStopKey]--;
  }
  private alightPlus() {
    this.alight[this.currentStopKey]++;
  }
  private alightMinus() {
    this.alight[this.currentStopKey]--;
  }

  constructor(
      private timetableService: TimetableService
  ) { }

  ngOnInit() {
    this.currentStopKey = 0;
    this.boarding = this.getZeros(50);
    this.alight = this.getZeros(50);
    this.isLoading = true;
    this.timetableSub = this.timetableService.getTimetable().subscribe(timetable => {
      this.timetable = timetable;
      this.isLoading = false;
    });
  }

  noSort() { return 0; }

  getOptions(num: number) {
    return Array.from({length: num}, (v, k) => k + 1);
  }

  getZeros(num: number) {
    return Array.from({length: num}, () => 0);
  }

  getPassengers() {
    return this.boarding.reduce((acc, cur) => acc + cur, 0) - this.alight.reduce((acc, cur) => acc + cur, 0);
  }

  refreshSlideKey() {
    this.slider.getActiveIndex().then(slide => {
      this.currentStopKey = slide;
    });
  }

  setCurrentStopKey(key) {
    if (this.slider) {
      this.slider.slideTo(key).then(() => {
        this.currentStopKey = key;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.timetableSub) {
      this.timetableSub.unsubscribe();
    }
  }

}
