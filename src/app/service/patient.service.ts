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
  ) {}

  getPatientById(id: number): Observable<Patient> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/patients/${id}`;

    return this.http.get<Patient>(url, { headers });
  }

  getPatientsByWardId(id: number, orderBy: string = 'date'): Observable<Patient[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/patients/ward/${id}?orderBy=${orderBy}`;

    return this.http.get<Patient[]>(url, { headers });
  }

  getPatientsByHospitalId(id: number): Observable<Patient[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/patients/hospital/${id}`;

    return this.http.get<Patient[]>(url, { headers });
  }

  registerPatient(patient: { name: string, 
    surname: string, pesel: string, defaultPassword: string, 
    email: string, wardId: number, dietId: number }): Observable<any> {
      const headers = this.authService.getAuthHeaders();
      const url = `${environment.apiUrl}/patients/register`;

      return this.http.post(url, patient, { headers });
    }

    editPatient(patient: { id: number, name: string, 
      surname: string, login: string, 
      email: string, wardId: number, dietId: number }): Observable<any> {
        const headers = this.authService.getAuthHeaders();
        const url = `${environment.apiUrl}/patients/edit`;
  
      return this.http.post(url, patient, { headers });
    }

    deletePatientById(id: number): Observable<any> {
      const headers = this.authService.getAuthHeaders();
      const url = `${environment.apiUrl}/patients/delete/${id}`;

      return this.http.delete(url, { headers });
    }
}
