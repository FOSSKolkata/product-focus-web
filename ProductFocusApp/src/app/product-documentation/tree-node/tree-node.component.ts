import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderingInfo, ProductDocumentation, TreeContainer } from '../model';
import { ProductDocumentationService } from '../_services/product-documentation.service';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent implements OnInit, OnChanges {
  @Input('node') node!: ProductDocumentation;
  @Output('topParent') topParent = new EventEmitter<TreeContainer>();
  @Output('onAddClick') onAddClick = new EventEmitter<TreeContainer>();
  @Output('reordered') reordered = new EventEmitter<boolean>();
  @Output('delete') delete = new EventEmitter<ProductDocumentation>();

  flatDocumentation: ProductDocumentation[][] = [];
  
  constructor(private documenentationService: ProductDocumentationService,
    private toastr: ToastrService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateFlatDocumentation();
  }

  ngOnInit(): void {
  }

  getTopParentDocumentation(productDocumentation: ProductDocumentation, parentDocumentation: ProductDocumentation) {
    let index = 1;
    for(let child of this.node.childDocumentations) {
      if(this.getTopParentDocumentationHelper(child, productDocumentation.id)) {
        this.topParent.emit(new TreeContainer(child, parentDocumentation, productDocumentation, index));
        break;
      }
      index++;
    }
  }

  private generateFlatDocumentation() {
    let queue: ProductDocumentation[] = [];
    queue.push(this.node);
    while(queue.length !== 0) {
      const top : ProductDocumentation | undefined = queue.shift();
      if(top?.childDocumentations && top?.childDocumentations.length !== 0) {
        this.flatDocumentation.push(top?.childDocumentations);
      }
      for(let curr of top?.childDocumentations??[]) {
        queue.push(curr);
      }
    }

  }

  deleteDocumentation(document: ProductDocumentation) {
    this.documenentationService.deleteProductDocumentation(document.id).subscribe(x => {
      this.toastr.success('Documentation deleted.','Success');
      this.delete.emit(document);
    }, err => {
      this.toastr.error(err.error,'Failed');
    });
  }

  moveDocumentation(document: ProductDocumentation, direction: string) {
    let sameLevelIndex = document.index.substring(0,document.index.lastIndexOf('.'));
    let queue: ProductDocumentation[] = [];
    let sameLevelProductDocumentation: ProductDocumentation[] = []
    let parentId: number | null = -1;
    queue.push(this.node);
    while(queue.length !== 0) {
      const top : ProductDocumentation | undefined = queue.shift();
      if(top?.index) {
        let currIndex = top.index.substring(0, top.index.lastIndexOf('.'));
        if(sameLevelIndex === currIndex) {
          parentId = top.parentId;
          sameLevelProductDocumentation.push(top);
        }
      }
      for(let doc of top?.childDocumentations??[]) {
        queue.push(doc);
      }
    }
    for(let i=0;i<sameLevelProductDocumentation.length;i++) {
      if(sameLevelProductDocumentation[i] === document) {
        if(direction.toLowerCase() === 'up') {
          let temp = sameLevelProductDocumentation[i-1];
          sameLevelProductDocumentation[i-1] = sameLevelProductDocumentation[i];
          sameLevelProductDocumentation[i] = temp;
        } else {
          let temp = sameLevelProductDocumentation[i+1];
          sameLevelProductDocumentation[i+1] = sameLevelProductDocumentation[i];
          sameLevelProductDocumentation[i] = temp;
        }
        break;
      }
    }
    
    let orderNumber = 1;
    let orderingInfos: OrderingInfo[] = sameLevelProductDocumentation.map(item => {
      return {id: item.id, orderNumber: orderNumber++};
    });
    this.documenentationService.updateProductDocumentationOrdering(orderingInfos).subscribe(x => {
      this.reordered.emit(true);
    }, err => {
      this.toastr.error(err.error, 'Failed');
    });
  }

  isTopLevel(documentation: ProductDocumentation): boolean {
    let index = documentation.index.substring(documentation.index.lastIndexOf('.') + 1);
    return +index === 1;
  }

  isBottomLevel(documentation: ProductDocumentation): boolean {
    let index = documentation.index.substring(documentation.index.lastIndexOf('.') + 1);
    for(let documents of this.flatDocumentation) {
      for(let i=0;i<documents.length;i++) {
        if(documents[i] === documentation) {
          return +index === documents.length;
        }
      }
    }
    throw new Error(`Not found ${documentation}`);
  }

  sendAddDocumentationId(productDocumentation: ProductDocumentation, parentDocumentation: ProductDocumentation) {
    let index = 1;
    for(let child of this.node.childDocumentations) {
      if(this.getTopParentDocumentationHelper(child, productDocumentation.id)) {
        this.onAddClick.emit(new TreeContainer(child, parentDocumentation, productDocumentation, index));
        break;
      }
      index++;
    }
  }

  private getTopParentDocumentationHelper(current: ProductDocumentation, id: number): boolean {
    if(current.id === id)
      return true;
    for(let child of current.childDocumentations) {
      if(this.getTopParentDocumentationHelper(child, id)) {
        return true;
      }
    }
    return false;
  }
}
