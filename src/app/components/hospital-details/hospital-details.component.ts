import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Hospital } from 'src/app/common/hospital';
import { Patient } from 'src/app/common/patient';
import { Ward } from 'src/app/common/ward';
import { HospitalService } from 'src/app/service/hospital.service';
import { PatientService } from 'src/app/service/patient.service';
import { WardService } from 'src/app/service/ward.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { DieticianService } from 'src/app/service/dietician.service';
import { Dietician } from 'src/app/common/dietician';

@Component({
  selector: 'app-hospital-details',
  standalone: true,
  imports: [SweetAlert2Module],
  templateUrl: './hospital-details.component.html',
  styleUrl: './hospital-details.component.scss'
})
export class HospitalDetailsComponent {

  hospitalService = inject(HospitalService);
  patientService = inject(PatientService);
  dieticianService = inject(DieticianService);
  wardService = inject(WardService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  isResponseHere = false;
  requestFromDieticianDetails = 0;
  isErrorResponse = false;
  searchMode = false;

  hospital: Hospital = null;
  dietician: Dietician = null;
  wards: Ward[] = [];
  patients: Patient[] = [];

  ngOnInit() {
    const userEmail = localStorage.getItem('USER_EMAIL');

    this.dieticianService.getDieticianByEmail(userEmail).subscribe((data) => {
      this.dietician = data;
      this.hospital = data.hospital;

      this.patientService.getPatientsByHospitalId(this.dietician.hospital.id).subscribe((data) => {
        this.patients = data;

        this.route.paramMap.subscribe(() => this.handleSearchWards());
      });
      
    });
  }

  handleSearchWards() {
    this.isResponseHere = false;
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

      this.wardService.getWardsByDieticianId(this.dietician.id, keyword).subscribe((data) => {
        this.wards = data;
        this.isResponseHere = true;
      });
    } else {
      this.wardService.getWardsByDieticianId(this.dietician.id).subscribe((data) => {
        this.wards = data;
        this.isResponseHere = true;
      });
    }
  }

  findArrayIndex(id: number) {
    return this.wards.findIndex(ward => ward.id === id);
  }

  getPatientsQuantity(wardId: number) {
    let quantity = 0;
    this.patients.forEach((patient) => {
      if (patient.ward.id === wardId) {
        quantity++;
      }
    });
    return quantity;
  }

  redirectToWardDetails(wardId: number) {
    this.router.navigate([`hospitals/ward/${wardId}`]);
  }
}
