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

  constructor(
    private authService: MsalService
  ) { }

  ngOnInit(): void {
    this.setLoginDisplay();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  logout() {
    this.authService.logout();
  }
}
