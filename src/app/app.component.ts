import { AfterViewChecked, Component, computed, signal } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from './service/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  collapsed = signal(false);

  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  searchBarWidth = computed(() => this.collapsed() ? '5px': '200px');
  
  isLoggedIn! : boolean;
  
  routePath = '';

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
          this.routePath = this.router.url;
      }
    });

    if (!this.isLoggedIn) {
      this.authService.logout(); 
    }
  }

  activateSearchBar() {
    if (this.routePath === '' || this.routePath === '/hospitals' || this.routePath.startsWith('/hospitals/search/')
    || this.routePath === 'dieticians'
    || this.routePath === '/meals' || this.routePath.startsWith('/meals/search')
    || this.routePath === '/meals/diets' || this.routePath.startsWith('/meals/diets/search')
    ) {
      return true;
    }
    return false;
  }

}