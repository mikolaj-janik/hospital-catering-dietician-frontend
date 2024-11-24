import { CommonModule } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { inject } from '@angular/core';
import { filter, switchMap } from 'rxjs/operators';
import { MatIconButton } from '@angular/material/button';
import { OverlayModule, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { SearchBarService } from 'src/app/service/search-bar.service';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon, MatIconButton, OverlayModule, SearchOverlayComponent, CdkOverlayOrigin],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchBarComponent {
  
  router = inject(Router);
  searchBarService = inject(SearchBarService)
  activatedRoute = inject(ActivatedRoute);

  overlayOpen = this.searchBarService.overlayOpen;
  recentSearches = computed(() => this.searchBarService.recentSearches().slice(0, 5));
  searchTerm = this.searchBarService.searchTerm;

  private routePathSubject = new BehaviorSubject<string>('');
  routePath$: Observable<string> = this.routePathSubject.asObservable();
  paddingEnd = computed(() => this.searchTerm() ? '8px' : '56px');

  ngOnInit() {
    this.routePathSubject.next(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.routePathSubject.next(this.router.url);
    });
  }

  search(searchTerm: string) {
    if (!searchTerm) 
      return;

    const routePath = this.routePathSubject.value;
    if (routePath === '' || routePath === '/hospitals' || routePath.startsWith('/hospitals/search')) {
      this.searchBarService.searchHospital(searchTerm);
  
    } else if (routePath === '/meals' || routePath.startsWith('/meals/search')) {
      this.searchBarService.searchMeal(searchTerm);
  
    } else if (routePath === '/meals/diets' || routePath.startsWith('/meals/diets/search')) {
      this.searchBarService.searchDiet(searchTerm);
  
    } 
  }

  handleClickedInput() {
    const searches = this.recentSearches();
    if (searches.length > 0) {
      this.overlayOpen.set(true);
    } else {
      this.overlayOpen.set(false);
    }

    const routePath = this.routePathSubject.value;
    
    if (routePath === '' || routePath === '/hospitals' || routePath.startsWith('/hospitals/search')) {
      this.searchBarService.getRecentHospitalSearches();
  
    } else if (routePath === '/meals' || routePath.startsWith('/meals/search')) {
      this.searchBarService.getRecentMealsSearches();
  
    } else if (routePath === '/meals/diets' || routePath.startsWith('/meals/diets/search')) {
      this.searchBarService.getRecentDietsSearches();
  
    }
  }

  handleSearchContent(routePath: string): string {
    if (routePath === '' || routePath === '/hospitals' || routePath.startsWith('/hospitals/search')) {
      return 'Szukaj szpitali';
    } else if (routePath === '/meals' || routePath.startsWith('/meals/search')) {
      return 'Szukaj posiłków';
    } else if (routePath === '/meals/diets' || routePath.startsWith('/meals/diets/search')) {
      return 'Szukaj diet';
    } else if (routePath === '/dieticians') {
      return 'Szukaj dietetyków';
    } else {
      return '';
    }
  }
  
  clearSearch() {
    this.searchTerm.set('');
    if (this.recentSearches().length > 0) {
      this.overlayOpen.set(true);
    }
  }

  isSearchTerm() {
    if (this.searchTerm() === null || this.searchTerm() === '') {
      return false;
    }
    return true;
  }
}
