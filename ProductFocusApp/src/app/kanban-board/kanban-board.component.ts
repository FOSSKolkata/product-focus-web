import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { StylingService } from '../side-nav/styling.service';
import { ProductService } from '../_services/product.service';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-kanban-board-component',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})

export class KanbanBoardComponent implements OnInit, OnDestroy {
  
  modules: any = [];
  closeResult = '';
  moduleServiceSubscriptions: SubSink = new SubSink();
  moduleAddView: boolean = false;
  moduleName: string | undefined;
  productId: Number | undefined;
  constructor(
              private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              public styling: StylingService,
              private modalService: NgbModal) { }

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
      title: 'PNR medication needs to transfer to a new tab.PNR medication needs to transfer to a new tab.PNR medication needs to transfer to a new tab.PNR medication needs to transfer to a new tab.',
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
      noOfChat: 7,
      completedTask: 4,
      totalTask: 4
    }
  ];
  inProgress = [
    {
      id: '#20232',
      title: 'Title in progress 1',
      startDate: '23 Apr',
      endDate: '15 Apr',
      noOfChat: 4,
      completedTask: 3,
      totalTask: 4
    },{
      id: '#32323',
      title: 'Title in progress 2',
      startDate: '14 Feb',
      endDate: '29 Mar',
      noOfChat: 7,
      completedTask: 4,
      totalTask: 4
    },{
      id: '#3323',
      title: 'Title in progress 3',
      startDate: '14 Feb',
      endDate: '29 Mar',
      noOfChat: 7,
      completedTask: 4,
      totalTask: 4
    }
  ];
  completed = [
    {
      id: '#20232',
      title: 'Title in completed 1',
      startDate: '23 Apr',
      endDate: '1 May',
      noOfChat: 4,
      completedTask: 3,
      totalTask: 4
    },{
      id: '#32323',
      title: 'Title in completed 2',
      startDate: '14 Feb',
      endDate: '29 Mar',
      noOfChat: 7,
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

  openSmallPopup(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'manage-module'}).result.then((result) => {
      
    });
  }

  openLargePopup(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'manage-module', size: 'lg'}).result.then((result) => {
      
    });
  }

  addFeatureOrBugStep: Number = 0;
  cardType:string = '';
  addType(cardType: string) {
    this.cardType = cardType;
  }
  isFocusMode: boolean = false;
  
  
}