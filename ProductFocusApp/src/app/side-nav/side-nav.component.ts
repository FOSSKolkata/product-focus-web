import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  constructor(private router: Router) {}

  productId: number | undefined;
  organizationName: string | undefined;
  ngOnInit(): void {
    if (localStorage.getItem('productId') === undefined || localStorage.getItem('selectedOrganization') === undefined) {
      this.router.navigate(['/organization-home']);
    }
    else {
      this.productId = Number(localStorage.getItem('productId'));
      this.organizationName = JSON.parse(localStorage.selectedOrganization).name;
    }
  }
}
