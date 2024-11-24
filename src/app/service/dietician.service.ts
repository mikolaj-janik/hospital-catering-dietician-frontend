import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SearchBarService } from './search-bar.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Dietician } from '../common/dietician';
import { environment } from 'src/environments/environment';
import { Ward } from '../common/ward';

@Injectable({
  providedIn: 'root'
})
export class DieticianService {

  constructor(
    private authService: AuthService,
    private searchBarService: SearchBarService,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  getDieticianById(id: number): Observable<Dietician> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/dieticians/${id}`;

    return this.http.get<Dietician>(url, { headers });
  }

  getDieticiansByHospitalId(id: number): Observable<Dietician[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/hospitals/${id}/dieticians`;

    return this.http.get<Dietician[]>(url, { headers });
  }

  getAllDieticians(hospitalId: number = 0) {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/dieticians?hospitalId=${hospitalId}`;

    return this.http.get<Dietician[]>(url, { headers });
  }

  getDieticiansByWardId(id: number): Observable<Dietician[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/wards/${id}/dieticians`;

    return this.http.get<Dietician[]>(url, { headers });
  }

  registerDietician(dietician: {name: string, surname: string, 
                                email: string, defaultPassword: string,  
                                hospitalId: number, wards: Ward[]}): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/dieticians/register`;

    return this.http.post(url, dietician, {headers});                              
  }

  uploadPicture(dieticianId: number, formData: FormData): Observable<Dietician> {
    const headers = this.authService.getAuthHeadersWithFile();

    return this.http
    .post<Dietician>(`${environment.apiUrl}/dieticians/uploadPicture?dieticianId=${dieticianId}`, formData, { headers });
  }

  deleteDieticianById(dieticianId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/dieticians/${dieticianId}`;

    return this.http.delete(url, { headers });
  }
}
