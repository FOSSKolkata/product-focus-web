import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IScrumDay, IUpsertScrumCommentInput, IUpsertScrumWorkCompletionPercentageInput } from 'src/app/dht-common/models';
import { FeatureService } from 'src/app/_services/feature.service';

@Component({
  selector: 'app-progress-comment',
  templateUrl: './progress-comment.component.html',
  styleUrls: ['./progress-comment.component.scss']
})
export class ProgressCommentComponent implements OnInit {
  @Input('feature-id') featureId: number | null = null;
  @Input('date') date: Date | null = null;
  @Input('scrum-day') scrumDay: IScrumDay | null = null;
  constructor(private featureService: FeatureService,
    private toastr: ToastrService) {}

  restrictGreaterThan100(prevalue: any, currkey: any){
    if(currkey < 48 || currkey > 57)
      return false;
    const currentValue = prevalue.innerText * 10 + (currkey - 48);
    return currentValue <= 100;
  }

  ngOnInit(): void {}
  upsertScrumWorkCompletionPercentage(event: any){
    if(this.featureId === null || this.date === null)
      return;
    let input: IUpsertScrumWorkCompletionPercentageInput = {
      featureId: this.featureId,
      workCompletionPercentage: +event.target.textContent,
      scrumDate: new Date(Date.UTC(this.date.getFullYear(),this.date.getMonth(),this.date.getDate(),0,0,0))
    };
    this.featureService.upsertScrumWorkCompletionPercentage(input).subscribe(res => {
      
    },(err)=>{
      this.toastr.error(err.error,'Failed');
    });
  }
  upsertScrumComment(event: any){
    if(this.featureId === null || this.date === null)
      return;
    let input: IUpsertScrumCommentInput = {
      featureId: this.featureId,
      scrumComment: event.target.textContent,
      scrumDate: new Date(Date.UTC(this.date.getFullYear(),this.date.getMonth(),this.date.getDate(),0,0,0))
    };
    this.featureService.upsertScrumComment(input).subscribe(res => {
      
    },(err)=>{
      this.toastr.error(err.error,'Failed');
    });
  }
}