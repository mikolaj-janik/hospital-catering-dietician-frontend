import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Hospital } from 'src/app/common/hospital';
import { AuthService } from 'src/app/service/auth.service';
import { HospitalService } from 'src/app/service/hospital.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-hospitals',
  standalone: true,
  imports: [CommonModule, RouterModule, MatPaginator],
  templateUrl: './hospitals.component.html',
  styleUrl: './hospitals.component.scss'
})
export class HospitalsComponent {

  hospitalService = inject(HospitalService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  isLoggedIn! : boolean;
  isResponseHere = false;
  hospitals: Hospital[] = [];
  searchMode: boolean = false;

  paginator: MatPaginator;

  pageNumber = 0;
  pageSize = 6;
  totalElements = 0;

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
    
    this.route.paramMap.subscribe(() => {
      this.listHospitals();
    });
    
    
    if (!this.isLoggedIn) {
      this.authService.logout(); 
    }
  }

  onPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.listHospitals();
  }

  listHospitals() {
    this.isResponseHere = false;
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    
    if (!this.searchMode) {
      this.handleListHospitals();
    }
    else {
      this.handleSearchHospitals();
    }
  }

  handleSearchHospitals() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.hospitalService.getHospitalsByName(this.pageNumber, this.pageSize, keyword).subscribe(this.processResult());
  }

  handleListHospitals() {
    this.hospitalService.getAllHospitals(this.pageNumber, this.pageSize).subscribe(this.processResult());
  }

  redirectToHospitalDetails(id: number) {
    this.router.navigate([`hospitals//details/${id}`]);
  }

  processResult() {
    return (data: any) => {
      this.hospitals = data.content;
      this.totalElements = data.totalElements;
      this.pageSize = data.size;
      this.isResponseHere = true;
    }
  }
}


