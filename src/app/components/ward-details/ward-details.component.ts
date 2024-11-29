import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Dietician } from 'src/app/common/dietician';
import { Patient } from 'src/app/common/patient';
import { Ward } from 'src/app/common/ward';
import { DieticianService } from 'src/app/service/dietician.service';
import { PatientService } from 'src/app/service/patient.service';
import { WardService } from 'src/app/service/ward.service';
import { MatTableModule } from '@angular/material/table';
import { Diet } from 'src/app/common/diet';
import { DietService } from 'src/app/service/diet.service';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-ward-details',
  standalone: true,
  imports: [MatTableModule, MatSelectModule, SweetAlert2Module],
  templateUrl: './ward-details.component.html',
  styleUrl: './ward-details.component.scss'
})
export class WardDetailsComponent {

  wardService = inject(WardService);
  patientService = inject(PatientService);
  dieticianService = inject(DieticianService);
  dietService = inject(DietService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  isResponseHere = false;
  requestFromDieticianDetails = 0;

  ward: Ward = null;
  patients: Patient[] = [];
  dieticians: Dietician[] = [];
  diets: Diet[] = [];

  ngOnInit() {
    const wardId = +this.route.snapshot.paramMap.get('id')!;

    if (this.route.snapshot.queryParamMap.has('dieticianId') && +this.route.snapshot.queryParamMap.get('dieticianId') > 0) {
      this.requestFromDieticianDetails = +this.route.snapshot.queryParamMap.get('dieticianId');
    } 

    this.wardService.getWardById(wardId).pipe(
      catchError((error) => {
        if (error.status === 404) {
          this.toastr.error(`Oddział z id: ${wardId} nie istnieje! `);
          this.router.navigate(['hospitals']);
          return of(null);
        }
      })
    ).subscribe((data) => {
      this.ward = data;

      this.dieticianService.getDieticiansByWardId(wardId).subscribe((data) => {
        this.dieticians = data;

        this.patientService.getPatientsByWardId(wardId, "date").subscribe((data) => {
          this.patients = data;
          
          this.dietService.getDietsByWardId(wardId).subscribe((data) => {
            this.diets = data;
            this.isResponseHere = true;
          });
        });
      });
    });
  }

  onSelectOrderBy(name: string) {
    this.isResponseHere = false;

    this.patientService.getPatientsByWardId(this.ward.id, name).subscribe((data) => {
      this.patients = data;
      this.isResponseHere = true;
    });
  }

  findArrayIndex(id: number) {
    return this.patients.findIndex(patient => patient.id === id);
  }

  getPatientsQuantityByDietName(name: string) {
    let quantity = 0;
    this.patients.forEach((patient) => {
      if (patient.diet.name === name) {
        quantity++;
      }
    });
    return quantity;
  }

  handleDeletePatient(id: number) {
    this.patientService.deletePatientById(id).subscribe(() => {
      Swal.fire("Usunięto pacjenta", "Pomyślnie usunięto konto pacjenta", 'info').then(() => {
        window.location.reload();
      });
    });
  }

  redirectToPatientDetails(id: number) {
    this.router.navigate([`patients/${id}`]);
  }

  redirectToHospitalDetails() {
    this.router.navigate([``]);
  }
}
