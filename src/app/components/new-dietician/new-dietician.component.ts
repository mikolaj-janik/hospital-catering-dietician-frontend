import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Injector } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/common/hospital';
import { Ward } from 'src/app/common/ward';
import { DieticianService } from 'src/app/service/dietician.service';
import { HospitalService } from 'src/app/service/hospital.service';
import { WardService } from 'src/app/service/ward.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-dietician',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCheckboxModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './new-dietician.component.html',
  styleUrl: './new-dietician.component.scss'
})
export class NewDieticianComponent {
  name = '';
  surname = '';
  email = '';
  password = 'Szpital123.';
  picture: any = null;

  passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
  hiddenPassword = true;

  isUploadedOnlyOneFile = true;
  isValidFileFormat = true;
  isHospitalChosen = false;
  isSelectAllSelected = false;

  hospitals: Hospital[] = [];
  wards: Ward[] = [];
  
  isChosenWard: boolean[] = [];
  chosenWards: Ward[] = [];
  chosenHospitalId = 0;

  wardService = inject(WardService);
  hospitalService = inject(HospitalService);
  dieticianService = inject(DieticianService);
  router = inject(Router);
  toastr = inject(ToastrService);

  newDieticianForm = new FormGroup({
    name: new FormControl(this.name, [Validators.required, Validators.maxLength(50)]),
    surname: new FormControl(this.surname, [Validators.required, Validators.maxLength(50)]),
    email: new FormControl(this.email, [Validators.required, Validators.email]),
    defaultPassword: new FormControl(this.password, [Validators.required, Validators.pattern(this.passwordPattern)]),
    hospitalId: new FormControl(this.chosenHospitalId, [Validators.min(1)])
  });

  ngOnInit() {
    this.hospitalService.getAllHospitalsList().subscribe(data => this.hospitals = data);
  }

  handleSelectHospital(id: number) {
    this.chosenHospitalId = id;
    this.wardService.getWardsByHospitalId(id).subscribe((data) => {
      data.forEach(() => this.isChosenWard.push(false));
      this.wards = data;
    });
  }

  handleSelectWard(id: number) {
    for (let i = 0; i < this.wards.length; i++) {
      if (this.wards[i].id === id) {
        
        this.isChosenWard[i] = !this.isChosenWard[i];

        if (!this.isChosenWard[i]) {
          let indexToDelete
          for (let j = 0; j < this.chosenWards.length; j++) {
            if (this.chosenWards[j].id === id) {
              indexToDelete = j;
            }
          }
          this.chosenWards.splice(indexToDelete, 1);
        } else {
          this.chosenWards.push(this.wards[i]);
        }
      }
    }
    console.log('-----------');
    for(let i = 0; i < this.chosenWards.length; i++) {
      console.log(this.chosenWards[i].name);
    }
    console.log('-----------');
  }

  handleSelectAll() {
    this.isSelectAllSelected = !this.isSelectAllSelected;

    if (this.isSelectAllSelected) {
      for (let i = 0; i < this.wards.length; i++) {
        if (!this.isChosenWard[i]) {
          this.isChosenWard[i] = true;
          this.chosenWards.push(this.wards[i]);
        }
      }
    }
    console.log('-----------');
    for(let i = 0; i < this.chosenWards.length; i++) {
      console.log(this.chosenWards[i].name);
    }
    console.log('-----------');
  }

  handleFileUpload(event: any) {
    if (event.target.files.length === 1) {
      const file = event.target.files[0];
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (validImageTypes.includes(file.type)) {
        this.isValidFileFormat = true;
        this.picture = file;
      } else {
        this.isValidFileFormat = false;
      }
    }
    else if (event.target.files.length > 1) {
      this.isUploadedOnlyOneFile = false;
    }
  }

  selectHospital(hospitalId: number) {
    this.chosenHospitalId = hospitalId;
    this.chosenWards = [];
    this.isChosenWard = [];
    this.wardService.getWardsByHospitalId(hospitalId).subscribe((data) => {
      this.wards = data;

      if (data.length === 0) {
        Swal.fire("Szpital nie posiada oddziałów", "Upewnij się, że szpital, który chcesz wybrać posiada oddziały", 'warning');
      }
      this.isHospitalChosen = true;
    });
  }

  toggleHiddenPassword() {
    this.hiddenPassword = !this.hiddenPassword;
  }

  isWardSelected(id: number) {
    for (let i = 0; i < this.wards.length; i++) {
      if (this.wards[i].id === id) {
        if (this.isChosenWard[i]) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  submitNewDietician() {
    if (this.newDieticianForm.valid) {
      if (this.chosenWards.length > 0) {
        const { name, surname, email, defaultPassword, hospitalId } = this.newDieticianForm.value;

        this.dieticianService.registerDietician({
          name: name as string,
          surname: surname as string,
          email: email as string,
          defaultPassword: defaultPassword as string,
          hospitalId: hospitalId as number,
          wards: this.chosenWards
        }).subscribe((dietician) => {

          if (this.picture != null) {
            const formData = new FormData();
            formData.append('picture', this.picture);

            this.dieticianService.uploadPicture(dietician.id, formData).subscribe(() => {
              this.toastr.success('Pomyślnie zarejestrowano dietetyka');
              this.router.navigate(['dieticians']);
            });
          } else {
            this.toastr.success('Pomyślnie zarejestrowano dietetyka');
            this.router.navigate(['dieticians']);
          }
        });
      } else {
        Swal.fire("Brak przypisanych oddziałów", "Upewnij się, że dietetyk ma przypisany chociaż jeden oddział", 'error');
      }
    }
  }
}
