import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';
import { UserService } from '../_services/user.service';

@Injectable({
  providedIn: 'root'
})
export class SecureGuard implements CanActivate {
  constructor(private userService: UserService,private authService: MsalService){}
  async canActivate(
    // route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    ):Promise<boolean>{
    var response = false;
    await this.userService.doesUserExistInApplicationDb().then(x=> response = x);
    console.log(response);
    if(response)
      return true;
    alert("Server is busy. Please try after sometime later.");
    this.authService.logout();
    return false;
  }
  
}
