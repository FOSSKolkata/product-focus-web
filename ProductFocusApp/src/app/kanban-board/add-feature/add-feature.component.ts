import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ModuleService } from 'src/app/_services/module.service';
import { IFeatureInput } from '../../dht-common/models';

@Component({
  selector: 'app-add-feature',
  templateUrl: './add-feature.component.html',
  styleUrls: ['./add-feature.component.css'],
})
export class AddFeatureComponent implements OnInit {
  @Input('module-id') moduleId!: number;
  @Output('is-feature-added') isFeatureAdded = new EventEmitter();
  constructor(private moduleService: ModuleService) {}

  ngOnInit(): void {}

  addFeatureOrBugStep: Number = 0;
  workItemType: string = '';
  title!: string;
  addType(workItemType: string) {
    this.workItemType = workItemType;
  }
  isFocusMode: boolean = false;
  addFeature() {
    var featureInput: IFeatureInput = {
      title: this.title,
      workItemType: this.workItemType,
    };
    this.moduleService
      .addFeatureInModule(this.moduleId, featureInput)
      .subscribe(
        (x) => {
          //emit event
          this.isFeatureAdded.emit('true');
          this.addFeatureOrBugStep = 0;
        },
        (err) => console.log('err', err)
      );
  }
}
