import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IBusinessRequirementInput, IProduct, ITag } from 'src/app/dht-common/models';
import { BusinessRequirementService } from 'src/app/_services/business-requirement.service';
import { TagService } from 'src/app/_services/tag.service';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
@Component({
  selector: 'app-business-requirement-details',
  templateUrl: './business-requirement-details.component.html',
  styleUrls: ['./business-requirement-details.component.scss']
})
export class BusinessRequirementDetailsComponent implements OnInit {

  title = "";
  selectedDate!: Date;
  description = "";
  tags: ITag[] = [];
  selectedTags: ITag[] = [];
  sources: {name: string}[] = [{name: 'Email'}, {name: 'Meeting'}];
  selectedSource: {name: string}  = {name: ''};
  additionalInformation = "";

  fileArr: any[] = [];
  imgArr: any[] = [];
  files!: FileList;
  fileObj: any[] = [];
  selectedProduct!: IProduct;
  msg: string = '';
  progress: number = 0;
  form: FormGroup;
  constructor(
    public fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private tagService: TagService,
    private route: Router,
    private busReqService: BusinessRequirementService) {
      this.form = this.fb.group({
        avatar: [null]
      });
    }

  additionalInformationChange(event: string) {
    this.additionalInformation = event;
  }

  titleChange(event: string){
    this.title = event;
  }
  dateChange(event: Date){
    this.selectedDate = event;
  }
  sourceChange(event: any) {
    this.selectedSource = event;
  }

  ngOnInit(): void {
    let selectedProductString = localStorage.getItem('selectedProduct');
    if(selectedProductString === null) {
      this.route.navigate(['/']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);
    this.tagService.getTagListByProductId(this.selectedProduct.id).subscribe(x => {
      this.tags = x;
    })
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
    const fileListAsArray = Array.from(e);
    fileListAsArray.forEach((item, i) => {
      const url = URL.createObjectURL(e[i]);
      this.imgArr.push(url);
      this.fileArr.push({ item, url: url });
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

  addBusinessRequirement() {
    let tagIds: number[] = [];
    for(let tag of this.selectedTags) {
      tagIds.push(tag.id);
    }
    let input: IBusinessRequirementInput = {
      productId: this.selectedProduct.id,
      title: this.title,
      date: this.selectedDate,
      tagIds: tagIds,
      source: this.selectedSource.name,
      sourceAdditionalInformation: this.additionalInformation,
      description: this.description
    }
    console.log(input);
    this.busReqService.addBusinessRequirement(input).subscribe(x => {
      console.log(x);
    },err => {
      console.log(err);
    })
  }
}
