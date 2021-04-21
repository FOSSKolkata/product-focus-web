import { Component, Input, OnInit } from '@angular/core';
import { ProductModule } from '../model';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {

  featureAddView: boolean = false;
  featureName: string = '';
  @Input() module: ProductModule = {
    name: '',
    // features: []
  };
  constructor() { }

  ngOnInit(): void {
    
  }
  addFeature(){

  }

}