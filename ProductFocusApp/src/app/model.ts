import { ICurrentProgressWorkItemDetails, WorkItemType } from "./dht-common/models";

export interface IWorkItem {
    id: number,
    title: string,
    description: string,
    workItemType: WorkItemType,
    isInProgress: boolean,
    workCompletionPercentage: number
    currentProgressWorkItem: ICurrentProgressWorkItemDetails
}