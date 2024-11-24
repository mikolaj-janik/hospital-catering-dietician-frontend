import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Meal } from 'src/app/common/meal';
import { MealService } from 'src/app/service/meal.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DietService } from 'src/app/service/diet.service';
import { Diet } from 'src/app/common/diet';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-edit-meal',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCheckboxModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-meal.component.html',
  styleUrl: './edit-meal.component.scss'
})
export class EditMealComponent {
  meal: Meal = null;

  isResponseHere = false;

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

  diets: Diet[] = [];
  types = ['śniadanie', 'obiad', 'kolacja'];

  uploadedPicture = false;
  isUploadedOnlyOneFile = true;
  isValidFileFormat = true;

  mealPaid = false;

  mealService = inject(MealService);
  dietService = inject(DietService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  editMealForm = new FormGroup({
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
    this.route.paramMap.subscribe(() => {
      this.handleMealDetails();
    });

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

  handleMealDetails() {
    const mealId: number = +this.route.snapshot.paramMap.get('id');

    this.mealService.getMealById(mealId).pipe(
      catchError((error) => {
        if (error.status === 404) {
          this.isResponseHere = true;
          return of(null);
        }
      })
    ).subscribe(
      data => {
        this.meal = data;
        this.dietId = data.diet.id;
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.type = data.type;
        this.calories = data.calories;
        this.protein = data.protein;
        this.carbohydrates = data.carbohydrates;
        this.fats = data.fats;
        this.editMealForm.get('dietId').setValue(data.diet.id);
        this.editMealForm.get('name').setValue(data.name);
        this.editMealForm.get('description').setValue(data.description);
        this.editMealForm.get('price').setValue(data.price);
        this.editMealForm.get('type').setValue(data.type);
        this.editMealForm.get('calories').setValue(data.calories);
        this.editMealForm.get('protein').setValue(data.protein);
        this.editMealForm.get('carbohydrates').setValue(data.carbohydrates);
        this.editMealForm.get('fats').setValue(data.fats);

        if (this.price > 0) {
          this.mealPaid = true;
        }
        this.isResponseHere = true;
      }
    );
  }

  submitMeal() {
    if (this.editMealForm.valid) {
      const {
        dietId,
        name,
        description,
        price,
        type,
        calories,
        protein,
        carbohydrates,
        fats
      } = this.editMealForm.value;

      if (
        dietId === this.meal.diet.id && 
        name === this.meal.name &&
        description === this.meal.description && 
        price === this.meal.price &&
        type === this.meal.type && 
        calories === this.meal.calories && 
        protein === this.meal.protein && 
        carbohydrates === this.meal.carbohydrates && 
        fats === this.meal.fats &&
        !this.uploadedPicture
      ) {
        this.toastr.info('Nic nie zostało zmienione! ');

      } else {
        const mealId = this.meal.id;
        const formData = new FormData();
        
        formData.append('id', mealId.toString());
        formData.append('dietId', this.editMealForm.get('dietId')?.value.toString());
        formData.append('name', this.editMealForm.get('name')?.value);
        formData.append('description', this.editMealForm.get('description')?.value);
        formData.append('price', this.editMealForm.get('price')?.value.toString());
        formData.append('type', this.editMealForm.get('type')?.value);
        formData.append('calories', this.editMealForm.get('calories')?.value.toString());
        formData.append('protein', this.editMealForm.get('protein')?.value.toString());
        formData.append('carbohydrates', this.editMealForm.get('carbohydrates')?.value.toString());
        formData.append('fats', this.editMealForm.get('fats')?.value.toString());

        if (this.uploadedPicture) {
          formData.append('picture', this.picture);
        } else {
          formData.append('picture', new Blob());
        }

        this.mealService.updateMeal(formData).subscribe(() => {
          this.toastr.success('Zaktualizowano posiłek');
          this.router.navigate([`meals/details/${mealId}`]);
        });
      }
    } else {
      this.toastr.error('Formularz nie został poprawnie wypełniony');
    }
  }

  handleMealPaid() {
    this.mealPaid = !this.mealPaid;
    if (!this.mealPaid && this.price > 0) {
      this.price = 0;
      this.editMealForm.get('price').setValue(0);
    }
  }
}
