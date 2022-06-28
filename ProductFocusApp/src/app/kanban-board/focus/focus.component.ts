import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FeatureService } from 'src/app/_services/feature.service';
import { IWorkItem } from 'src/app/model';
import { MatSliderChange } from '@angular/material/slider';
import { ModifyColumnIdentifier, WorkItemType } from 'src/app/dht-common/models';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-focus',
  templateUrl: './focus.component.html',
  styleUrls: ['./focus.component.scss']
})
export class FocusComponent implements OnInit {

  productId: number;
  workItems: IWorkItem[] = [];
  progressWorkItem !: IWorkItem;
  constructor(private route: ActivatedRoute,
    private featureService: FeatureService,
    private tostr: ToastrService) {
    this.productId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    forkJoin(
      [
        this.featureService.getMyWorkItemsInProduct(this.productId),
        this.featureService.getCurrentProgressWorkItemId(this.productId)
      ]
    ).subscribe(x => {
      this.workItems = x[0].map(item => {
        if(item.id == x[1]?.workItemId) {
          item.isInProgress = true;
          item.currentProgressWorkItem = x[1];
          this.progressWorkItem = item;
        }
        return item;
      });
    })
  }

  updateWorkPercentage(slider: MatSliderChange) {
    if(!this.progressWorkItem) {
      return;
    }
    this.featureService.modifyFeatureElement({
      id: this.progressWorkItem.id,
      fieldName: ModifyColumnIdentifier.workCompletionPercentage,
      workCompletionPercentage: slider.value
    }).subscribe(x => {

    }, err => {
      this.tostr.success(err.error, 'Failed');
    })
  }

  switchWorkingItem(event: CdkDragDrop<any, any>) {
    console.log(event.container.data[event.previousIndex]);
    let previousWorkItem: IWorkItem = JSON.parse(JSON.stringify(this.progressWorkItem)); // structuredClone is not working
    for(let workItem of this.workItems) {
      if(workItem.isInProgress) {
        workItem.isInProgress = false;
        break;
      }
    }
    this.progressWorkItem = event.container.data[event.previousIndex];
    this.progressWorkItem.isInProgress = true;
    console.log(previousWorkItem?.currentProgressWorkItem.id)
    this.featureService.markWorkItemAsCurrentlyProgress(this.productId,this.progressWorkItem.id,
      previousWorkItem?.currentProgressWorkItem.id).subscribe(x => {
        this.progressWorkItem.currentProgressWorkItem = x;
    })
  }

  get workItemType(): typeof WorkItemType {
    return WorkItemType;
  }

}
