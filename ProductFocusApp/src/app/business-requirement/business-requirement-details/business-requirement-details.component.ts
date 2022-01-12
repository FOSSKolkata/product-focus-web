import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ITag } from 'src/app/tag-management/models';
import { IProduct } from 'src/app/dht-common/models';
import { BusinessRequirementSourceEnum, IBusinessRequirementDetails, IBusinessRequirementInput } from '../models';
import { BusinessRequirementService } from '../_services/business-requirement.service';
import { TagService } from 'src/app/tag-management/_services/tag.service';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
@Component({
  selector: 'app-business-requirement-details',
  templateUrl: './business-requirement-details.component.html',
  styleUrls: ['./business-requirement-details.component.scss']
})
export class BusinessRequirementDetailsComponent implements OnInit {

  tags: ITag[] = [];
  selectedTags: ITag[] = [];
  sources: {name: string, position: number}[] = [];
  selectedSource!: {name: string, position: number};
  businessRequirementDetails: IBusinessRequirementDetails = {
    id: null,
    title: '',
    description: '',
    receivedOn: null,
    sourceEnum: null,
    sourceInformation: '',
    tags: []
  };
  doesBusinessRequirementAdding = false;

  fileArr: any[] = [];
  imgArr: any[] = [];
  files!: FileList;
  fileObj: any[] = [];
  selectedProduct!: IProduct;
  msg: string = '';
  progress: number = 0;
  private form: FormGroup; // Will be removed later

  constructor(
    public fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private tagService: TagService,
    private router: Router,
    private busReqService: BusinessRequirementService,
    private tostr: ToastrService,
    private route: ActivatedRoute) {
      this.businessRequirementDetails.id = this.route.snapshot.params.businessRequirementId;
      
      this.form = this.fb.group({
        avatar: [null]
      });
    }
  
  ngOnInit(): void {
    const selectedProductString = localStorage.getItem('selectedProduct');
    if(selectedProductString === null) {
      this.router.navigate(['/']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);
    this.tagService.getTagListByProductId(this.selectedProduct.id).subscribe(x => {
      this.tags = x; 
      if(this.businessRequirementDetails.id) {
        this.busReqService.getBusinessRequirementDetails(this.businessRequirementDetails.id).subscribe(x => {
          this.selectedTags = x.tags;
          this.businessRequirementDetails = x;
          for(const source in BusinessRequirementSourceEnum){
            if(isNaN(Number(source))) {
              this.selectedSource = {name: source, position: Number(BusinessRequirementSourceEnum[source])};
            }
          }
        });
      }
    });

    for(const source in BusinessRequirementSourceEnum){
      if(isNaN(Number(source))) {
        this.sources.push({name: source, position: Number(BusinessRequirementSourceEnum[source])});
      }
    }
  }

  dateChange(event: Date){
    this.businessRequirementDetails.receivedOn = event;
  }

  sourceChange(event: any) {
    this.businessRequirementDetails.sourceEnum = event.item?.position;
  }

  removeTag(tag: ITag) {
    this.selectedTags = this.selectedTags.filter(x => x != tag);
    this.tags.push(tag);
  }

  selectTag(event: MatAutocompleteSelectedEvent) {
    this.selectedTags.push({id: event.option.value, name: event.option.viewValue});
    this.tags = this.tags.filter(x => x.id != event.option.value);
  }

  clickUpload(e: any) {
    this.upload(e.target.files);
  }
  
  upload(e: FileList) {
    const formData = new FormData();
    const fileListAsArray = Array.from(e);
    fileListAsArray.forEach((item, i) => {
      const url = URL.createObjectURL(e[i]);
      this.imgArr.push(url);
      this.fileArr.push({ item, url: url });
      formData.append(item.name,item);
    });

    this.busReqService.uploadAttachments(formData).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / (event.total ? event.total : 100));
      else if (event.type === HttpEventType.Response) {
        this.tostr.success('Files uploaded', 'Success');
      }
    });

    this.fileObj = [];
    this.fileArr.forEach((item) => {
      this.fileObj.push(item.item)
    })

    // Set files form control
    this.form.patchValue({
      avatar: this.fileObj
    })

    this.form.get('avatar')?.updateValueAndValidity();
  }
  
  remove(file: any) {
    this.imgArr = this.imgArr.filter(f => f != file.url);
    this.fileArr = this.fileArr.filter(f => f.url != file.url);
    this.fileObj = this.fileObj.filter(f => f != file.item);
  }
  
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  addOrUpdateBusinessRequirement() {
    const tagIds: number[] = [];
    for(const tag of this.selectedTags) {
      tagIds.push(tag.id);
    }
    const input: IBusinessRequirementInput = {
      id: this.businessRequirementDetails.id,
      productId: this.selectedProduct.id,
      title: this.businessRequirementDetails.title,
      receivedOn: this.businessRequirementDetails.receivedOn,
      tagIds: tagIds,
      sourceEnum: this.businessRequirementDetails.sourceEnum,
      sourceAdditionalInformation: this.businessRequirementDetails.sourceInformation,
      description: this.businessRequirementDetails.description
    }
    
    this.doesBusinessRequirementAdding = true;
    if(this.businessRequirementDetails.id) {
      this.busReqService.updateBusinessRequirementDetails(input).subscribe(x => {
        this.doesBusinessRequirementAdding = false;
      }, err => {
        this.tostr.error(err.error, 'Failed to update');
        this.doesBusinessRequirementAdding = false;
      })
    } else {
      this.busReqService.addBusinessRequirement(input).subscribe(x => {
        this.doesBusinessRequirementAdding = false;
        this.businessRequirementDetails.id = x; // Getting this businessRequirement
      },err => {
        this.tostr.error(err.error,'Failed to save');
        this.doesBusinessRequirementAdding = false;
      })
    }
  }
}
