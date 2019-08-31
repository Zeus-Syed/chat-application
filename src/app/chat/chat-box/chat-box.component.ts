import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers:[SocketService]
})
export class ChatBoxComponent implements OnInit {
  @ViewChild( 'scrollMe', { read: ElementRef, static: true })

  public scrollMe:ElementRef;
 public authToken: any;
 public userInfo:any;
 public receiverId:any;
 public receiverName:any;
 public userList:any = [];
 public disconnectedSocket: boolean;


 public messageText:any ;
 public messageList:any = [];
 public pageValue:number = 0;
 public loadingPreviousChat:boolean= false;

public scrollToChatTop:boolean = false;

  constructor(public appService: AppService,
    public socketService: SocketService,
    public router: Router,
    public toastr: ToastrManager) {
      this.receiverId = Cookie.get('receiverId');
      this.receiverName = Cookie.get('receiverName');
     }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.receiverId = Cookie.get('receiverId');
    this.receiverName = Cookie.get('receiverName');

     console.log(this.receiverId,this.receiverName);
     if(this.receiverId!=null && this.receiverId!=undefined && this.receiverId!=""){
       this.userSelectedToChat(this.receiverId,this.receiverName);
     }
     
    //this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getMessageFromUser();
  }
 /*public checkStatus: any = () =>{
     if(Cookie.get('authToken') === 'undefined'|| Cookie.get('authToken') === ""||Cookie.get('authToken')===null)
           {
             this.router.navigate(['/']);
             return false;
           }
           else{
             return true;
           }
    } */

    public verifyUserConfirmation:any = () =>{
         this.socketService.verifyUser().subscribe(
           (data) =>{
               this.disconnectedSocket = false;
               this.socketService.setUser(this.authToken);
               this.getOnlineUserList();
           }
         );
    }

    public getOnlineUserList:any = ()=>{
         this.socketService.onlineUserList().subscribe((userList)=>{
                this.userList = [];
                for(let x in userList){
                  let temp ={ 'userId':x,'name':userList[x],'chating':false,'unread':0};
                  this.userList.push(temp);
                }
                console.log(this.userList);
         });
    }
    public sendMessageUsingKeypress: any =(event:any) =>{
      if ( event.keyCode === 13){  this.sendMessage();}
    }
    public sendMessage:any = () => {
      if(this.messageText){
        let chatMsgObject = {
          senderName:this.userInfo.firstName +" "+this.userInfo.lastName,
          senderId:this.userInfo.userId,
          receiverId: Cookie.get('receiverId'), 
          receiverName: Cookie.get('receiverName'),
          message: this.messageText,
          createdOn: new Date()
        }
        console.log(chatMsgObject);
        this.socketService.sendChatMessage(chatMsgObject);
        this.pushToChatWindow(chatMsgObject);
      }
      else{

      }
    }
    public pushToChatWindow:any =(data) =>{
      this.messageText="";
      this.messageList.push(data);
      this.scrollToChatTop = false;
    }

    public getMessageFromUser:any = ()=>{
        this.socketService.chatByUserId(this.userInfo.userId).subscribe((data)=>{
            (this.receiverId==data.senderId)?this.messageList.push(data):"";
            this.toastr.successToastr(`${data.senderName} says : ${data.message}`);
            this.scrollToChatTop = false;

        });
    }
 public userSelectedToChat:any = (id,name)=>{
       this.userList.map((user)=>{
         if(user.userId==id){
           user.chating = true;
         }
         else{
           user.chating = false;
         }
       })
       Cookie.set('receiverId', id);
       Cookie.set('receiverName',name);
       this.receiverId = id;
       this.receiverName = name;
       this.messageList = [];
       this.pageValue = 0;
       let chatDetails = {
            userId: this.userInfo.userId,
            senderId: id
       }
       this.socketService.markChatAsSeen(chatDetails);
       this.getPreviousChatWithAUser();
 }   
 public getPreviousChatWithAUser:any= () =>{
        let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);

        this.socketService.getChat(this.userInfo.userId, this.receiverId,this.pageValue * 10)
        .subscribe((apiResponse) =>{
            console.log(apiResponse);
            if (apiResponse.status == 200){
              this.messageList = apiResponse.data.concat(previousData); 
            }else{
              this.messageList = previousData;
              this.toastr.warningToastr("No messages available");
            }
            this.loadingPreviousChat = false;
        }, (err) =>{
          this.toastr.errorToastr("some error occured");
        }
        );
 }
 public loadEarlierPageOfChat:any = () =>{
   this.loadingPreviousChat = true;
   this.pageValue++;
   this.scrollToChatTop = true;

   this.getPreviousChatWithAUser();
 }
 public logout: any = () =>{
    this.appService.logout()
    .subscribe((myResponse) =>{
      if(myResponse.status === 200){
        console.log("logout called");
        Cookie.delete("receiverId");
        Cookie.delete('receiverName');
        Cookie.delete("authToken");
        this.socketService.exitSocket();
        this.router.navigate(['/']);
      }
      else{
        this.toastr.errorToastr(myResponse.message);
      }
    }, (err) =>{
      this.toastr.errorToastr("someerror Ocuured!!!");
    }
    );
 }
 public showUserName = (name:string) =>{
   this.toastr.successToastr("you are chatting with "+name);
 }

}