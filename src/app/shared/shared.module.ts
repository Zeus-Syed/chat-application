import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details/user-details.component';
import { FirstCharComponent } from './first-char/first-char.component';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [UserDetailsComponent, FirstCharComponent],
  exports: [
      UserDetailsComponent,
      FirstCharComponent,
      FormsModule,
      CommonModule
     
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
