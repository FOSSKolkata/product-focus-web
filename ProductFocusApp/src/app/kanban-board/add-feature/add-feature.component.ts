import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModuleService } from 'src/app/_services/module.service';
import { IFeatureInput, ISprint } from '../../dht-common/models';

@Component({
  selector: 'app-add-feature',
  templateUrl: './add-feature.component.html',
  styleUrls: ['./add-feature.component.scss'],
})
export class AddFeatureComponent {
  @Input('module-id') moduleId!: number;
  @Input('selected-sprint') selectedSprint: ISprint | null = null;
  @Output('is-feature-added') isFeatureAdded = new EventEmitter();
  @ViewChild('addFeatureRef') addFeatureRef!: ElementRef;
  @HostListener('document:click',['$event'])
  click(event: any): any {
    if(!this.addFeatureRef.nativeElement.contains(event.target)) {
      this.title = '';
      this.addFeatureOrBugStep = 0;
    }
  }
  constructor(private moduleService: ModuleService,
              private toastr: ToastrService) {}

  addFeatureOrBugStep: Number = 0;
  workItemType: string = '';
  title!: string;
  addingFeature = false;
  addType(workItemType: string) {
    this.workItemType = workItemType;
  }
  isFocusMode: boolean = false;
  addFeature() {
    if(this.selectedSprint === null)
      return;
    var featureInput: IFeatureInput = {
      title: this.title,
      workItemType: this.workItemType,
      sprintId: this.selectedSprint.id
    };
    this.addingFeature = true;
    this.moduleService
      .addFeatureInModule(this.moduleId, featureInput)
      .subscribe(
        (x) => {
          //emit event
          this.title = '';
          this.addingFeature = false;
          this.isFeatureAdded.emit('true');
          this.addFeatureOrBugStep = 0;
          this.toastr.success("Feature added.","Success");
        },
        (err) => {
          this.addingFeature = false;
          this.toastr.error("Feature not added","Failed");
        }
      );
  }
}