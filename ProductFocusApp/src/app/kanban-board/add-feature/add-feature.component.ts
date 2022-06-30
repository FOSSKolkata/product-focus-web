import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModuleService } from 'src/app/_services/module.service';
import { ProductService } from 'src/app/_services/product.service';
import { IFeatureInput, ISprint } from '../../dht-common/models';

@Component({
  selector: 'app-add-feature',
  templateUrl: './add-feature.component.html',
  styleUrls: ['./add-feature.component.scss'],
})
export class AddFeatureComponent implements OnInit {
  @Input('module-id') moduleId!: number;
  @Input('selected-sprint') selectedSprint: ISprint | null = null;
  @Output('is-feature-added') isFeatureAdded = new EventEmitter();
  
  // Clicking outside the AddFeature component, reset all texts and component
  @ViewChild('addFeatureRef') addFeatureRef!: ElementRef;
  @HostListener('document:click',['$event'])
  click(event: any): any {
    if(!this.addFeatureRef.nativeElement.contains(event.target)) {
      this.title = '';
      this.addFeatureOrBugStep = 1;
    }
  }
  

  addFeatureOrBugStep: Number = 1;
  workItemType: string = '';
  title!: string;
  addingFeature = false;
  selectedProduct!: {id: number, name: string};
  constructor(private moduleService: ModuleService,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private productService: ProductService) {}
  async ngOnInit(): Promise<void> {
    let productId = this.route.snapshot.params['id'];
    this.selectedProduct = await this.productService.getById(productId).toPromise();
  }
  addType(workItemType: string) {
    this.workItemType = workItemType;
  }
  isFocusMode: boolean = false;
  addFeature() {
    var featureInput: IFeatureInput = {
      title: this.title,
      workItemType: this.workItemType,
      sprintId: this.selectedSprint?.id
    };
    this.addingFeature = true;
    this.moduleService
      .addFeatureInModule(this.selectedProduct.id, featureInput)
      .subscribe(
        (x) => {
          //emit event
          this.title = '';
          this.addingFeature = false;
          this.isFeatureAdded.emit('true');
          this.addFeatureOrBugStep = 1;
          this.toastr.success("Feature added.","Success");
        },
        (err) => {
          this.addingFeature = false;
          this.toastr.error("Feature not added","Failed");
        }
      );
  }
}