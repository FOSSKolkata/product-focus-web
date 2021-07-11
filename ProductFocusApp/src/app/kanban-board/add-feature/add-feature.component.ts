import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModuleService } from 'src/app/_services/module.service';
import { IFeatureInput, ISprint } from '../../dht-common/models';

@Component({
  selector: 'app-add-feature',
  templateUrl: './add-feature.component.html',
  styleUrls: ['./add-feature.component.scss'],
})
export class AddFeatureComponent implements OnInit, OnChanges {
  @Input('module-id') moduleId!: number;
  @Input('selected-sprint') selectedSprint: ISprint = {
    id: -1,
    name: '',
    startDate: new Date(),
    endDate: new Date()
  }
  @Output('is-feature-added') isFeatureAdded = new EventEmitter();
  constructor(private moduleService: ModuleService,
              private toastr: ToastrService) {}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("sel sp",this.selectedSprint);
  }

  ngOnInit(): void {}

  addFeatureOrBugStep: Number = 0;
  workItemType: string = '';
  title!: string;
  addingFeature = false;
  addType(workItemType: string) {
    this.workItemType = workItemType;
  }
  isFocusMode: boolean = false;
  addFeature() {
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
