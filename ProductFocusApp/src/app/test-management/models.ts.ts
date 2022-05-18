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

export class TestPlan {
    id: number;
    title: string;
    sprintTitle: string | null;
    suiteCount: number;
    testType: TestTypeEnum;
    constructor(id: number, title: string, sprintTitle: string | null, suiteCount: number, testType: TestTypeEnum) {
        this.id = id;
        this.title = title;
        this.sprintTitle = sprintTitle;
        this.suiteCount = suiteCount;
        this.testType = testType;
    }
}

export class TestStep {
    testCaseId: number;
    testStepId: number;
    stepNo: number;
    action: string;
    expectedResult: string;
    constructor(testCaseId: number, testStepId: number, stepNo: number, action: string, expectedResult: string) {
        this.testCaseId = testCaseId;
        this.testStepId = testStepId;
        this.stepNo = stepNo;
        this.action = action;
        this.expectedResult = expectedResult;
    }
}
export class TestCase {
    testSuiteId: number;
    testCaseId: number;
    testCaseTitle: string;
    preconditions: string;
    testSteps: TestStep[];
    constructor(testSuiteId: number, testCaseId: number, testCaseTitle: string, preconditions: string, testSteps: TestStep[]) {
        this.testSuiteId = testSuiteId;
        this.testCaseId = testCaseId;
        this.testCaseTitle = testCaseTitle;
        this.preconditions = preconditions;
        this.testSteps = testSteps;
    }
}
export class TestSuite {
    testSuiteId: number;
    testPlanId: number;
    testSuiteTitle: string;
    testCases: TestCase[];
    constructor(testSuiteId: number, testPlanId: number, testSuiteTitle: string, testCases: TestCase[]) {
        this.testSuiteId = testSuiteId;
        this.testPlanId = testPlanId;
        this.testSuiteTitle = testSuiteTitle;
        this.testCases = testCases;
    }
}
export class TestPlanDetails {
    testPlanId: number;
    testPlanTitle: string;
    testType: TestTypeEnum;
    testSuites: TestSuite[];
    constructor(testPlanId: number, testPlanTitle: string, testType: TestTypeEnum, testSuites: TestSuite[]) {
        this.testPlanId = testPlanId;
        this.testPlanTitle = testPlanTitle;
        this.testType = testType;
        this.testSuites = testSuites;
    }
}