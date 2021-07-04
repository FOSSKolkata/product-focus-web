import { Component, Input, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  isNavbarCollapsed = true;
  @Input('user')currentUserName!: string;

  constructor(private authService: MsalService) {}

  ngOnInit(): void {
    
  }

  logout() {
    localStorage.clear();
    this.authService.logout();
  }
}
