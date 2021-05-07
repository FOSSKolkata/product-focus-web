import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';


@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  isNavbarCollapsed=true;
  loginDisplay = false;
  currentUserName!:string;

  constructor(
    private authService: MsalService
  ) { }

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe(x => console.log(x));
    if(this.authService.instance.getAllAccounts().length > 0) {
      var userInfo:any = this.authService.instance.getAllAccounts()[0].idTokenClaims;
      this.currentUserName = userInfo.given_name.concat(" ").concat(userInfo.family_name);
    }
  }


  logout() {
    this.authService.logout();
  }
}
