import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { StylingService } from '../side-nav/styling.service';
import { ProductService } from '../_services/product.service';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-kanban-board-component',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})

export class KanbanBoardComponent implements OnInit, OnDestroy {
  
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  modules: any = [];
  kanbanBoard: any = [];
  closeResult = '';
  moduleServiceSubscriptions: SubSink = new SubSink();
  moduleAddView: boolean = false;
  sprintAddView: boolean = false;
  moduleName: string | undefined;
  sprintName: string | undefined;
  productId: number | undefined;
  kanbanBoardSpinner: boolean = false;
  constructor(
              private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              public styling: StylingService,
              private modalService: NgbModal,
              calendar: NgbCalendar) {
                this.fromDate = calendar.getToday();
                this.toDate = calendar.getNext(calendar.getToday(), 'd', 14);
              }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params.id;
    console.log(this.productId);
    this.setModules();
    this.setKanbanBoard();
  }

  setKanbanBoard(){
    if(this.productId === undefined)
      return;
      this.kanbanBoardSpinner = true;
    this.productService.getKanbanViewByProductId(this.productId).subscribe((x)=>{
      this.kanbanBoardSpinner = false;
      this.kanbanBoard = x;
      console.log("hello",x);
    });
  }

  setModules(){
    if(this.productId === undefined)
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
      this.setKanbanBoard();
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
      
    },(reason)=>{

    });
  }

  openLargePopup(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'manage-module', size: 'lg'}).result.then((result) => {
      
    },(reason)=>{

    });
  }

  isFocusMode: boolean = false;
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
}