import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
})
export class OrganizationComponent implements OnInit {
  active: boolean = false;
  organization!: any;

  constructor(private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.organization = JSON.parse(localStorage.selectedOrganization);
    this.breadcrumbService.changeBreadcrumb(this.route.snapshot, this.organization.name);
    console.log(this.route.snapshot);
  }
}
