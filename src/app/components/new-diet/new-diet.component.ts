import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { DietService } from 'src/app/service/diet.service';

@Component({
  selector: 'app-new-diet',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './new-diet.component.html',
  styleUrl: './new-diet.component.scss'
})
export class NewDietComponent {
  name = '';
  description = '';

  dietService = inject(DietService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);

  newDietForm = new FormGroup({
    name: new FormControl(this.name, [Validators.required, Validators.maxLength(120)]),
    description: new FormControl(this.description, [Validators.required, Validators.maxLength(1020)])
  });

  addNewDiet() {
    if (this.newDietForm.valid) {
      const { name, description } = this.newDietForm.value;

      this.dietService.addNewDiet(
      {
        name: name as string,
        description: description as string
      },
      this.newDietForm)
      .subscribe(() => {
        console.log('New diet has been added');
        this.toastr.success('Dodano nową dietę');
        this.router.navigate(['meals/diets']);
      })
    } else {
      console.log('Form is not valid! ');
    }
  }
}
