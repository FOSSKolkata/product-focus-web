export interface ProductModule{
  name: string;
  // features: Feature[]
}

export interface Feature {
    id: number,
    moduleId: number,
    title: string
}

export interface AddOrganizationInput {
  organizationName: string;
  email: string;
}

export interface AddProductInOrganizationInput {
  name: string
}

export interface RegisterUserInput {
  name: string,
  email: string
}

export interface FeatureInput {
  title: string,
  workItemType: string
}

export interface SprintInput {
  name: string,
  startDate: Date,
  endDate: Date
}

export interface ModifyFeatureInput {
  id: number,
  title: string,
  description: string,
  workCompletionPercentage: number,
  status: number,
  sprint: {
    createdOn: Date,
    createdBy: string,
    lastModifiedOn: Date,
    lastModifiedBy: string,
    name: string,
    startDate: Date,
    endDate: Date
  },
  storyPoint: number,
  isBlocked: boolean,
  fieldName: number
}

export interface FeatureDetails {
  description: string,
  id: number,
  isBlocked: boolean,
  status: number,
  storyPoint: number,
  title: string,
  workCompletionPercentage: number
}

/*export interface Status {
  new : number,
  inProgress : number,
  onHold : number,
  completed: number
}

export interface WorkItemType {
  feature : number,
  bug : number
}*/
