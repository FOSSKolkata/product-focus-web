import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITag } from 'src/app/dht-common/models';

@Injectable({
  providedIn: 'root'
})
export class TagManagementService {

  tags: ITag[] = [];
  tagSubject = new BehaviorSubject(this.tags);

  constructor() { }

  updateTags(tags: ITag[]) {
    this.tagSubject.next(this.tags = tags);
  }

}
