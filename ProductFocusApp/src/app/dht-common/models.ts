export interface ProductModule{
  name: string;
  // features: Feature[]
}

export interface Feature {
    id: number;
    moduleId: number;
    title: string;
    status: number;
    isBlocked: boolean;
    workItemType: number;
    plannedStartDate: Date;
    plannedEndDate: Date;
    actualStartDate: Date;
    actualEndDate: Date;
}

export interface AddOrganizationInput {
  organizationName: string;
  email: string;
}

export interface AddProductInOrganizationInput {
  name: string;
}

export interface RegisterUserInput {
  name: string;
  email: string;
}

export interface FeatureInput {
  title: string;
  workItemType: string;
}

export interface SprintInput {
  productId: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateFeatureInput {
  id: number;
  title: string;
  description: string;
  workCompletionPercentage: number;
  status: number;
  sprintName: string;
  storyPoint: number;
  isBlocked: boolean;
  emailOfAssignee: string;
  acceptanceCriteria: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate: Date;
  actualEndDate: Date;
  fieldName: number;
}

export interface FeatureDetails {
  description: string;
  id: number;
  isBlocked: boolean;
  status: number;
  storyPoint: number;
  title: string;
  assignees: Assignee[];
  members: Member[];
  workCompletionPercentage: number;
  acceptanceCriteria: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate: Date;
  actualEndDate: Date;
}

/*export interface Status {
  new : number;
  inProgress : number;
  onHold : number;
  completed: number
}

export interface WorkItemType {
  feature : number;
  bug : number
}*/

export interface Assignee {
  id: number,
  objectId: string,
  email: string,
  name: string
}

export interface Sprint {
  id: number,
  name: string,
  startDate: Date,
  endDate: Date
}

export interface Member {
  name: string;
  email: string;
  objectId: string;
}