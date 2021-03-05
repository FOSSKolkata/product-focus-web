import { Component, Input, OnInit } from '@angular/core';
import { ProductModule } from '../modal';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {

  @Input() module: ProductModule = {
    title: '',
    features: []
  };

  constructor() { console.log('module component ts'); }

  ngOnInit(): void {
    
  }

}