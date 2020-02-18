import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Timetable} from './timetable.model';

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

@Injectable({
    providedIn: 'root'
})
export class TimetableService {
    private innerTimetable = new BehaviorSubject<Timetable[]>([]);

    get timetable() {
        return this.innerTimetable.asObservable();
    }

    constructor(private authService: AuthService, private httpClient: HttpClient) {
    }

    getTimetable() {
        return this.httpClient
            .get(`https://vyvoj.fd.cvut.cz/scitacka/api/?timetable=845120`)
            .pipe(
                map(timetableData => {
                    return timetableData;
                })
            );
    }

    getBus(linka, spoj, rok) {
        return this.httpClient
            .get<BusData>(`https://vyvoj.fd.cvut.cz/scitacka/api/getbus.php?linka=` + linka + `&spoj=` + spoj + `&rok=` + rok + ``)
            .pipe(
                map(busData => {
                    return busData;
                })
            );
    }

    getTrain(spoj, rok) {
        return this.httpClient
            .get<TrainData>(`https://vyvoj.fd.cvut.cz/scitacka/api/gettrain.php?spoj=` + spoj + `&rok=` + rok + ``)
            .pipe(
                map(trainData => {
                    return trainData;
                })
            );
    }
}
