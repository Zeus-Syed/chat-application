import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, RouterModule } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public newEmail:any;
  public newPassword:any;
  constructor(public appService:AppService, public toastr:ToastrManager, public router:Router) { }

  ngOnInit() {
  }
  public goToSignup:any=()=> {
    this.router.navigate(['/sign-up']);
   }
 public login:any =()=>{
   
  if(!this.newEmail){
    this.toastr.warningToastr("Enter email Properly!!!!");
  }
  else if(!this.newPassword){
    this.toastr.warningToastr("Enter Password Properly!!!!");
  }

else{
  let data = {
    email:this.newEmail,
    password:this.newPassword
  }

this.appService.signinFunction(data).subscribe((apiResponse) =>{

        console.log(apiResponse);
        if(apiResponse.status === 200){

           Cookie.set('authToken',apiResponse.data.authToken);
           Cookie.set('receiverName',apiResponse.data.userDetails.firstName+' '+apiResponse.data.userDetails.lastName);
           Cookie.set('receiverId',apiResponse.data.userDetails.userId);
           this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
          this.toastr.successToastr("Login Successful!!!");

          setTimeout(()=>{
          this.router.navigate(['/chat'])
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

}
