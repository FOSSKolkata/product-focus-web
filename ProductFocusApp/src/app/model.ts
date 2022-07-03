import { WorkItemType } from "./dht-common/models";

export interface IWorkItem {
    id: number,
    title: string,
    description: string,
    workItemType: WorkItemType,
    isInProgress: boolean,
    workCompletionPercentage: number
    currentProgressWorkItem: ICurrentProgressWorkItemDetails
}

export interface ICurrentProgressWorkItemDetails {
    id: number,
    workItemId: number
}

export interface ISprintUpdate {
    name: string,
    startDate: Date,
    endDate: Date
}