import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Shift} from './shift.model';
import {Connection} from './connection.model';
import {Worker} from './worker.model';

interface ShiftData {
  error: string;
  id: number;
  idPruzkum: number;
  name: string;
  type: string;
  comment: string;
  spoje: any[];
  scitaci: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  innerConnection: Connection[] = [];
  innerWorker: Worker[] = [];
  private innerShift = new BehaviorSubject<Shift[]>([]);

  get shift() {
    return this.innerShift.asObservable();
  }

  constructor(private authService: AuthService, private httpClient: HttpClient) {
  }

  getShift(shiftId) {
    return this.httpClient
        .get<ShiftData>(`https://vyvoj.fd.cvut.cz/scitacka/api/getshift.php?id=` + shiftId)
        .pipe(
            map(shiftData => {
              if (shiftData.error) {
                return 'Unknown shift';
              } else {
                this.innerConnection = [];
                for (const spoj of shiftData.spoje) {
                  this.innerConnection.push(new Connection(
                      spoj.id,
                      spoj.id_smena,
                      spoj.order,
                      spoj.type,
                      spoj.line,
                      spoj.connection_id,
                      spoj.origin,
                      spoj.destination,
                      spoj.from,
                      spoj.till,
                      spoj.comment
                      )
                  );
                }
                this.innerWorker = [];
                for (const scitac of shiftData.scitaci) {
                  this.innerWorker.push(new Worker(
                      scitac.id,
                      scitac.id_smena,
                      scitac.id_scitac,
                      scitac.date,
                      scitac.comment,
                      scitac.prefix,
                      scitac.name,
                      scitac.surname,
                      scitac.suffix,
                      scitac.email,
                      scitac.phone
                      )
                  );
                }
                return new Shift(
                    shiftData.id,
                    shiftData.idPruzkum,
                    shiftData.name,
                    shiftData.type,
                    shiftData.comment,
                    this.innerConnection,
                    this.innerWorker
                );
              }
            })
        );
  }
}
