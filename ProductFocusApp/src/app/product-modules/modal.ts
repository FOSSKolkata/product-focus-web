export interface ProductModule{
  title: string;
  features: Feature[]
}

export interface Feature {
    title: string;
    startDate: string;
    endDate: string;
    noOfComments: Number;
    noOfTaskCompleted: Number;
    noOfTask: Number;
}