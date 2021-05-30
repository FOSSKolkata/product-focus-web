import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { StylingService } from '../side-nav/styling.service';
import { ProductService } from '../_services/product.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeatureService } from '../_services/feature.service';
import { ModifyColumnIdentifier } from './feature-details/feature-details.component';
import { HighlightSpanKind } from 'typescript';

enum FeatureStatus {
  new = 0,
  inProgress = 1,
  hold = 2,
  completed = 3
};

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
  board:any = [];
  enabledAdding: boolean = true;

  constructor(
              private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              public styling: StylingService,
              private modalService: NgbModal,
              calendar: NgbCalendar,
              private featureService: FeatureService) {
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
    this.board = []
    this.productService.getKanbanViewByProductId(this.productId).subscribe((x)=>{
      this.kanbanBoardSpinner = false;
      this.kanbanBoard = x;
      for(var module of this.kanbanBoard){
        this.board.push([])
        this.board[this.board.length-1].name = module.name;
        this.board[this.board.length-1].id = module.id;
        for(var feature of module.featureDetails){
          if(this.board[this.board.length-1].length == 0) {
            for(var i=0;i<4;i++){
              this.board[this.board.length-1].push([]);
            }
          }
          this.board[this.board.length-1][feature.status].push(feature);
        }
      }
      console.log("hello",x);
      console.log(this.board);
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
    this.enabledAdding = false;
    this.productService.addModule(this.productId,this.moduleName).subscribe(x => {
      this.moduleName = '';
      this.moduleAddView = false;
      this.enabledAdding = true;
      this.setModules();
      this.setKanbanBoard();
    },err => {
      this.enabledAdding = true;
      alert(err);
    });
  }

  drop(event: CdkDragDrop<any[]>, status: FeatureStatus) {
    console.log(event,status);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    // Iterate on every features where featureElement is dropped
    for(var feature of event.container.data){
      if(feature.status != status){ // Since the status of element where it is dropped is not equal to the status of that column
        feature.status = status;
        this.featureService.modifyFeatureElement({id: feature.id, status : status, fieldName: ModifyColumnIdentifier.status}).subscribe(x =>{
          console.log(x);
        })
      }
    }
  }

  openPopup(content: any, size: string = 'md') {
    this.modalService.open(content, {ariaLabelledBy: 'generic modal', size: size}).result.then((result) => {
      
    },(reason)=>{

    });
  }

  isFocusMode: boolean = false;
  onDateSelection(date: NgbDate) {
    // console.log(date);
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

  addSprint(){
    if(this.toDate == null || this.fromDate == null) {
      alert("Please select proper date");
      return;
    }else if(this.sprintName == undefined || this.sprintName.trim.length == 0) {
      alert("Sprint name cannot be empty");
      return;
    }
    console.log(this.sprintName, this.fromDate, this.toDate);
  }

  public get featureStatus(): typeof FeatureStatus {
    return FeatureStatus;
  }
}