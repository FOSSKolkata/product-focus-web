import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}
  isSideNavExpanded = false;
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
  invert() {
    this.isSideNavExpanded = !this.isSideNavExpanded;
    let currentSideWidth = getComputedStyle(document.body).getPropertyValue('--side-nav-width');
    let expandedSideWidth = getComputedStyle(document.body).getPropertyValue('--side-nav-expanded-width');
    let shrinkSideWidth = getComputedStyle(document.body).getPropertyValue('--side-nav-shrink-width');
    if(currentSideWidth === expandedSideWidth) {
      document.documentElement.style.setProperty('--side-nav-width', shrinkSideWidth);
    } else {
      document.documentElement.style.setProperty('--side-nav-width', expandedSideWidth);
    }
  }
  
  ngOnDestroy(): void {
    if(this.isSideNavExpanded) {
      this.invert();
    }
  }

}
