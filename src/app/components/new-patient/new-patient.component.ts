import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Injector } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Diet } from 'src/app/common/diet';
import { Hospital } from 'src/app/common/hospital';
import { Ward } from 'src/app/common/ward';
import { DietService } from 'src/app/service/diet.service';
import { DieticianService } from 'src/app/service/dietician.service';
import { HospitalService } from 'src/app/service/hospital.service';
import { PatientService } from 'src/app/service/patient.service';
import { WardService } from 'src/app/service/ward.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-patient',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCheckboxModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './new-patient.component.html',
  styleUrl: './new-patient.component.scss'
})
export class NewPatientComponent {
  name = '';
  surname = '';
  email = '';
  pesel = '';
  password = 'Szpital123.';

  passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
  peselPattern = /[0-9]{4}[0-3]{1}[0-9]{1}[0-9]{5}/
  hiddenPassword = true;

  isHospitalChosen = false;
  isSelectAllSelected = false;

  chosenWardId = 0;
  chosenDietId = 0;

  wards: Ward[] = [];
  diets: Diet[] = [];

  wardService = inject(WardService);
  dietService = inject(DietService);
  hospitalService = inject(HospitalService);
  patientService = inject(PatientService);
  dieticianService = inject(DieticianService);
  router = inject(Router);
  toastr = inject(ToastrService);

  newPatientForm = new FormGroup({
    name: new FormControl(this.name, [Validators.required, Validators.maxLength(50)]),
    surname: new FormControl(this.surname, [Validators.required, Validators.maxLength(50)]),
    email: new FormControl(this.email, [Validators.email]),
    pesel: new FormControl(this.pesel, [Validators.required, Validators.pattern(this.peselPattern)]),
    defaultPassword: new FormControl(this.password, [Validators.required, Validators.pattern(this.passwordPattern)]),
    wardId: new FormControl(this.chosenWardId, [Validators.min(1)]),
    dietId: new FormControl(this.chosenDietId, [Validators.min(1)])
  });

  ngOnInit() {
    const email = localStorage.getItem('USER_EMAIL');
    this.dieticianService.getDieticianByEmail(email).subscribe(data => {
      this.wardService.getWardsByHospitalId(data.hospital.id).subscribe(data => this.wards = data);
      this.dietService.getAllDiets().subscribe((data) => this.diets = data);
    });
  }

  handleSelectWard(id: number) {
    this.chosenWardId = id;
  }


  handleSelectDiet(id: number) {
    this.chosenDietId = id;
  }


  toggleHiddenPassword() {
    this.hiddenPassword = !this.hiddenPassword;
  }

  submitNewPatient() {
     if (this.newPatientForm.valid) {
      const { name, surname, pesel, defaultPassword, email, wardId, dietId } = this.newPatientForm.value;
      console.log(this.newPatientForm.value);

      let wardName;
      this.wards.forEach((ward) => {
        if (ward.id === wardId) {
          wardName = ward.name;
        }
      });

      this.patientService.registerPatient({
        name: name as string,
        surname: surname as string,
        pesel: pesel as string,
        defaultPassword: defaultPassword as string,
        email: email as string,
        wardId: wardId as number,
        dietId: dietId as number
      }).subscribe(() => {
        this.router.navigate([`hospitals/ward/${wardId}`]);
        Swal.fire("Rejestracja przebiegła pomyślnie", `Pacjent został pomyślnie zarejestrowany na oddział: ${wardName}`, 'success');
      });
     }
  }
}
