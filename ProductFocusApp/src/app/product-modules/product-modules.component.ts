import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { StylingService } from '../side-nav/styling.service';
// import { ModuleService } from '../_services/module._service';
import { ProductService } from '../_services/product.service';
// import { ProductModule } from './model';

@Component({
  selector: 'app-product-modules',
  templateUrl: './product-modules.component.html',
  styleUrls: ['./product-modules.component.css']
})

export class ProductModulesComponent implements OnInit, OnDestroy {

  // modules: ProductModule[] = [];
  modules: any = [];
  closeResult = '';
  moduleServiceSubscriptions: SubSink = new SubSink();
  moduleAddView: boolean = false;
  moduleName: string | undefined;
  productId: Number | undefined;

  constructor(
              // private moduleService: ModuleService,
              private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              public styling: StylingService) { }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params.id;
    this.setModules();
    // Dummy api call
    // this.moduleServiceSubscriptions.add(
    //     this.moduleService.getModules().subscribe(x => {
    //     console.log(x);
    //     this.modules = x;
    //   })
    // );
  }

  setModules(){
    if(this.productId == undefined)
      return;
    this.productService.getModulesByProductId(this.productId).subscribe(x=>{
      this.modules = x;
    })
  }

  ngOnDestroy(): void{
    this.moduleServiceSubscriptions.unsubscribe();
  }

  addModule(){
    if(this.productId == undefined || this.moduleName == undefined)
      return;
    this.productService.addModule(this.productId,this.moduleName).subscribe(x => {
      this.moduleName = '';
      this.moduleAddView = false;
      this.setModules();
    },err => console.log(err));
  }

}