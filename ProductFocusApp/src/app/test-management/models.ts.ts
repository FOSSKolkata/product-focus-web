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
    testStepId: number | null;
    step: number;
    action: string;
    expectedResult: string;
    constructor(testCaseId: number, testStepId: number | null, step: number, action: string, expectedResult: string) {
        this.testCaseId = testCaseId;
        this.testStepId = testStepId;
        this.step = step;
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

export class UpdateTestCaseInput {
    title: string;
    preconditions: string;
    testSteps: UpdateTestStepInput[];
    constructor(title: string, preconditions: string, testSteps: UpdateTestStepInput[]) {
        this.title = title;
        this.preconditions = preconditions;
        this.testSteps = testSteps;
    }
}
export class TestSuiteInput {
    testPlanId: number;
    title: string;
    constructor(testPlanId: number, title: string) {
        this.testPlanId = testPlanId;
        this.title = title;
    }
}

export class UpdateTestStepInput {
    id: number | null;
    action: string;
    expectedResult: string;
    constructor(id: number, action: string, expectedResult: string) {
        this.id = id;
        this.action = action;
        this.expectedResult = expectedResult;
    }
}
export class TestStepInput {
    step: number;
    action: string;
    expectedResult: string;
    constructor(step: number, action: string, expectedResult: string) {
        this.step = step;
        this.action = action;
        this.expectedResult = expectedResult;
    }
}
export class TestCaseInput {
    title: string;
    preconditions: string;
    testPlanId: number | null;
    testSuiteId: number | null;
    testSteps: TestStepInput[];
    constructor(title: string, preconditions: string, testPlanId: number | null, testSuiteId: number | null, testSteps: TestStepInput[]){
        this.title = title;
        this.preconditions = preconditions;
        this.testPlanId = testPlanId;
        this.testSuiteId = testSuiteId;
        this.testSteps = testSteps;
    }
    removeTestStep(testStep: TestStepInput): void {
        this.testSteps = this.testSteps.filter(step => step != testStep);
        this.testSteps.map((testStep, index) => {
            testStep.step = index + 1;
        });
    }
    addTestStep(action: string, expectedResult: string): void {
        this.testSteps.push({step: this.testSteps.length + 1, action, expectedResult});
    }
}

export interface ITestSuiteOrder {
    id: number;
}

// Test Plan run related model
export interface ITestRun {
    id: number,
    title: string,
    testTypeEnum: TestTypeEnum,
    testSuites: ITestRunSuite[]
}

export interface ITestRunSuite {
    id: number,
    testPlanId: number,
    title: string,
    testCases: ITestRunCase[]
}

export interface ITestRunCase {
    id: number,
    testSuiteId: number,
    title: string,
    isIncluded: boolean,
    resultStatus: TestCaseResultEnum
}

export interface ITestRunStep {
    id: number,
    testCaseId : number,
    stepNo: number,
    action: string,
    expectedResult: string,
    resultStatus: TestStepResultEnum
}

export enum TestStepResultEnum {
    Success = 1,
    Failed = 2,
    Pending = 3
}

export enum TestCaseResultEnum {
    Success = 1,
    Failed = 2,
    Pending = 3
}

// End of Test Plan run related model