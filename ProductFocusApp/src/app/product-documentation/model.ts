export class ProductDocumentation
{
    id: number;
    childDocumentations: ProductDocumentation[];
    title: string;
    parentId: number | null
    constructor(id: number,
        childDocumentations: ProductDocumentation[],
        title: string,
        parentId: number | null)
    {
        this.id = id;
        this.childDocumentations = childDocumentations;
        this.title = title;
        this.parentId = parentId;
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

export class TopParentDetails {
    public details: ProductDocumentation;
    public index: number;

  
    constructor(details: ProductDocumentation, index: number) {
      this.details = details;
      this.index = index;
    }
}