import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Dietician } from 'src/app/common/dietician';
import { Ward } from 'src/app/common/ward';
import { DieticianService } from 'src/app/service/dietician.service';
import { WardService } from 'src/app/service/ward.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dietician-details',
  standalone: true,
  imports: [SweetAlert2Module],
  templateUrl: './dietician-details.component.html',
  styleUrl: './dietician-details.component.scss'
})
export class DieticianDetailsComponent {

  isResponseHere = false;

  dialogRef = inject(MatDialog);
  router = inject(Router);
  route = inject(ActivatedRoute);
  dieticianService = inject(DieticianService);
  wardService = inject(WardService);
  toastr = inject(ToastrService);

  dietician: Dietician = null;
  wards: Ward[] = [];

  requestFromWardDetails = 0;
  isErrorResponse = false;

  ngOnInit() {
    const dieticianId = +this.route.snapshot.paramMap.get('id')!;

    if (this.route.snapshot.queryParamMap.has('wardId') && +this.route.snapshot.queryParamMap.get('wardId') > 0) {
      this.requestFromWardDetails = +this.route.snapshot.queryParamMap.get('wardId');
    } 

    this.dieticianService.getDieticianById(dieticianId).pipe(
      catchError((error) => {
        if (error.status === 404) {
          this.toastr.error(`Dietetyk z id: ${dieticianId} nie istnieje!`);
          this.redirectToDieticians();
          return of(null);
        }
      })
    ).subscribe((data) => {
      this.dietician = data;

      this.wardService.getWardsByDieticianId(dieticianId).subscribe((data) => {
        this.wards = data;
        this.isResponseHere = true;
      });
    });
  }

  redirectToDieticians() {
    if (this.requestFromWardDetails === 0) {
      this.router.navigate(['dieticians']);
    } else {
      this.router.navigate([`hospitals/ward/${this.requestFromWardDetails}`]);
    }
    
  }

  redirectToWardDetails(wardId: number) {
    this.router.navigate([`hospitals/ward/${wardId}`], { queryParams: { dieticianId: this.dietician.id }});
  }

  redirectToHospitalDetails() {
    this.router.navigate([`hospitals/details/${this.dietician.hospital.id}`], { queryParams: { dieticianId: this.dietician.id }});
  }

  openDialog(image: string) {
    this.dialogRef.open(PopUpComponent, { data : image });
  }

  handleDeleteDietician() {
    this.dieticianService.deleteDieticianById(this.dietician.id).pipe(
      catchError((error) => {
        if (error.status === 400) {
          this.isErrorResponse = true;
          Swal.fire("Dietetyk jest przypisany do oddziałów", "Jeżeli chcesz usunąć konto dietetyka, upewnij się, że nie jest przypisany do żadnych oddziałów", 'error');
          return of(null);
        }
      })
    ).subscribe(() => {
      if (!this.isErrorResponse) {
        Swal.fire("Dietetyk usunięty", "Konto dietetyka zostało usunięte", 'success');
        this.router.navigate(['dieticians']);
      }
    });
  }
}
