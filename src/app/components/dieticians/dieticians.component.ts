import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { Dietician } from 'src/app/common/dietician';
import { Hospital } from 'src/app/common/hospital';
import { DieticianService } from 'src/app/service/dietician.service';
import { HospitalService } from 'src/app/service/hospital.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dieticians',
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  templateUrl: './dieticians.component.html',
  styleUrl: './dieticians.component.scss'
})
export class DieticiansComponent {

  dietitianService = inject(DieticianService);
  hospitalService = inject(HospitalService);
  router = inject(Router);

  isResponseHere = false;
  selectedHospitalId = 0;

  hospitals: Hospital[] = [];
  dieticians: Dietician[] = [];

  ngOnInit() {
    this.listDieticians();
    this.hospitalService.getHospitalsThatHaveDieticians().subscribe((data) => {
      this.hospitals = data;
    })
  }

  listDieticians() {
    this.dietitianService.getAllDieticians(this.selectedHospitalId).subscribe((data) => {
      this.dieticians = data;
      this.isResponseHere = true;
    });
  }

  onSelectHospital(hospitalId: number) {
    this.isResponseHere = false;
    this.selectedHospitalId = hospitalId;
    this.listDieticians();
  }

  findArrayIndex(id: number) {
    return this.dieticians.findIndex(dietician => dietician.id === id);
  }
  
  redirectToDieticianDetails(dieticianId: number) {
    this.router.navigate([`dieticians/details/${dieticianId}`]);
  }
}
