export interface IProductModule {
  name: string,
}

export interface IFeature {
  id: number,
  moduleId: number,
  title: string,
  status: number,
  isBlocked: boolean,
  workItemType: number,
  plannedStartDate: Date,
  plannedEndDate: Date,
  actualStartDate: Date,
  actualEndDate: Date,
  assignees: IFeatureAssignee[],
  storyPoint: number,
  workCompletionPercentage: number
}

export enum ModifyColumnIdentifier {
  title = 1,
  description = 2,
  workCompletionPercentage = 3,
  status = 4,
  sprint = 5,
  storyPoint = 6,
  isBlocked = 7,
  includeAssignee = 8,
  excludeAssignee = 9,
  acceptanceCriteria = 10,
  plannedStartDate = 11,
  plannedEndDate = 12,
  actualStartDate = 13,
  actualEndDate = 14,
}

export interface IAddOrganizationInput {
  organizationName: string
}

export interface IAddProductInOrganizationInput {
  name: string,
}

export interface IRegisterUserInput {
  name: string,
  email: string,
}

export interface IFeatureInput {
  title: string,
  workItemType: string,
  sprintId: number
}

export interface ISprintInput {
  productId: number,
  name: string,
  startDate: Date,
  endDate: Date,
}

export interface IFeatureDetails {
  id: number,
  title: string,
  description: string,
  workCompletionPercentage: number,
  status: number,
  storyPoint: number,
  isBlocked: boolean,
  acceptanceCriteria: string,
  plannedStartDate: Date,
  plannedEndDate: Date,
  actualStartDate: Date,
  actualEndDate: Date,
  members: IMember[],
  assignees: IAssignee[],
  sprint: ISprint,
  scrumDays: IScrumDay[]
}

export interface IFeatureAssignee{
  id: number,
  objectId: string,
  email: string,
  name: string,
  userId: number
}

export interface IAssignee {
  id: number,
  objectId: string,
  email: string,
  name: string,
}

export interface ISprint {
  id: number,
  name: string,
  startDate: Date,
  endDate: Date,
}

export interface IMember {
  name: string,
  email: string,
  objectId: string,
}

export interface ISendInvitationInput {
  orgId: number,
  email: string,
}

export interface IOrganization {
  id: number,
  name: string,
}

export interface IProduct {
  id: number,
  name: string,
}

export interface IModule {
  id: number,
  name: string,
}

export interface IKanbanBoard {
  id: number,
  name: string,
  featureDetails: IFeatureDetails[],

}

export interface IScrumDay {
  featureId: number,
  date: Date,
  workCompletionPercentage: number,
  comment: string
}

export enum InvitationStatus {
  New = 1,
  Cancelled = 2,
  Rejected = 3,
  Accepted = 4,
  Resent = 5,
}

export enum FeatureStatus {
  new = 0,
  inProgress = 1,
  hold = 2,
  completed = 3,
}

export interface IPendingInvitation {
  email: string,
  id: number,
  invitedOn: Date,
  lastResentOn: Date,
  status: InvitationStatus
}

export interface IGetPendingInvitation {
  recordCount: number,
  pendingInvitations: IPendingInvitation[]
}

export interface IClosedInvitation {
  email: string,
  id: number,
  invitedOn: Date,
  actionedOn: Date,
  organizationId: number,
  status: InvitationStatus
}

export interface IGetClosedInvitation {
  recordCount: number,
  closedInvitations: IClosedInvitation[]
}

export interface IInvitationInput {
  invitationId: number,
  orgId: number,
  email: string
}

export interface IUser {
  id: number,
  name: string,
  email: string
}

export interface IMemberDetail {
  id: number,
  email: string,
  name: string,
  isOwner: boolean
}

export interface IMemberDetailsList {
  recordCount: number,
  members: IMemberDetail[]
}

export interface IUpsertScrumCommentInput{
  featureId: number,
  scrumComment: string,
  scrumDate: Date
}

export interface IUpsertScrumWorkCompletionPercentageInput{
  featureId: number,
  workCompletionPercentage: number,
  scrumDate: Date
}