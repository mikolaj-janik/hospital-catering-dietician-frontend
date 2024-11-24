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
  wardService = inject(WardService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  isResponseHere = false;
  requestFromDieticianDetails = 0;
  isErrorResponse = false;

  hospital: Hospital = null;
  wards: Ward[] = [];
  patients: Patient[] = [];

  ngOnInit() {
    const hospitalId = +this.route.snapshot.paramMap.get('id')!;

    if (this.route.snapshot.queryParamMap.has('dieticianId') && +this.route.snapshot.queryParamMap.get('dieticianId') > 0) {
      this.requestFromDieticianDetails = +this.route.snapshot.queryParamMap.get('dieticianId');
    } 

    this.hospitalService.getHospitalById(hospitalId).pipe(
      catchError((error) => {
        if (error.status === 404) {
          this.toastr.error(`Szpital z id: ${hospitalId} nie istnieje!`);
          this.router.navigate(['hospitals']);
          return of(null);
        }
      })
    ).subscribe((data) => {
      this.hospital = data;
      
      this.wardService.getWardsByHospitalId(hospitalId).subscribe((data) => {
        this.wards = data;

        this.patientService.getPatientsByHospitalId(hospitalId).subscribe((data) => {
          this.patients = data;
          this.isResponseHere = true;
        });
      });
    });
  }

  findArrayIndex(id: number) {
    return this.wards.findIndex(ward => ward.id === id);
  }

  redirectToHospitals() {
    if (this.requestFromDieticianDetails === 0) {
      this.router.navigate(['hospitals']);
    } else {
      this.router.navigate([`dieticians/details/${this.requestFromDieticianDetails}`]);
    }
  }

  redirectToAddWard() {
    this.router.navigate([`hospitals/${this.hospital.id}/addWard`]);
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

  handleDeleteWard(wardId: number) {
    this.wardService.deleteWardById(wardId).pipe(
      catchError((error) => {
        if (error.status === 400) {
          this.isErrorResponse = true;
          const errorMessage = error.error.message;

          if (errorMessage.includes('patients')) {
            Swal.fire("Oddział posiada pacjentów", "Jeżeli chcesz usunąć oddział, upewnij się, że nie ma przypisanych żadnych pacjentów", 'error');

          } else if (errorMessage.includes('dieticians')) {
            Swal.fire("Oddział ma przypisanych dietetyków", "Jeżeli chcesz usunąć oddział, upewnij się, że nie ma przypisanego żadnego dietetyka", 'error');
          }
          
          return of(null);
        }
      })
    ).subscribe(() => {
      if (!this.isErrorResponse) {
        Swal.fire("Oddział został usunięty", "Oddział został usunięty pomyślnie", 'success').then(() => {
          window.location.reload();
        });
      }
    });
  }
}
