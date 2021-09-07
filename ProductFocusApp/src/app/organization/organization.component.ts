import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit {
  organization!: any;
  memberActive = true;

  constructor(private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.organization = JSON.parse(localStorage.selectedOrganization);
    this.breadcrumbService.set('organization', {
      label: this.organization.name,
      routeInterceptor: (routeLink, breadcrumb) =>
        '/organizations/' + this.organization.name
    });
  }
}
