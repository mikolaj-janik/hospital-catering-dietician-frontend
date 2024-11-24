import { Component, computed } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { inject } from '@angular/core';
import { SearchBarService } from 'src/app/service/search-bar.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, filter, Observable } from 'rxjs';

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [MatDivider, MatListModule, MatIcon, MatIconButton],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss',
})
export class SearchOverlayComponent {
  searchBarService = inject(SearchBarService);
  router = inject(Router);

  private routePathSubject = new BehaviorSubject<string>('');
  routePath$: Observable<string> = this.routePathSubject.asObservable();
  recentSearches = computed(() => this.searchBarService.recentSearches().slice(0, 5));


  ngOnInit() {
    this.routePathSubject.next(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.routePathSubject.next(this.router.url);
    });
  }

  deleteRecentSearch(searchTerm: string) {
    this.searchBarService.deleteRecentSearch(searchTerm);
  }

  performSearch(searchTerm: string) {
    const routePath = this.routePathSubject.value;
    console.log('routePath is ' + routePath);
    if (routePath === '' || routePath === '/hospitals' || routePath.startsWith('/hospitals/search/')) {
      this.searchBarService.searchHospital(searchTerm);

    } else if (routePath === '/meals' || routePath.startsWith('/meals/search/')) {
      this.searchBarService.searchMeal(searchTerm);

    } else if (routePath === '/meals/diets' || routePath.startsWith('/meals/diets/search/')) {
      this.searchBarService.searchDiet(searchTerm);
    }
  }
}
