import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SearchBarService } from './search-bar.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Ward } from '../common/ward';
import { Dietician } from '../common/dietician';
import { Hospital } from '../common/hospital';

@Injectable({
  providedIn: 'root'
})
export class WardService {

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  getWardsByDieticianId(id: number, name: string = 'null'): Observable<Ward[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/wards?dieticianId=${id}&name=${name}`;

    return this.http.get<Ward[]>(url, { headers });
  }

  getWardById(id: number): Observable<Ward> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/wards/${id}`;

    return this.http.get<Ward>(url, { headers });
  }
}
