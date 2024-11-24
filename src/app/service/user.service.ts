import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../common/user';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private routerService: Router,
    private authService: AuthService,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  getCurrentUser(): Observable<User> {
    const headers = this.authService.getAuthHeaders();
    const email = this.authService.getUserEmail();
    const url = `${environment.apiUrl}/get/${email}`;

    return this.http.get<User>(url, { headers });
  }
}
