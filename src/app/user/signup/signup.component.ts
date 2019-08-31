import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public newFirstname:any;
  public newLastname:any;
  public newEmail:any;
  public newPassword:any;
  public newMobileNo:any;
  public newApiKey:any;

  constructor(public appService:AppService,public toastr:ToastrManager,public router:Router ) { }

  
public goToSignin:any = () =>{
 this.router.navigate(['/']);
}
public signUp:any=()=>{

if(!this.newFirstname){
  this.toastr.warningToastr("Enter firstname Properly!!!!");
}
else if(!this.newLastname){
  this.toastr.warningToastr("Enter firstname Properly!!!!");
}
else if(!this.newEmail){
  this.toastr.warningToastr("Enter email Properly!!!!");
}
else if(!this.newPassword){
  this.toastr.warningToastr("Enter Password Properly!!!!");
}
else if(!this.newMobileNo){
  this.toastr.warningToastr("Enter MobileNo Properly!!!!");
}
else if(!this.newApiKey){
  this.toastr.warningToastr("Enter ApiKey Properly!!!!");
}
else{
  let data ={
    firstName:this.newFirstname,
    lastName:this.newLastname,
    email:this.newEmail,
    password:this.newPassword,
    mobile:this.newMobileNo,
    apiKey:this.newApiKey
  }
  this.appService.signupFunction(data).subscribe((apiResponse)=>{
    console.log(apiResponse);
     if (apiResponse.status === 200){
       
       this.toastr.successToastr("sign-UP Successs!!!");

       setTimeout(()=>{
         this.goToSignin();
       },2000);
     }
     else{
       this.toastr.errorToastr(apiResponse.message);
     }
  },
  (err)=>{
    this.toastr.errorToastr("some error occured!!");
  }

  );
}

}


  ngOnInit() {
  }

}
