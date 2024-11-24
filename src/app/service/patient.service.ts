import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Patient } from '../common/patient';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  getPatientsByWardId(id: number): Observable<Patient[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/patients/ward/${id}`;

    return this.http.get<Patient[]>(url, { headers });
  }

  getPatientsByHospitalId(id: number): Observable<Patient[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/patients/hospital/${id}`;

    return this.http.get<Patient[]>(url, { headers });
  }
}
