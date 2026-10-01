// package-details.dto.ts

export interface PackageImageDto {
  image: string;
  title?: string;
  sortOrder?: number;
}

export interface PackageIncludedDto {
  title: string;
  description?: string;
  image?: string;
  sortOrder?: number;
}

export interface PackageExcludedDto {
  title: string;
  description?: string;
  image?: string;
  sortOrder?: number;
}

export interface PackageHowItWorksDto {
  step: number;
  title: string;
  description: string;
  image?: string;
}

export interface PackageBenefitDto {
  title: string;
  description: string;
  image?: string;
  sortOrder?: number;
}

export interface PackageFaqDto {
  question: string;
  answer: string;
  sortOrder?: number;
}

export interface CreatePackageDetailsDto {
  description?: string;
  whyChooseUs?: string;

  images?: PackageImageDto[];

  included?: PackageIncludedDto[];

  excluded?: PackageExcludedDto[];

  howItWorks?: PackageHowItWorksDto[];

  benefits?: PackageBenefitDto[];

  faqs?: PackageFaqDto[];
}