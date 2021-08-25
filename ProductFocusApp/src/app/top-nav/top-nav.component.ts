import { Component, Input, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent {
  isNavbarCollapsed = true;
  @Input('user')currentUserName!: string;

  constructor(private authService: MsalService) {}

  logout(): void {
    localStorage.clear();
    this.authService.logout();
  }
}