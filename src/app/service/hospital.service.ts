import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Hospital } from '../common/hospital';
import { environment } from 'src/environments/environment';
import { SearchBarService } from './search-bar.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private authService: AuthService,
    private searchBarService: SearchBarService,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  searchTerm = this.searchBarService.searchTerm;

  getAllHospitals(pageNumber: number, pageSize: number): Observable<GetResponseHospitals> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/hospitals?page=${pageNumber}&size=${pageSize}`;

    return this.http.get<GetResponseHospitals>(url, { headers });
  }

  getAllHospitalsList(): Observable<Hospital[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/hospitals/list`;

    return this.http.get<Hospital[]>(url, { headers });
  }

  getHospitalById(id: number): Observable<Hospital> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/hospitals/${id}`;

    return this.http.get<Hospital>(url, { headers });
  }

  getHospitalsByName(pageNumber: number, pageSize: number, searchTerm: string): Observable<GetResponseHospitals> {
    const url = `${environment.apiUrl}/hospitals/search?name=${searchTerm}&page=${pageNumber}&size=${pageSize}`;
    const headers = this.authService.getAuthHeaders();
    return this.http.get<GetResponseHospitals>(url, { headers });
  }

  getHospitalsThatHaveDieticians(): Observable<Hospital[]> {
    const url = `${environment.apiUrl}/hospitals/allWithDieticians`;
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Hospital[]>(url, { headers });
  }
}

interface GetResponseHospitals {
  totalElements: number,
  totalPages: number,
  size: number,
  content: Hospital[],
  number: number,
  sort: {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean
  },
  numberOfElements: number,
  first: boolean,
  last: boolean,
  pageable: {
    pageNumber: number,
    pageSize: number,
    sort: {
      empty: boolean,
      sorted: boolean,
      unsorted: boolean
    },
    offset: number,
    paged: boolean,
    unpaged: boolean
  },
  empty: boolean
}