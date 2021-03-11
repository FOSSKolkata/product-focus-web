import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { ModuleService } from '../_services/module._service';
import { ProductModule } from './model';

@Component({
  selector: 'app-product-modules',
  templateUrl: './product-modules.component.html',
  styleUrls: ['./product-modules.component.css']
})

export class ProductModulesComponent implements OnInit, OnDestroy {

  modules: ProductModule[] = [];
  closeResult = '';
  moduleServiceSubscriptions: SubSink = new SubSink();

  constructor(private moduleService: ModuleService) { }

  ngOnInit(): void {
    this.moduleServiceSubscriptions.add(
        this.moduleService.getModules().subscribe(x => {
        console.log(x);
        this.modules = x;
      })
    );
  }

  ngOnDestroy(): void{
    this.moduleServiceSubscriptions.unsubscribe();
  }

}