import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from './user.model';
import {UserShifts} from './user-shift.model';

interface UserData {
  error: string;
  id: number;
  prefix: string;
  name: string;
  surname: string;
  suffix: string;
  email: string;
  phone: string;
  comment: string;
  smeny: any[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  innerSmeny: UserShifts[] = [];
  private userEmail = this.authService.userId;
  private innerUser = new BehaviorSubject<User[]>([]);

  get user() {
    return this.innerUser.asObservable();
  }

  constructor(private authService: AuthService, private httpClient: HttpClient) {
  }

  getUser() {
    return this.httpClient
        .get<UserData>(`https://vyvoj.fd.cvut.cz/scitacka/api/getuser.php?id=` + this.userEmail)
        .pipe(
            map(userData => {
              if (userData.error) {
                return 'Unknown user';
              } else {
                return this.userFromObjectJSON(userData);
              }
            })
        );
  }

  userFromObjectJSON(userData) {
    this.innerSmeny = [];
    for (const smena of userData.smeny) {
      this.innerSmeny.push(new UserShifts(
          smena.id,
          smena.id_smena,
          smena.id_scitac,
          smena.date,
          smena.comment,
          smena.id_pruzkum,
          smena.name,
          smena.type,
          smena.origin,
          smena.from
          )
      );
    }
    return new User(
        userData.id,
        userData.prefix,
        userData.name,
        userData.surname,
        userData.suffix,
        userData.email,
        userData.phone,
        userData.comment,
        this.innerSmeny
    );
  }
  userFromObjectDb(userData) {
    this.innerSmeny = [];
    for (const smena of userData.smeny) {
      this.innerSmeny.push(new UserShifts(
          smena.id,
          smena.idSmena,
          smena.idScitac,
          smena.date,
          smena.comment,
          smena.idPruzkum,
          smena.name,
          smena.type,
          smena.origin,
          smena.from
          )
      );
    }
    return new User(
        userData.id,
        userData.prefix,
        userData.name,
        userData.surname,
        userData.suffix,
        userData.email,
        userData.phone,
        userData.comment,
        this.innerSmeny
    );
  }
}
