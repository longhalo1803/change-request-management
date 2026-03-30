export interface CrAttachment {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  changeRequestId: string;
  uploadedById: string;
  uploadedBy?: any;
  createdAt: string;
}
