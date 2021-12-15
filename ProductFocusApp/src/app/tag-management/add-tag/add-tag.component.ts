import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ITagCategory } from 'src/app/dht-common/models';
import { TagCategoriesService } from 'src/app/_services/tag-categories.service';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
  control = new FormControl();
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue', 'Mockup data'];
  filteredStreets!: Observable<string[]>;
  tagCategories: ITagCategory[] = [];
  selectedCategory!: ITagCategory;
  
  constructor(private tagCategoryService: TagCategoriesService) { }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  ngOnInit(): void {
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

}
