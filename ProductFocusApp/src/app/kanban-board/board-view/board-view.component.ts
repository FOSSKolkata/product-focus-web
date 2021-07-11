import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FeatureStatus, IKanbanBoard, ISprint, ModifyColumnIdentifier } from 'src/app/dht-common/models';
import { FeatureService } from 'src/app/_services/feature.service';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.scss']
})
export class BoardViewComponent implements OnInit, OnChanges {

  @Output('changed') changed = new EventEmitter<boolean>();
  kanbanBoardSpinner: boolean = false;
  @Input('kanban-board')kanbanBoard: IKanbanBoard[] = [];
  board: any = [];
  @Input('selected-sprint') selectedSprint: ISprint = {
    id: -1,
    name: '',
    startDate: new Date(),
    endDate: new Date()
  }
  selectedUserIds = [];
  
  productId!: number;
  constructor(private featureService: FeatureService) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('selected sp: ',this.selectedSprint.id);
    this.board = [];
    for (var module of this.kanbanBoard) {
      this.board.push([]);
      this.board[this.board.length - 1].name = module.name;
      this.board[this.board.length - 1].id = module.id;
      for (var feature of module.featureDetails) {
        if (this.board[this.board.length - 1].length == 0) {
          for (var i = 0; i < 4; i++) {
            this.board[this.board.length - 1].push([]);
          }
        }
        this.board[this.board.length - 1][feature.status].push(feature);
      }
    }
  }

  ngOnInit(): void {

  }
  drop(event: CdkDragDrop<any[]>, status: FeatureStatus) {
    console.log(event, status);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // Iterate on every features where featureElement is dropped
    for (var feature of event.container.data) {
      if (feature.status != status) {
        // Since the status of element where it is dropped is not equal to the status of that column
        feature.status = status;
        this.featureService
          .modifyFeatureElement({
            id: feature.id,
            status: status,
            fieldName: ModifyColumnIdentifier.status,
          })
          .subscribe((x) => {
            console.log(x);
          });
      }
    }
  }

  fireChanges(){
    this.changed.emit(true);
  }
  
  public get featureStatus(): typeof FeatureStatus {
    return FeatureStatus;
  }

}
