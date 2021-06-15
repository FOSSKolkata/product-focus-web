import { Component, Input, OnInit } from '@angular/core';
import { IProductModule } from '../../dht-common/models';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css'],
})
export class ModuleComponent implements OnInit {
  featureAddView: boolean = false;
  featureName: string = '';
  @Input() module: IProductModule = {
    name: '',
    // features: []
  };
  constructor() {}

  ngOnInit(): void {}
  addFeature() {}
}
