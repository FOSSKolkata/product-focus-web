import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAddTagCategory } from '../models';
import { TagCategoriesService } from '../_services/tag-categories.service';
import { IProduct } from 'src/app/dht-common/models';

@Component({
  selector: 'app-add-tag-category',
  templateUrl: './add-tag-category.component.html',
  styleUrls: ['./add-tag-category.component.scss']
})
export class AddTagCategoryComponent implements OnInit {
  tagCategoryName = "";
  selectedProduct!: IProduct;
  constructor(private tagCategoryService: TagCategoriesService,
    private router: Router,
    private tostr: ToastrService) { }
  
  ngOnInit(): void {
    let selectedProductString = localStorage.getItem('selectedProduct');
    if(selectedProductString === null) {
      this.router.navigate(['/']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);
  }

  addTagCategory(tagCategory: IAddTagCategory) {
    this.tagCategoryService.addTagCategories(this.selectedProduct.id,tagCategory).subscribe(x => {
      this.tostr.success('Tag added', 'Success');
    }, err => {
      this.tostr.error(err.error, 'Not added');
    })
  }

}