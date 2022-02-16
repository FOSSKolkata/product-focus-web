import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ProductDocumentationSharedService {
  private doesAddDocumentationActive = false;
  private addDocumentationParentId: number | null = null;
  private documentAdded = false;

  productDocumentationBehaviourSubject = new BehaviorSubject(this.doesAddDocumentationActive);
  productDocumentationParentBehaviourSubject = new BehaviorSubject(this.addDocumentationParentId);
  productDocumentationAddedBehaviourSubject = new BehaviorSubject(this.documentAdded);

  constructor() { }

  changeMode(addMode: boolean) {
    this.productDocumentationBehaviourSubject.next(addMode);
  }

  changeProductDocumentationParentId(parentId: number | null) {
    this.productDocumentationParentBehaviourSubject.next(parentId);
  }

  productDocumentationAdded(documentAdded: boolean) {
    this.productDocumentationAddedBehaviourSubject.next(documentAdded);
  }
}
