import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit {
  organizationName!: string;
  memberActive = true;

  constructor(private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute) {
      this.organizationName = this.route.snapshot.params['organizationName'];
    }

  ngOnInit(): void {
    this.breadcrumbService.set(this.organizationName, {
      label: this.organizationName,
      routeInterceptor: (routeLink, breadcrumb) =>
        `/organizations/ + ${this.organizationName}`
    });
  }
}
