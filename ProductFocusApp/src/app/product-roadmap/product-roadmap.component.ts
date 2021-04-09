import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-roadmap',
  templateUrl: './product-roadmap.component.html',
  styleUrls: ['./product-roadmap.component.css']
})
export class ProductRoadmapComponent implements OnInit {

  line:Number = 60;
  constructor() { }

  ngOnInit(): void {
  }

  onMoving(event:Object){
    console.log(event)
  }
}
