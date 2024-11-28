import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/common/user';
import { MenuItemComponent } from '../menu-item/menu-item.component';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MenuItemComponent],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent {

  isLoggedIn! : boolean;

  userService = inject(UserService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);

  currentUser: User;

  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
    
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.currentUser = user;
      }
    );
    
    if (!this.isLoggedIn) {
      this.authService.logout(); 
    }
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'fas fa-hospital-alt',
      label: 'Moje oddziały',
      route: 'wards'
    },
    {
      icon: 'fas fa-users',
      label: 'Dodaj pacjenta',
      route: 'dieticians'
    },
    {
      icon: 'far fa-calendar-alt',
      label: 'Jadłospis',
      route: 'meals/diary'
    },
    {
      icon: 'fas fa-carrot',
      label: 'Diety',
      route: 'meals/diets',
    }
  ]);

  profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100');

  logout() {
    if (this.isLoggedIn) {
      this.authService.logout();
      this.toastr.info('Wylogowano pomyślnie');
    }
  }
}
