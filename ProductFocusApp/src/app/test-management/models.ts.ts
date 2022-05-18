import { WorkItemType } from "../dht-common/models";

export class AddTestPlanInput {
    productId: number;
    sprintId: number;
    testType: TestTypeEnum;
    productDocumentationId: number | null;
    workItemId: number | null;
    title: string;
    constructor(productId: number, sprintId: number, testType: TestTypeEnum, productDocumentationId: number | null, workItemId: number | null, title: string) {
        this.productId = productId;
        this.sprintId = sprintId;
        this.testType = testType;
        this.productDocumentationId = productDocumentationId;
        this.workItemId = workItemId;
        this.title = title;
    }
}

export enum TestTypeEnum {
    RegressionTest = 1,
    WorkItemBased = 2
}