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
    private searchBarService: SearchBarService,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  getWardsByHospitalId(id: number): Observable<Ward[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/hospitals/${id}/wards`;

    return this.http.get<Ward[]>(url, { headers });
  }

  getWardsByDieticianId(id: number): Observable<Ward[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/wards?dieticianId=${id}`;

    return this.http.get<Ward[]>(url, { headers });
  }

  getWardById(id: number): Observable<Ward> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/wards/${id}`;

    return this.http.get<Ward>(url, { headers });
  }

  createWard(newWard: { name: string, phoneNumber: string, hospital: Hospital, dieticians: Dietician[] }): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/wards/add`;

    return this.http.post(url, newWard, { headers });
  }

  updateWard(editedWard: { id: number, 
                           name: string, 
                           phoneNumber: string, 
                           dieticians: Dietician[] }): Observable<any> {
  const headers = this.authService.getAuthHeaders();
  const url = `${environment.apiUrl}/wards/update`;
                        
  return this.http.put(url, editedWard, { headers });                    
  }

  deleteWardById(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/wards/${id}`;

    return this.http.delete(url, { headers });
  }
}
