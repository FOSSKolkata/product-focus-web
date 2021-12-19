import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAddTag, IProduct, ITagCategory } from 'src/app/dht-common/models';
import { TagCategoriesService } from 'src/app/_services/tag-categories.service';
import { TagService } from 'src/app/_services/tag.service';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
  tagCategories: ITagCategory[] = [];
  selectedCategoryId: number | null = null;
  selectedProduct!: IProduct;
  tagName = "";
  
  constructor(private tagCategoryService: TagCategoriesService,
    private tagService: TagService,
    private route: Router,
    private tostr: ToastrService) { }

  ngOnInit(): void {
    let selectedProductString = localStorage.getItem('selectedProduct');
    if(selectedProductString === null) {
      this.route.navigate(['/']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);

    this.tagCategoryService.getTagCategories(this.selectedProduct.id).subscribe(x => {
      this.tagCategories = x;
    }, err => {
      this.tostr.error(err.error, 'Not added');
    })
  }

  addTag(tag: {name: string}) {
    let addTagInput: IAddTag = {
      name: tag.name,
      tagCategoryId: this.selectedCategoryId
    };
    this.tagService.addTag(this.selectedProduct.id, addTagInput).subscribe(x => {
      this.tostr.success('Tag added', 'Success');
    },err =>
      this.tostr.error(err.error,'Not added')
    );
  }

}
