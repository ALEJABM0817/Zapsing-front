export interface Document {
  id?: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  base64_pdf: string;
  signers: Signer[];
  companyid: number | null;
  status?: string;
}

export interface Signer {
  name: string;
  email: string;
  id?: number;
}