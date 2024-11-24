import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Diet } from 'src/app/common/diet';
import { DietService } from 'src/app/service/diet.service';

@Component({
  selector: 'app-edit-diet',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './edit-diet.component.html',
  styleUrl: './edit-diet.component.scss'
})
export class EditDietComponent {
  diet: Diet = null;
  name = '';
  description = '';

  isResponseHere = false;

  dietService = inject(DietService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.handleDietDetails();
    });
  }

  editDietForm = new FormGroup({
    name: new FormControl(this.name, [Validators.required, Validators.maxLength(120)]),
    description: new FormControl(this.description, [Validators.required, Validators.maxLength(1020)])
  });

  handleDietDetails() {
    const dietId: number = +this.route.snapshot.paramMap.get('id')!;

    this.dietService.getDietById(dietId).pipe(
      catchError((error) => {
        if (error.status === 404) {
          this.isResponseHere = true;
          return of(null);
        }
      })
    ).subscribe(
      data => {
        this.diet = data;
        this.name = data.name;
        this.description = data.description;
        this.editDietForm.get('name').setValue(data.name);
        this.editDietForm.get('description').setValue(data.description);
        this.isResponseHere = true;
      }
    );
  }

  editDiet() {
    if (this.editDietForm.valid) {
      const { name, description } = this.editDietForm.value;
      const id = this.diet.id;

      if (name === this.diet.name && description === this.diet.description) {
        this.toastr.info('Nic nie zostało zmienione');
      } else {
        this.dietService.updateDiet(
          {
            id: id as number,
            name: name as string,
            description: description as string
          }
        )
        .subscribe(() => {
          this.toastr.success('Zaktualizowano dietę');
          this.router.navigate([`meals/diets/${id}`]);
        });
      }
    }
  }
}
