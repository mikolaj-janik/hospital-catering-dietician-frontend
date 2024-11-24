import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable(
  {providedIn: 'root'})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USER_EMAIL = 'USER_EMAIL';
  private readonly STAY_LOGGEDIN_FLAG = 'STAY_LOGGED_IN';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$ = this.isAuthenticatedSubject.asObservable();

  private errorStatusCode = new BehaviorSubject<number>(-1);
  public errorStatusCode$ = this.errorStatusCode.asObservable();

  constructor(
    private routerService: Router,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  login(user: {email: string, password: string}, stayLoggedIn: boolean): Observable<any> {
    return this.http
    .post(`${environment.apiUrl}/login`, user)
    .pipe(
      tap((token: {token: string}) => this.doLoginUser(user.email, token.token, stayLoggedIn)),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.status === 401) {
          this.errorStatusCode.next(401);
          this.toastr.error('Niepoprawny adres e-mail lub hasło');
        } 
        else if (error.status === 0) {
          
          this.handleServerConnectionError();
        }
        errorMessage = error.error.message;
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }


  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.JWT_TOKEN);
    const stayLoggedInFlag = localStorage.getItem(this.STAY_LOGGEDIN_FLAG);

    if (!token) {
      return false;
    }

    const tokenPayload = this.decodeToken(token);

    if (!tokenPayload) {
      return false;
    }

    const expirationDate = tokenPayload.exp * 1000;
    const currentDate = new Date().getTime();

    if (expirationDate < currentDate) {
      if (stayLoggedInFlag === 'true') {
        this.refreshToken(token);
        return true;
      }
      this.toastr.warning('Sesja wygasła');
      return false;
    }

    return true;
  }

  decodeToken(token: string) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch(e) {
      console.error('Error decoding token ', e);
      return null;
    }
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USER_EMAIL);
    localStorage.removeItem(this.STAY_LOGGEDIN_FLAG);
    this.isAuthenticatedSubject.next(false);
    this.routerService.navigate(['/login']);
  }

  private refreshToken(expiredToken: string) {
    return this.http
    .post(`${environment.apiUrl}/refresh`, {token: expiredToken})
    .pipe(
      tap((token: {token: string}) => {
        this.storeJwtToken(token.token);
        console.log('Token has been refreshed');
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.status === 401 || error.status === 400) {
          this.toastr.error('Wystąpił problem z odświeżeniem sesji');
          this.logout();
        } else if (error.status === 0) {
          this.handleServerConnectionError();
        }
        errorMessage = error.error.message;
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    ).subscribe({
      next: (response) => console.log('Response from refresh:', response),
      error: (error) => console.log('Error from refresh:', error)
  });
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getJwtToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAuthHeadersWithFile(): HttpHeaders {
    const token = this.getJwtToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  handleServerConnectionError() {
    this.errorStatusCode.next(0);
    this.toastr.error('Wystąpił problem z połączeniem z serwerem');
    this.logout();
  }

  private doLoginUser(email: string, token: string, stayLoggedInFlag: boolean) {
    this.isAuthenticatedSubject.next(true);
    this.errorStatusCode.next(200);
    this.storeJwtToken(token);
    this.storeUserEmail(email);
    this.storeStayFlag(stayLoggedInFlag);
    this.toastr.success("Pomyślnie zalogowano jako " + email);
  }

  private storeStayFlag(flag: boolean) {
    let stringFlag = 'false';
    if (flag) {
      stringFlag = 'true';
    }
    localStorage.setItem(this.STAY_LOGGEDIN_FLAG, stringFlag);
  }
  
  handleError() {
    this.toastr.error('Wystąpił nieoczekiwany problem');
    this.logout();
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.USER_EMAIL);
  }

  getJwtToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private storeUserEmail(email: string) {
    localStorage.setItem(this.USER_EMAIL, email);
  }
  
  private storeJwtToken(token: string) {
    localStorage.setItem(this.JWT_TOKEN, token);
  }
}


