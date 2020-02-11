import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Timetable} from './timetable.model';

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
}
