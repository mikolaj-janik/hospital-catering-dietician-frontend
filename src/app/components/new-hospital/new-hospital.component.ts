import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { HospitalService } from 'src/app/service/hospital.service';
import { ToastrService } from 'ngx-toastr';
import { DietService } from 'src/app/service/diet.service';

@Component({
  selector: 'app-new-hospital',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './new-hospital.component.html',
  styleUrl: './new-hospital.component.scss'
})
export class NewHospitalComponent {

  name = '';
  phoneNumber = '';
  street = '';
  buildingNo = 0;
  zipCode = '';
  city = '';
  picture: any;

  uploadedPicture = true;
  isUploadedOnlyOneFile = true;
  isValidFileFormat = true;
  phoneExtension = '+48 ';

  zipCodePattern = '[0-9]{2}-[0-9]{3}';
  phoneNumberPattern = '^(\\d{2}\\s?\\d{3}\\s?\\d{2}\\s?\\d{2}|\\d{2}\\s?\\d{4}\\s?\\d{3}|\\d{3}\\s?\\d{3}\\s?\\d{3})$';
  camelCasePattern = '^[A-Z].*$';

  hospitalService = inject(HospitalService);
  dietService = inject(DietService);
  toastr = inject(ToastrService);
  router = inject(Router);

  newHospitalForm = new FormGroup({
    name: new FormControl(this.name, [Validators.required]),
    phoneNumber: new FormControl(this.phoneNumber, [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
    street: new FormControl(this.street, [Validators.required, Validators.pattern(this.camelCasePattern)]),
    zipCode: new FormControl(this.zipCode, [Validators.required, Validators.pattern(this.zipCodePattern)]),
    buildingNo: new FormControl(this.buildingNo, [Validators.required, Validators.min(1)]),
    city: new FormControl(this.city, [Validators.required, Validators.pattern(this.camelCasePattern)]),
  });

  handleFileUpload(event: any) {
    if (event.target.files.length === 1) {
      const file = event.target.files[0];
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (validImageTypes.includes(file.type)) {
        this.uploadedPicture = true;
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

  addNewHospital() {
    if (this.newHospitalForm.valid) {
      if (this.picture != null) {
        this.uploadedPicture = true;
        const formData = new FormData();

        formData.append('name', this.newHospitalForm.get('name')?.value);
        formData.append('phoneNumber', this.phoneExtension + this.newHospitalForm.get('phoneNumber')?.value);
        formData.append('street', this.newHospitalForm.get('street')?.value);
        formData.append('buildingNo', this.newHospitalForm.get('buildingNo')?.value.toString());
        formData.append('zipCode', this.newHospitalForm.get('zipCode')?.value);
        formData.append('city', this.newHospitalForm.get('city')?.value);
        formData.append('picture', this.picture);

        this.hospitalService.addNewHospital(formData).subscribe({
          next: () => {
            this.toastr.success('Szpital został pomyślnie dodany!');
            this.router.navigate(['hospitals']);
          },
          error: (error) => {
            console.error('Błąd:', error);
          }
        });
      }
      else {
        this.uploadedPicture = false;
        this.toastr.error('Formularz nie został poprawnie wypełniony');
      }
    } else {
      this.toastr.error('Formularz nie został poprawnie wypełniony');
    }
  }
}
