import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Hospital } from 'src/app/common/hospital';
import { DieticianService } from 'src/app/service/dietician.service';
import { HospitalService } from 'src/app/service/hospital.service';
import { WardService } from 'src/app/service/ward.service';
import { Dietician } from 'src/app/common/dietician';

@Component({
  selector: 'app-new-ward',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    FormsModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './new-ward.component.html',
  styleUrl: './new-ward.component.scss'
})
export class NewWardComponent {

  hospitalService = inject(HospitalService);
  wardService = inject(WardService);
  dieticianService = inject(DieticianService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  isResponseHere = false;
  doDieticiansExist = true;

  hospital: Hospital = null;

  dieticians: Dietician[] = [];
  chosenDieticians: Dietician[] = [];
  isChosenDietician: boolean[] = [];

  name = '';
  phoneNumber = '';

  phoneNumberPattern = '^(\\d{2}\\s?\\d{3}\\s?\\d{2}\\s?\\d{2}|\\d{2}\\s?\\d{4}\\s?\\d{3}|\\d{3}\\s?\\d{3}\\s?\\d{3})$';

  newWardForm = new FormGroup({
    name: new FormControl(this.name, [Validators.required, Validators.maxLength(120)]),
    phoneNumber: new FormControl(this.phoneNumber, [Validators.required, Validators.pattern(this.phoneNumberPattern)])
  });

  ngOnInit() {
    const hospitalId = +this.route.snapshot.paramMap.get('id')!;
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

      this.dieticianService.getDieticiansByHospitalId(data.id).subscribe((data) => {
        this.dieticians = data;

        if (data.length === 0) {
          this.doDieticiansExist = false;
        }
        
        data.forEach(() => this.isChosenDietician.push(false));
        this.isResponseHere = true;
      });
    });
  }

  addNewWard() {
    if (this.newWardForm.valid) {
      const { name, phoneNumber } = this.newWardForm.value;
      const dieticians = this.chosenDieticians;

      this.wardService.createWard(
        {
          name: name as string,
          phoneNumber: phoneNumber as string,
          hospital: this.hospital,
          dieticians: dieticians
        }
      ).subscribe(() => {
        this.toastr.success('Pomyślnie dodano nowy oddział');
        this.router.navigate([`hospitals/details/${this.hospital.id}`]);
      });
    }
  }

  handleAddDietician(dieticianId: number) {
    for (let i = 0; i < this.dieticians.length; i++) {
      if (this.dieticians[i].id === dieticianId) {
        
        this.isChosenDietician[i] = !this.isChosenDietician[i];

        if (!this.isChosenDietician[i]) {
          let indexToDelete
          for (let j = 0; j < this.chosenDieticians.length; j++) {
            if (this.chosenDieticians[j].id === dieticianId) {
              indexToDelete = j;
            }
          }
          this.chosenDieticians.splice(indexToDelete, 1);
        } else {
          this.chosenDieticians.push(this.dieticians[i]);
        }
      }
    }
  }

  redirectToHospitalDetails() {
    this.router.navigate([`hospitals/details/${this.hospital.id}`]);
  }
}
