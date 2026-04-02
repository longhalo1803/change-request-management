export enum TaskRole {
  DEVELOPER = "developer",
  QA = "qa",
  PM = "pm",
}

export interface CrQuotationItem {
  id: string;
  quotationId: string;
  description: string;
  hours: number;
  rate: number;
  cost: number;
  role: TaskRole;
}

export interface CrQuotation {
  id: string;
  changeRequestId: string;
  totalHours: number;
  totalCost: number;
  currency: string;
  notes?: string;
  createdById: string;
  createdBy?: any;
  items?: CrQuotationItem[];
  createdAt: string;
  updatedAt: string;
}
