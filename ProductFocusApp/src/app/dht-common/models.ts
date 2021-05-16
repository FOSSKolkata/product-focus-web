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