import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, authGuardLogin } from './service/auth.guard.service';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomPaginator } from './service/custom-paginator';
import { CustomSidenavComponent } from "./components/custom-sidenav/custom-sidenav.component";
import { HospitalsComponent } from './components/hospitals/hospitals.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchOverlayComponent } from './components/search-overlay/search-overlay.component';
import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { DietComponent } from './components/diet/diet.component';
import { DietDetailsComponent } from './components/diet-details/diet-details.component';
import { DiaryComponent } from './components/diary/diary.component';
import { MealDetailsComponent } from './components/meal-details/meal-details.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DiaryDetailsComponent } from './components/diary-details/diary-details.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HospitalDetailsComponent } from './components/hospital-details/hospital-details.component';
import { WardDetailsComponent } from './components/ward-details/ward-details.component';
import { DieticianDetailsComponent } from './components/dietician-details/dietician-details.component';
import { NewPatientComponent } from './components/new-patient/new-patient.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';


const routes: Routes = [
  {path: 'wards', component: HospitalDetailsComponent, canActivate: [authGuard]},
  {path: 'wards/search/:keyword', component: HospitalDetailsComponent, canActivate: [authGuard]},
  {path: 'hospitals/ward/:id', component: WardDetailsComponent, canActivate: [authGuard]},
  {path: 'patients/:id', component: PatientDetailsComponent, canActivate: [authGuard]},
  {path: 'hospitals/search/:keyword', component: HospitalsComponent, canActivate: [authGuard]},
  {path: 'registerPatient', component: NewPatientComponent, canActivate: [authGuard]},
  {path: 'dieticians/details/:id', component: DieticianDetailsComponent, canActivate: [authGuard]},
  {path: 'meals/details/:id', component: MealDetailsComponent, canActivate: [authGuard]},
  {path: 'meals/diets', component: DietComponent, canActivate: [authGuard]},
  {path: 'meals/diets/search/:keyword', component: DietComponent, canActivate: [authGuard]},
  {path: 'meals/diets/:id', component: DietDetailsComponent, canActivate: [authGuard]},
  {path: 'meals/diary', component: DiaryComponent, canActivate: [authGuard]},
  {path: 'meals/diary/:id', component: DiaryDetailsComponent, canActivate: [authGuard]},
  {path: 'login', component: LoginComponent, canActivate: [authGuardLogin]},
  {path: 'logout', component: LoginComponent, canActivate: [authGuardLogin]},
  {path: '', redirectTo: '/wards', pathMatch: 'full'},
  {path: '**', redirectTo: '/wards', pathMatch: 'full'},
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes),
    SweetAlert2Module.forRoot(),
    CustomSidenavComponent,
    SearchBarComponent,
    SearchOverlayComponent,
    OverlayModule,
    FullCalendarModule
],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic'}
    },
    {
      provide: MatPaginatorIntl,
      useValue: CustomPaginator()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
