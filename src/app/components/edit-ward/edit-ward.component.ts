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
import { Dietician } from 'src/app/common/dietician';
import { Ward } from 'src/app/common/ward';
import { DieticianService } from 'src/app/service/dietician.service';
import { WardService } from 'src/app/service/ward.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-ward',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    FormsModule, ReactiveFormsModule, MatCheckboxModule, SweetAlert2Module],
  templateUrl: './edit-ward.component.html',
  styleUrl: './edit-ward.component.scss'
})
export class EditWardComponent {
  wardService = inject(WardService);
  dieticianService = inject(DieticianService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  isResponseHere = false;
  hasDieticians = false;
  doDieticiansExist = true;
  areAnyChanges = false;

  ward: Ward = null;

  dieticians: Dietician[] = [];
  chosenDieticians: Dietician[] = [];
  isChosenDietician: boolean[] = [];

  name = '';
  phoneNumber = '';

  phoneNumberPattern = '^(\\d{2}\\s?\\d{3}\\s?\\d{2}\\s?\\d{2}|\\d{2}\\s?\\d{4}\\s?\\d{3}|\\d{3}\\s?\\d{3}\\s?\\d{3})$';

  editWardForm = new FormGroup({
    name: new FormControl(this.name, [Validators.required, Validators.maxLength(120)]),
    phoneNumber: new FormControl(this.phoneNumber, [Validators.required, Validators.pattern(this.phoneNumberPattern)])
  });

  ngOnInit() {
    const wardId = +this.route.snapshot.paramMap.get('id');

    this.wardService.getWardById(wardId).pipe(
      catchError((error) => {
        if (error.status === 404) {
          this.toastr.error(`Oddział z id: ${wardId} nie istnieje!`);
          this.router.navigate(['hospitals']);
          return of(null);
        }
      })
    ).subscribe((data) => {
      this.ward = data;

      this.dieticianService.getDieticiansByHospitalId(data.hospital.id).subscribe((data) => {
        this.dieticians = data;

        if (data.length === 0) {
          this.doDieticiansExist = false;
        }
        this.dieticians.forEach(() => this.isChosenDietician.push(false));

        this.dieticianService.getDieticiansByWardId(this.ward.id).subscribe((data) => {
          this.chosenDieticians = data;

          if (data.length > 0) {
            this.hasDieticians = true;
          } else {
            Swal.fire("Oddział nie posiada dietetyka", "Upewnij się że dietetyk zostanie przypisany możliwie jak najszybciej", 'warning');
          }

          for (let i = 0; i < this.dieticians.length; i++) {
            this.chosenDieticians.forEach((dietician) => {
              if (this.dieticians[i].id === dietician.id) {
                this.isChosenDietician[i] = true;
              }
            });
          }

          const phoneNumber = this.ward.phoneNumber.substring(4);
            this.editWardForm.patchValue({
              name: this.ward.name,
              phoneNumber: phoneNumber
            });
            this.isResponseHere = true;
        });
      });
    });
  }

  redirectToWardDetails() {
    this.router.navigate([`hospitals/ward/${this.ward.id}`]);
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
    this.areAnyChanges = true;
  }

  isCheckedDietician(id: number) {
    for (let i = 0; i < this.chosenDieticians.length; i++) {
      if (this.chosenDieticians[i].id === id) {
        return true;
      }
    }
    return false;
  }

  editWardSubmit() {
    if (this.editWardForm.valid) {
      const { name, phoneNumber } = this.editWardForm.value;
      const dieticians = this.chosenDieticians;

      const polishPhoneNumber = `+48 ${phoneNumber}`;
        
      if (name === this.ward.name && 
          polishPhoneNumber === this.ward.phoneNumber &&
          !this.areAnyChanges
      ) {
        this.toastr.info("Nic nie zostało zmienione");
      } else {
        this.wardService.updateWard(
          {
            id: this.ward.id,
            name: name as string,
            phoneNumber: polishPhoneNumber as string,
            dieticians: dieticians
          }
        ).subscribe(() => {
          this.toastr.success('Pomyślnie zaktualizowano oddział');
          this.router.navigate([`hospitals/ward/${this.ward.id}`]);
        });
      }
    }
  }
}
