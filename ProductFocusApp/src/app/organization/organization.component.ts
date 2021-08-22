import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
// import { BreadcrumbService } from 'angular-crumbs';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit {
  active: boolean = false;
  organization!: any;

  constructor(private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
    ) {}

  ngOnInit(): void {
    this.organization = JSON.parse(localStorage.selectedOrganization);
    this.breadcrumbService.set('organization', {
      label: this.organization.name,
      routeInterceptor: (routeLink, breadcrumb) =>
        '/organizations/' + this.organization.name
    });
  }
}
