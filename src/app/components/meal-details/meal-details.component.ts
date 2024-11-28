import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Meal } from 'src/app/common/meal';
import { MealService } from 'src/app/service/meal.service';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-meal-details',
  standalone: true,
  imports: [],
  templateUrl: './meal-details.component.html',
  styleUrl: './meal-details.component.scss'
})
export class MealDetailsComponent {
  meal: Meal = null;

  isResponseHere = false;
  requestFromDiary = 0;

  dialogRef = inject(MatDialog);
  mealService = inject(MealService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.handleMealDetails();
    });
  }

  handleMealDetails() {
    const mealId: number = +this.route.snapshot.paramMap.get('id')!;

    if (this.route.snapshot.queryParamMap.has('diaryId') && +this.route.snapshot.queryParamMap.get('diaryId') > 0) {
      this.requestFromDiary = +this.route.snapshot.queryParamMap.get('diaryId');
    } 

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
        this.isResponseHere = true;
      }
    );
  }

  redirectToDiary() {
    this.router.navigate([`meals/diary/${this.requestFromDiary}`]);
  }

  openDialog(image: string) {
    this.dialogRef.open(PopUpComponent, { data : image });
  }
}
