export interface Quotation {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  project?: any;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  validUntil?: string;
  quotedBy: string;
  quoter?: any;
  createdAt: string;
  updatedAt: string;
}
