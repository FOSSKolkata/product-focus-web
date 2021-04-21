export interface ProductModule{
  name: string;
  // features: Feature[]
}

export interface Feature {
    title: string;
    startDate: string;
    endDate: string;
    noOfComments: Number;
    noOfTaskCompleted: Number;
    noOfTask: Number;
}