import { Component, OnInit } from '@angular/core';
import { StylingService } from '../side-nav/styling.service';

@Component({
  selector: 'app-product-roadmap',
  templateUrl: './product-roadmap.component.html',
  styleUrls: ['./product-roadmap.component.scss'],
})
export class ProductRoadmapComponent implements OnInit {
  line: Number = 60;
  constructor(public styling: StylingService) {}

  ngOnInit(): void {}

  onMoving(event: Object) {
    console.log(event);
  }
}
