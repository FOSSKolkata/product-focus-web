import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { UserService } from '../_services/user.service';

@Injectable({
  providedIn: 'root'
})
export class SecureGuard implements CanActivate {
  constructor(private userService: UserService,private authService: MsalService){}
  async canActivate():Promise<boolean>{
    var response = false;
    await this.userService.doesUserExistInApplicationDb().then(x=> response = x);
    if(response)
      return true;
    alert("Server is busy. Please try after sometime.");
    this.authService.logout();
    return false;
  }
  
}
