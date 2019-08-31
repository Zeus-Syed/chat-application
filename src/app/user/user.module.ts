import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import {FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ng6-toastr-notifications';

@NgModule({
  declarations: [ LoginComponent, SignupComponent],
  imports: [
    CommonModule,
       FormsModule,
       BrowserAnimationsModule,
       ToastrModule.forRoot(),
       RouterModule.forChild([
        {path:"sign-up",component:SignupComponent}
       ])
      ]
    })
export class UserModule { }
