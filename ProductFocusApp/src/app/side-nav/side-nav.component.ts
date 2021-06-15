import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StylingService } from './styling.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
  constructor(private styling: StylingService, private router: Router) {}

  productId: Number | undefined;
  ngOnInit(): void {
    if (localStorage.getItem('productId') == null)
      this.router.navigate(['/organization-home']);
    else this.productId = Number(localStorage.getItem('productId')) || -1;
  }

  onHover() {
    this.styling.newStyle({ 'margin-left': '310px', transition: '0.5s' });
  }

  onOut() {
    this.styling.newStyle({ 'margin-left': '70px', transition: '0.5s' });
  }
}
