import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { StylingService } from '../side-nav/styling.service';
import { ProductService } from '../_services/product.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-product-modules',
  templateUrl: './product-modules.component.html',
  styleUrls: ['./product-modules.component.css']
})

export class ProductModulesComponent implements OnInit, OnDestroy {

  modules: any = [];
  closeResult = '';
  moduleServiceSubscriptions: SubSink = new SubSink();
  moduleAddView: boolean = false;
  moduleName: string | undefined;
  productId: Number | undefined;

  constructor(
              private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              public styling: StylingService) { }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params.id;
    console.log(this.productId);
    this.setModules();
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
  
  newlist = [
    {
      id: '#2021',
      title: 'PNR medication needs to transfer to a new tab.',
      startDate: '13 Jan',
      endDate: '15 Jan',
      noOfChat: 4,
      completedTask: 3,
      totalTask: 4
    },{
      id: '#3223',
      title: 'PNR medication needs to transfer to a new tab.',
      startDate: '14 Feb',
      endDate: '29 Mar',
      noOfTask: 7,
      completedTask: 4,
      totalTask: 4
    }
  ];
  inProgress = [
    {
      id: '#20232',
      title: 'Title in progress 1',
      startDate: '23 April',
      endDate: '15 Jan',
      noOfChat: 4,
      completedTask: 3,
      totalTask: 4
    },{
      id: '#32323',
      title: 'Title in progress 2',
      startDate: '14 Feb',
      endDate: '29 Mar',
      noOfTask: 7,
      completedTask: 4,
      totalTask: 4
    },{
      id: '#3323',
      title: 'Title in progress 3',
      startDate: '14 Feb',
      endDate: '29 Mar',
      noOfTask: 7,
      completedTask: 4,
      totalTask: 4
    }
  ];
  completed = [
    {
      id: '#20232',
      title: 'Title in completed 1',
      startDate: '23 April',
      endDate: '15 Jan',
      noOfChat: 4,
      completedTask: 3,
      totalTask: 4
    },{
      id: '#32323',
      title: 'Title in completed 2',
      startDate: '14 Feb',
      endDate: '29 Mar',
      noOfTask: 7,
      completedTask: 4,
      totalTask: 4
    }
  ];

  drop(event: any) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}