import { SafeResourceUrl } from "@angular/platform-browser";

export interface IBusinessRequirementInput {
    id: number | null,
    productId: number,
    title: string,
    receivedOn: Date | null,
    tagIds: Array<number>
    sourceEnum: BusinessRequirementSourceEnum | null,
    sourceAdditionalInformation: string,
    description: string
  }
  
  export enum BusinessRequirementSourceEnum {
    Email = 1,
    Meeting = 2,
  }
  
  export interface IBusinessRequirement {
    id: number,
    productId: number,
    receivedOn: Date,
    tags: IBusinessRequirementTag[]
    title: string
  }
  
  export interface IBusinessRequirements {
    recordCount: number,
    businessRequirements: IBusinessRequirement[]
  }
  
  export interface IBusinessRequirementTag {
    id: number,
    businessRequirementId: number,
    name: string
  }
  
  export interface IBusinessRequirementDetails {
    id: number | null,
    title: string,
    receivedOn: Date | null,
    sourceEnum: BusinessRequirementSourceEnum | null,
    sourceInformation: string,
    description: string,
    tags: IBusinessRequirementTag[]
  }

  export interface IBusinessRequirementAttachment {
    id: number,
    uri: string,
    contentType: string,
    contents: string,
    name: string,
    fileName: string,
    lastModified: Date,
    url: SafeResourceUrl
  }