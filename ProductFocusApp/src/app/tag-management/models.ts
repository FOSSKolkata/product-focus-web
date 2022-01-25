export interface ITagCategory {
    id: number,
    name: string
  }
  
  export interface ITag {
    id: number,
    name: string
  }
  
  export interface IAddTagCategory {
    name: string
  }
  
  export interface IAddTag {
    name: string,
    tagCategoryId: number | null
  }
  