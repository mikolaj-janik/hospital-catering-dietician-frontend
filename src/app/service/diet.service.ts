import { Injectable, signal, Signal } from '@angular/core';
import { AuthService } from './auth.service';
import { SearchBarService } from './search-bar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Diet } from '../common/diet';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Form, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DietService {

  constructor(
    private authService: AuthService,
    private searchBarService: SearchBarService,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  searchTerm = this.searchBarService.searchTerm;

  getAllDiets(): Observable<Diet[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/diets`;

    return this.http.get<Diet[]>(url, { headers });
  }

  getAllDietsWithActiveMeals(): Observable<Diet[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/diets/current`;

    return this.http.get<Diet[]>(url, { headers });
  }

  getDietById(id: number): Observable<Diet> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/diets/${id}?diary=false`;

    return this.http.get<Diet>(url, { headers });
  }

  getDietsByWardId(wardId: number): Observable<Diet[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/diets/ward/${wardId}`;

    return this.http.get<Diet[]>(url, { headers });
  }

  getDietByIdFromDiary(id: number): Observable<Diet> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/diets/${id}?diary=true`;

    return this.http.get<Diet>(url, { headers });
  }

  getDietByName(keyword: string): Observable<Diet[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/diets/search?name=${keyword}`;

    return this.http.get<Diet[]>(url, { headers });
  }
}
