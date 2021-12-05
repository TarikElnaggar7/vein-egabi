import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import {
  HttpClient,
  HttpHeaders,
  HttpClientModule,
  HttpResponse,
  HttpParams,
  HttpRequest
} from "@angular/common/http";
import { JsonDataRequest } from "../../../shared/models/JsonDataRequest.model";
import { UtilityManager } from 'src/app/shared/utilities/UtilityManager';
import { MetaData } from 'src/app/shared/models/MetaData.model';
import { ComponentsIDs, Devices, FormsIDs, URLs } from 'src/app/shared/utilities/Constants';
import { FormLoadResponse } from 'src/app/shared/models/FormLoadResponse.model';
import { LoginResponse } from './login-response.model';
import { SessionManager } from 'src/app/shared/utilities/SessionManager';
import { UtilityService } from 'src/app/shared/services/UtilityService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  

  buttonDisabled = false;
  buttonState = '';

  usrName: string;
  pass: string;

  usrno: string;  
  loginModel: FormLoadResponse;
  loginResponse: LoginResponse;
  loginsubmitflag: boolean = true;
  errormsg: string;
  language: boolean = true;
  conversionEncryptOutput: string;
  conversionDecryptOutput: string;
  privateKey: string = "7061737323313233";
  encryptedPassword: string;
  ipAddr: any;
  showErrorMsg: boolean;
  
  constructor(private authService: AuthService,
     private notifications: NotificationsService,
      private router: Router,
      private http: HttpClient,
      private utilService: UtilityService
      ) { }

  ngOnInit() {
    SessionManager.clearToken();
    SessionManager.clearUserNo();
    SessionManager.clearRoleId();

  this.utilService.getClientIpAddr().subscribe((res: any) => {
      this.ipAddr = res;
      const lCode = SessionManager.getLanguage();
      let httpParams: any;

      httpParams = {
        langCode: lCode, pageId: FormsIDs.Login, componentId: ComponentsIDs.Login,
        ipAddress: this.ipAddr
      };
      // this.spinner.show();
      this.utilService.getService(URLs.pageLoad, httpParams)
        .subscribe(res => {
          this.loginModel = res.body;
          SessionManager.setToken(this.loginModel.token);
          // this.spinner.hide();
        },
          err => {
            console.log(err);
          }
        );
    });  
  }

  getClientIpAddr() {
    return this.http.get("http://10.3.1.102:8181/bedayte/testController/getClientIPAddress/", { responseType: 'text' }); //private ip
  }

  // onSubmit() {
  //   if (!this.loginForm.valid || this.buttonDisabled) {
  //     return;
  //   }
  //   this.buttonDisabled = true;
  //   this.buttonState = 'show-spinner';

  //   this.authService.signIn(this.loginForm.value).subscribe((user) => {
  //     console.log(user)

  //     this.router.navigate(['/']);
  //   }, (error) => {
  //     this.buttonDisabled = false;
  //     this.buttonState = '';
  //     this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
  //   });
  // }

  login(): void {
    this.encryptedPassword = UtilityManager.encryptAES(this.pass);
    this.showErrorMsg = false;
    const metaData = <MetaData>{
      pageId: FormsIDs.Login,
      userName: this.usrName,
      ipAddress: this.ipAddr,
      langCode: this.toggleLanguage(),
      userPassword: this.encryptedPassword,
      deviceType: Devices.PC
    };

    const jsonDataRequest = <JsonDataRequest>{
      metadata: metaData,
    };
    
    this.utilService.postService(URLs.login, jsonDataRequest)
      .subscribe(res => {
        this.loginResponse = res;
        if(this.loginResponse.status !== 1){
          this.showErrorMsg = true;
          this.errormsg = 'err';
        }

        if (this.loginResponse.status === 1) {
          this.loginsubmitflag = true;
          SessionManager.setUserNo(String(this.loginResponse.usrNo));
          SessionManager.setUserName(this.usrName);
          SessionManager.setUserRoles(this.loginResponse.roles);
          SessionManager.setToken(this.loginResponse.token);
         window.location.href = environment.roleLogin;

        } else {
          this.showErrorMsg = true;
          console.log('error:', this.loginResponse.messages[0].messageDescr);
          this.errormsg = this.loginResponse.messages[0].messageDescr;

        }
       
      },
        err => {
          console.log(err);
      
        }
      );
  }


  toggleLanguage() {
    if (this.language === true) {
      SessionManager.setLanguage('AR');
      return 'AR';
    } else {
      SessionManager.setLanguage('EN');
      return 'EN';
    }
  }
}
