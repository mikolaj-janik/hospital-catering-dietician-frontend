import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Diet } from 'src/app/common/diet';
import { Patient } from 'src/app/common/patient';
import { Ward } from 'src/app/common/ward';
import { DietService } from 'src/app/service/diet.service';
import { DieticianService } from 'src/app/service/dietician.service';
import { HospitalService } from 'src/app/service/hospital.service';
import { PatientService } from 'src/app/service/patient.service';
import { WardService } from 'src/app/service/ward.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCheckboxModule, FormsModule, ReactiveFormsModule],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss'
})
export class PatientDetailsComponent {
  name = '';
  surname = '';
  email = '';
  pesel = '';
  password = 'Szpital123.';

  peselPattern = /[0-9]{4}[0-3]{1}[0-9]{1}[0-9]{5}/
  hiddenPassword = true;

  isHospitalChosen = false;
  isSelectAllSelected = false;
  isResponseHere = false;

  chosenWardId = 0;
  chosenDietId = 0;

  wards: Ward[] = [];
  diets: Diet[] = [];
  patient: Patient = null

  wardService = inject(WardService);
  dietService = inject(DietService);
  hospitalService = inject(HospitalService);
  patientService = inject(PatientService);
  dieticianService = inject(DieticianService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  editPatientForm = new FormGroup({
    name: new FormControl(this.name, [Validators.required, Validators.maxLength(50)]),
    surname: new FormControl(this.surname, [Validators.required, Validators.maxLength(50)]),
    email: new FormControl(this.email, [Validators.email]),
    pesel: new FormControl(this.pesel, [Validators.required, Validators.pattern(this.peselPattern)]),
    wardId: new FormControl(this.chosenWardId, [Validators.min(1)]),
    dietId: new FormControl(this.chosenDietId, [Validators.min(1)])
  });

  ngOnInit() {
    const email = localStorage.getItem('USER_EMAIL');
    const patientId = +this.route.snapshot.paramMap.get('id')!;
    this.dieticianService.getDieticianByEmail(email).subscribe(data => {
      this.wardService.getWardsByHospitalId(data.hospital.id).subscribe(data => this.wards = data);
      this.dietService.getAllDiets().subscribe((data) => this.diets = data);
      this.patientService.getPatientById(patientId)
      .pipe(catchError((error) => {
        if (error.status === 404) {
          this.toastr.error('Wystąpił problem');
          this.router.navigate(['wards']);
          return of(null);
        }
      }))
      .subscribe((data) => {
        this.patient = data;
        this.editPatientForm.setValue({
          name: this.patient.name as string,
          surname: this.patient.surname as string,
          email: this.patient.email as string,
          pesel: this.patient.login as string,
          wardId: this.patient.ward.id as number,
          dietId: this.patient.diet.id as number
        })
        this.isResponseHere = true;
      });
    });
  }

  handleSelectWard(id: number) {
    this.chosenWardId = id;
  }


  handleSelectDiet(id: number) {
    this.chosenDietId = id;
  }

  redirectToWardDetails() {
    this.router.navigate([`hospitals/ward/${this.patient.ward.id}`]);
  }

  submitNewPatient() {
     if (this.editPatientForm.valid) {
      const { name, surname, pesel, email, wardId, dietId } = this.editPatientForm.value;

      if (name === this.patient.name && 
          surname === this.patient.surname &&
          pesel === this.patient.login &&
          email === this.patient.email &&
          wardId === this.patient.ward.id &&
          dietId === this.patient.diet.id
      ) {
        this.toastr.info('Nic nie zostało zmienione');

      } else {
        this.patientService.editPatient({
          id: this.patient.id as number,
          name: name as string,
          surname: surname as string,
          login: pesel as string,
          email: email as string,
          wardId: wardId as number,
          dietId: dietId as number
        }).subscribe(() => {
          this.router.navigate([`hospitals/ward/${wardId}`]);
          Swal.fire("Edycja pomyślna", "Pomyślnie zaktualizowano konto pacjenta", 'success');
        });
      }
     }
  }
}
