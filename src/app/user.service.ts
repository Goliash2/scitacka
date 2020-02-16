import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from './user.model';
import {Shift} from './shift.model';

interface UserData {
  error: string;
  id: number;
  prefix: string;
  name: string;
  surname: string;
  suffix: string;
  email: number;
  phone: string;
  comment: string;
  smeny: any[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  innerSmeny: Shift[] = [];
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
                for (const smena of userData.smeny) {
                  this.innerSmeny.push(new Shift(
                      smena.id,
                      smena.id_smena,
                      smena.id_scitac,
                      smena.date,
                      smena.comment,
                      smena.id_pruzkum,
                      smena.name,
                      smena.type
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
            })
        );
  }
}
