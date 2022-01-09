import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BusinessRequirementSourceEnum, IBusinessRequirementInput, IProduct, ITag } from 'src/app/dht-common/models';
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

  businessRequirementId : null | number = null;
  title = "";
  selectedDate!: Date;
  description = "";
  tags: ITag[] = [];
  selectedTags: ITag[] = [];
  sources: {name: string, position: number}[] = [];
  selectedSource!: {name: string, position: number};
  selectedSourceEnum!: BusinessRequirementSourceEnum;
  additionalInformation = "";
  doesBusinessRequirementAdding = false;

  fileArr: any[] = [];
  imgArr: any[] = [];
  files!: FileList;
  fileObj: any[] = [];
  selectedProduct!: IProduct;
  msg: string = '';
  progress: number = 0;
  form: FormGroup;
  businessRequirementForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private tagService: TagService,
    private router: Router,
    private busReqService: BusinessRequirementService,
    private tostr: ToastrService,
    private route: ActivatedRoute) {
      this.businessRequirementId = this.route.snapshot.params.businessRequirementId;
      
      this.form = this.fb.group({
        avatar: [null]
      });

      this.businessRequirementForm = new FormGroup({
        title: new FormControl('', Validators.required),
        // receivedOn: new FormControl(''), // Need to implement using form
        // tags: new FormControl(''),
        // sources: new FormControl(''),
        additionalInformation: new FormControl(''),
        description: new FormControl('')
      });

    }
  
  public get businesstitle() {
    return this.businessRequirementForm.value['title'];
  }

  public get businessreceivedon() {
    return this.businessRequirementForm.value['receivedOn'];
  }

  
  ngOnInit(): void {
    let selectedProductString = localStorage.getItem('selectedProduct');
    if(selectedProductString === null) {
      this.router.navigate(['/']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);
    this.tagService.getTagListByProductId(this.selectedProduct.id).subscribe(x => {
      this.tags = x; 
      if(this.businessRequirementId) {
        this.busReqService.getBusinessRequirementDetails(this.businessRequirementId).subscribe(x => {
          this.businessRequirementId = x.id;
          this.title = x.title;
          this.selectedDate = x.receivedOn;
          this.description = x.description;
          this.selectedSourceEnum = x.sourceEnum;
          this.additionalInformation = x.sourceInformation;
          this.selectedTags = x.tags;
          for(let source in BusinessRequirementSourceEnum){
            if(isNaN(Number(source))) {
              this.selectedSource = {name: source, position: Number(BusinessRequirementSourceEnum[source])};
            }
          }
        });
      }
    });

    for(let source in BusinessRequirementSourceEnum){
      if(isNaN(Number(source))) {
        this.sources.push({name: source, position: Number(BusinessRequirementSourceEnum[source])});
      }
    }
  }

  dateChange(event: Date){
    this.selectedDate = event;
  }

  sourceChange(event: any) {
    this.selectedSourceEnum = event.item?.position;
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

  test(event: any){
    console.log(event);
  }

  addBusinessRequirement() {
    let tagIds: number[] = [];
    for(let tag of this.selectedTags) {
      tagIds.push(tag.id);
    }
    let input: IBusinessRequirementInput = {
      id: this.businessRequirementId,
      productId: this.selectedProduct.id,
      title: this.businessRequirementForm.value['title'],
      receivedOn: this.selectedDate,
      tagIds: tagIds,
      sourceEnum: this.selectedSourceEnum,
      sourceAdditionalInformation: this.businessRequirementForm.value['additionalInformation'],
      description: this.businessRequirementForm.value['description']
    }
    
    this.doesBusinessRequirementAdding = true;
    this.busReqService.addBusinessRequirement(input).subscribe(x => {
      this.doesBusinessRequirementAdding = false;
      this.businessRequirementId = x as number;
    },err => {
      this.tostr.error(err.error,'Failed to save');
      this.doesBusinessRequirementAdding = false;
    })
  }

  public get businessRequirementSourceEnum(): typeof BusinessRequirementSourceEnum {
    return BusinessRequirementSourceEnum;
  }
}
