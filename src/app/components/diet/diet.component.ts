import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Diet } from 'src/app/common/diet';
import { AuthService } from 'src/app/service/auth.service';
import { DietService } from 'src/app/service/diet.service';

@Component({
  selector: 'app-diet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diet.component.html',
  styleUrl: './diet.component.scss'
})
export class DietComponent {

  dietService = inject(DietService);
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  isLoggedIn!: boolean;
  isResponseHere = false;
  searchMode: boolean = false;
  diets: Diet[] = [];

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
    
    this.route.paramMap.subscribe(() => {
      this.listDiets();
    });
    
    
    if (!this.isLoggedIn) {
      this.authService.logout(); 
    }
  }

  listDiets() {
    this.isResponseHere = false;
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    
    if (!this.searchMode) {
      this.handleListDiets();
    }
    else {
      this.handleSearchDiets();
    }
  }

  redirectToDetails(id: number) {
    this.router.navigate([`meals/diets/${id}`]);
  }
  
  findArrayIndex(id: number) {
    return this.diets.findIndex(diet => diet.id === id);
  }

  handleSearchDiets() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.dietService.getDietByName(keyword).subscribe(this.processResult());
  }

  handleListDiets() {
    this.dietService.getAllDiets().subscribe(this.processResult());
  }

  processResult() {
    return (diets: any) => {
      this.diets = diets;
      this.isResponseHere = true;
    }
  }
}
