import { Component, OnInit } from '@angular/core';
import { ModuleService } from '../_services/module._service';
import { ProductModule } from './modal';

@Component({
  selector: 'app-product-modules',
  templateUrl: './product-modules.component.html',
  styleUrls: ['./product-modules.component.css']
})

export class ProductModulesComponent implements OnInit {

  modules: ProductModule[] = [];

  constructor(private moduleService: ModuleService) { }

  ngOnInit(): void {
    this.moduleService.getModules().subscribe(x => {
      console.log(x);
      this.modules = x;
    });
  }

}