export class ProductDocumentation
{
    id: number;
    childDocumentations: ProductDocumentation[];
    title: string;
    parentId: number | null;
    index: string;
    orderNumber: number;
    constructor(id: number,
        childDocumentations: ProductDocumentation[],
        title: string,
        parentId: number | null,
        index: string,
        orderNumber: number)
    {
        this.id = id;
        this.childDocumentations = childDocumentations;
        this.title = title;
        this.parentId = parentId;
        this.index = index;
        this.orderNumber = orderNumber;
    }
}

export class ProductDocumentationDetails
{
    id: number;
    level: number;
    title: string;
    parentId: number;
    description: string;
    index: string;
    constructor(id: number, level: number, title: string, parentId: number, description: string, index: string)
    {
        this.id = id;
        this.level = level;
        this.title = title;
        this.parentId = parentId;
        this.description = description;
        this.index = index;
    }
}

export class TreeContainer {
    public topParent: ProductDocumentation;
    public parent: ProductDocumentation;
    public current: ProductDocumentation;
    public index: number;
    
    constructor(topParent: ProductDocumentation, parent: ProductDocumentation, current: ProductDocumentation, index: number) {
        this.topParent = topParent;
        this.parent = parent;
        this.current = current;
        this.index = index;
    }
}

export class AddProductDocumentation {
    public parentId: number | null;
    public productId: number;
    public title: string;
    public description: string;
    constructor(parentId: number | null, productId: number, title: string, description: string) {
        this.parentId = parentId;
        this.productId = productId;
        this.title = title;
        this.description = description;
    }
}

export enum UpdateDocumentationFieldName {
    Title = 1,
    Description = 2
}

export class OrderingInfo {
    public id: number;
    public orderNumber: number;
    constructor(id: number, orderNumber: number) {
        this.id = id;
        this.orderNumber = orderNumber;
    }
}