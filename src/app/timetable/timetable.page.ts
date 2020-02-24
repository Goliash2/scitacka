import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {TimetableService} from './timetable.service';
import {Subscription} from 'rxjs';
import {IonSlides, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {ShiftService} from '../survey/shift.service';
import {Shift} from '../survey/shift.model';
// @ts-ignore
import PouchDB from 'pouchdb-browser';
// @ts-ignore
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

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
  userDb = new PouchDB('user');
  shiftDb = new PouchDB('shift');
  busDb = new PouchDB('bus');
  trainDb = new PouchDB('train');

  @ViewChild('slider', { read: IonSlides, static: false }) slider: IonSlides;
  boardedPlus() {
    this.boarding[this.currentStopKey]++;
  }
  boardedMinus() {
    this.boarding[this.currentStopKey]--;
  }
  alightPlus() {
    this.alight[this.currentStopKey]++;
  }
  alightMinus() {
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
            if (!paramMap.has('spoj')) {
              this.navCtrl.navigateBack('home');
              return;
            }
            this.spojId = Number(paramMap.get('spoj'));
            this.setConnection();
          } else {
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
                this.setConnection();
              }
            });
          }
        });
      });
    });
    this.currentStopKey = 0;
    this.boarding = this.getZeros(50);
    this.alight = this.getZeros(50);
  }

  setConnection() {
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
