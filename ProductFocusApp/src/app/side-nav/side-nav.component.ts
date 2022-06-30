import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute) {}
  isSideNavExpanded = true;
  productId: number | undefined;
  organizationName: string | undefined;
  ngOnInit(): void {
      this.productId = this.route.snapshot.children[0].params['id']; // taking 0th index since the route has only one child route
      this.organizationName = this.route.snapshot.params['organizationName'];
    if(this.isSideNavExpanded) {
      this.invert();
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
