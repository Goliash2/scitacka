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
  boarding: number;
  private timetableSub: Subscription;
  // private passengersCurrentNumber: number[];
  // private passengersBoarded: number[];
  // private passengersAlight: number[];
  @ViewChild('slider', { read: IonSlides, static: false }) slider: IonSlides;
  private boardedPlus() {
    // this.timetable.content.stops[this.currentStopKey].passengersBoarded++;
  }
  private boardedMinus() {
    // this.timetable.content.stops[this.currentStopKey].passengersBoarded--;
  }

  constructor(
      private timetableService: TimetableService
  ) { }

  ngOnInit() {
    this.currentStopKey = 0;
    this.timetableSub = this.timetableService.getTimetable().subscribe(timetable => {
      this.timetable = timetable;
      console.log(timetable);
    });
  }

  noSort() { return 0; }

  getOptions(num: number) {
    return Array.from({length: num}, (v, k) => k + 1);
  }

  refreshSlideKey() {
    this.slider.getActiveIndex().then(slide => {
      this.currentStopKey = slide;
      console.log(slide);
    });
  }

  setCurrentStopKey(key) {
    console.log(key);
    // this.boarding[key] = 0;
    // if (!this.timetable.content.stops[key].passengersBoarded) {
    //   this.timetable.content.stops[key].passengersBoarded = 0;
    // }
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
