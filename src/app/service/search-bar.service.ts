import { Injectable, signal } from '@angular/core';
import { Hospital } from '../common/hospital';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HospitalService } from './hospital.service';

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {

  overlayOpen = signal(false);
  recentSearches = signal<string[]>([]);
  searchTerm = signal('');

  routePath = '';

  private readonly recentHospitalSearches = 'recentHospitalSearches';
  private readonly recentDietSearches = 'recentDietSearches';
  private readonly recentMealSearches = 'recentMealSearches';
  private readonly recentWardSearches = 'recentWardSearches';

  private routePathSubject = new BehaviorSubject<string>('');
  routePath$: Observable<string> = this.routePathSubject.asObservable();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.checkIfRecentSearchesExists();
    this.routePathSubject.next(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.routePathSubject.next(this.router.url);
    });
  }

  searchHospital(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.overlayOpen.set(false);
    this.addHospitalNameToRecentSearches(searchTerm);
    console.log(searchTerm);
    this.router.navigate([`hospitals/search/${searchTerm}`]);
  }

  searchDiet(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.overlayOpen.set(false);
    this.addDietNameToRecentSearches(searchTerm);
    console.log(searchTerm);
    this.router.navigate([`meals/diets/search/${searchTerm}`]);
  }

  searchMeal(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.overlayOpen.set(false);
    this.addMealToRecentSearches(searchTerm);
    console.log(searchTerm);
    this.router.navigate([`meals/search/${searchTerm}`]);
  }

  searchWard(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.overlayOpen.set(false);
    this.addWardToRecentSearches(searchTerm);
    console.log(searchTerm);
    this.router.navigate([`wards/search/${searchTerm}`]);
  }

  getRecentHospitalSearches() {
    const routePath = this.routePathSubject.value;
    if (routePath === '' || routePath === '/hospitals' || routePath.startsWith('/hospitals/search')) {
      let searches = localStorage.getItem(this.recentHospitalSearches);
      if (searches) {
        this.recentSearches.set(JSON.parse(searches));
      } 
    }
  }

  getRecentDietsSearches() {
    const routePath = this.routePathSubject.value;
    if (routePath === '/meals/diets' || routePath.startsWith('/meals/diets/search')) {
      let searches = localStorage.getItem(this.recentDietSearches);

      if (searches) {
        this.recentSearches.set(JSON.parse(searches));
      }
    }
  }

  getRecentWardSearches() {
    const routePath = this.routePathSubject.value;
    if (routePath === '/wards' || routePath.startsWith('/wards/search')) {
      let searches = localStorage.getItem(this.recentWardSearches);

      if (searches) {
        this.recentSearches.set(JSON.parse(searches));
      }
    }
  }
  
  getRecentMealsSearches() {
    const routePath = this.routePathSubject.value;
    if (routePath === '/meals' || routePath.startsWith('/meals/search')) {
      let searches = localStorage.getItem(this.recentMealSearches);

      if (searches) {
        this.recentSearches.set(JSON.parse(searches));
      }
    }
  } // TODO similar methods with meals, users etc

  deleteRecentSearch(searchTerm: string) {
    const routePath = this.routePathSubject.value;
    if (routePath === '' || routePath === '/hospitals' || routePath.startsWith('/hospitals/search')) {
      const updatedSearches = this.handleDeleteSearch(searchTerm);
      localStorage.setItem(this.recentHospitalSearches, JSON.stringify(updatedSearches));

    } else if (routePath === '/meals/diets' || routePath.startsWith('/meals/diets/search')) {
      const updatedSearches = this.handleDeleteSearch(searchTerm);
      localStorage.setItem(this.recentDietSearches, JSON.stringify(updatedSearches));
      
    } else if (routePath === '/meals' || routePath.startsWith('/meals/search')) {
      const updatedSearches = this.handleDeleteSearch(searchTerm);
      localStorage.setItem(this.recentMealSearches, JSON.stringify(updatedSearches));

    } else if (routePath === '/wards' || routePath.startsWith('/wards/search')) {
      const updatedSearches = this.handleDeleteSearch(searchTerm);
      localStorage.setItem(this.recentWardSearches, JSON.stringify(updatedSearches));
    }
  }

  addHospitalNameToRecentSearches(searchTerm: string) {
    const updatedSearches = this.handleAddNameToRecentSearches(searchTerm);

    localStorage.setItem(this.recentHospitalSearches, JSON.stringify(updatedSearches));
  }

  addDietNameToRecentSearches(searchTerm: string) {
    const updatedSearches = this.handleAddNameToRecentSearches(searchTerm);

    localStorage.setItem(this.recentDietSearches, JSON.stringify(updatedSearches));
  }

  addMealToRecentSearches(searchTerm: string) {
    const updatedSearches = this.handleAddNameToRecentSearches(searchTerm);
    
    localStorage.setItem(this.recentMealSearches, JSON.stringify(updatedSearches));
  }

  addWardToRecentSearches(searchTerm: string) {
    const updatedSearches = this.handleAddNameToRecentSearches(searchTerm);
    
    localStorage.setItem(this.recentWardSearches, JSON.stringify(updatedSearches));
  }
  
  private handleAddNameToRecentSearches(searchTerm: string) {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const updatedSearches = [
      lowerCaseTerm,
      ...this.recentSearches().filter(s => s !== lowerCaseTerm),
    ];

    this.recentSearches.set(updatedSearches);
    return updatedSearches;
  }

  private handleDeleteSearch(searchTerm: string) {
    const updatedSearches = this.recentSearches().filter(s => s !== searchTerm);

      if (updatedSearches.length === 0) {
        this.overlayOpen.set(false);
      }
      
      this.recentSearches.set(updatedSearches);

      return updatedSearches;
  }

  private checkIfRecentSearchesExists() {
    if (localStorage.getItem(this.recentHospitalSearches) === null) {
      localStorage.setItem(this.recentHospitalSearches, JSON.stringify([]));
    }
    if (localStorage.getItem(this.recentDietSearches) === null) {
      localStorage.setItem(this.recentDietSearches, JSON.stringify([]));
    }
    if (localStorage.getItem(this.recentMealSearches) === null) {
      localStorage.setItem(this.recentMealSearches, JSON.stringify([]));
    }
    if (localStorage.getItem(this.recentWardSearches) === null) {
      localStorage.setItem(this.recentWardSearches, JSON.stringify([]));
    }
  }
}
