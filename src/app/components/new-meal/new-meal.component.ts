import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Diet } from 'src/app/common/diet';
import { DietService } from 'src/app/service/diet.service';
import { MealService } from 'src/app/service/meal.service';

@Component({
  selector: 'app-new-meal',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCheckboxModule, FormsModule, ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './new-meal.component.html',
  styleUrl: './new-meal.component.scss'
})
export class NewMealComponent {

  dietId = 0;
  name = '';
  description = '';
  price = 0.0;
  type = '';
  calories = 0.0;
  protein = 0.0;
  carbohydrates = 0.0;
  fats = 0.0;
  picture: any;

  uploadedPicture = true;
  isUploadedOnlyOneFile = true;
  isValidFileFormat = true;

  mealPaid = false;

  diets: Diet[] = [];
  types = ['śniadanie', 'obiad', 'kolacja'];

  mealService = inject(MealService);
  dietService = inject(DietService);
  router = inject(Router);
  toastr = inject(ToastrService);

  newMealForm = new FormGroup({
    dietId: new FormControl(this.dietId, [Validators.required, Validators.min(1)]),
    name: new FormControl(this.name, [Validators.required, Validators.maxLength(150)]),
    description: new FormControl(this.description, [Validators.required, Validators.maxLength(350)]),
    price: new FormControl(this.price, [Validators.required, Validators.min(0)]),
    type: new FormControl(this.type, [Validators.required]),
    calories: new FormControl(this.calories, [Validators.required, Validators.min(0)]),
    protein: new FormControl(this.protein, [Validators.required, Validators.min(0)]),
    carbohydrates: new FormControl(this.carbohydrates, [Validators.required, Validators.min(0)]),
    fats: new FormControl(this.fats, [Validators.required, Validators.min(0)]),
  });

  ngOnInit() {
    this.dietService.getAllDiets().subscribe((data: Diet[]) => {
      this.diets = data;
    });
  }

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

  addNewMeal() {
    if (this.newMealForm.valid) {
      if (this.picture != null) {
        this.uploadedPicture = true;
        const formData = new FormData();

        formData.append('dietId', this.newMealForm.get('dietId')?.value.toString());
        formData.append('name', this.newMealForm.get('name')?.value);
        formData.append('description', this.newMealForm.get('description')?.value);
        formData.append('price', this.newMealForm.get('price')?.value.toString());
        formData.append('type', this.newMealForm.get('type')?.value);
        formData.append('calories', this.newMealForm.get('calories')?.value.toString());
        formData.append('protein', this.newMealForm.get('protein')?.value.toString());
        formData.append('carbohydrates', this.newMealForm.get('carbohydrates')?.value.toString());
        formData.append('fats', this.newMealForm.get('fats')?.value.toString());
        formData.append('picture', this.picture);
        
        this.mealService.addNewMeal(formData).subscribe({
          next: () => {
            this.toastr.success('Posiłek został pomyślnie dodany!');
            this.router.navigate(['meals']);
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

  handleMealPaid() {
    this.mealPaid = !this.mealPaid;
    if (!this.mealPaid && this.price > 0) {
      this.price = 0;
      this.newMealForm.get('price').setValue(0);
    }
  }
}
