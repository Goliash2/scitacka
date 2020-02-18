import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {TimetableService} from './timetable.service';
import {Subscription} from 'rxjs';
import {IonSlides, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {ShiftService} from '../survey/shift.service';
import {Shift} from '../survey/shift.model';

interface BusData {
  error: string;
  linka: any;
  dopravce: any;
  spoj: any;
  zastavky: any[];
}
interface TrainData {
  error: string;
  spoj: any;
  zastavky: any[];
}

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.page.html',
  styleUrls: ['./timetable.page.scss'],
})
export class TimetablePage implements OnInit, OnDestroy {
  timetableBus: BusData;
  timetableTrain: TrainData;
  currentStopKey: number;
  boarding: number[];
  alight: number[];
  isLoading = false;
  shiftId: number;
  spojId: number;
  shift: Shift;
  private shiftSub: Subscription;
  private timetableSub: Subscription;

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
      private route: ActivatedRoute,
      private navCtrl: NavController,
      private timetableService: TimetableService,
      private shiftService: ShiftService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('home');
        return;
      }
      this.shiftId = Number(paramMap.get('id'));
      this.isLoading = true;
      this.shiftSub = this.shiftService.getShift(this.shiftId).subscribe(shift => {
        if (shift === 'Unknown shift') {
          console.log('Shift not found');
          this.isLoading = false;
        } else {
          this.shift = shift;
          console.log(shift);
          if (!paramMap.has('spoj')) {
            this.navCtrl.navigateBack('home');
            return;
          }
          this.spojId = Number(paramMap.get('spoj'));
          if (this.shift.spoje.find(x => x.id === this.spojId)) {
            if (this.shift.spoje.find(x => x.id === this.spojId).type === 'bus') {
              this.timetableSub = this.timetableService.getBus(
                  this.shift.spoje.find(x => x.id === this.spojId).line,
                  this.shift.spoje.find(x => x.id === this.spojId).connectionId,
                  20
              ).subscribe(timetable => {
                this.timetableBus = timetable;
                console.log(timetable);
                this.isLoading = false;
              });
            } else {
              this.timetableSub = this.timetableService.getTrain(
                  this.shift.spoje.find(x => x.id === this.spojId).connectionId,
                  20
              ).subscribe(timetable => {
                this.timetableTrain = timetable;
                console.log(timetable);
                this.isLoading = false;
              });
            }
          }
        }
      });
    });
    this.currentStopKey = 0;
    this.boarding = this.getZeros(50);
    this.alight = this.getZeros(50);
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
