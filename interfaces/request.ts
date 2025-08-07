// File: interfaces/request.ts

export interface Request {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  createdAt: Date;
  expiresAt: Date;
}