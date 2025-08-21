// types/ui.ts
export type UiTender = {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId?: string;
  location?: string;
  contactEmail?: string;
  image?: string;
  budget: number;
  postedBy?: any;
  status: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  postedDate: string;
  deadlineDate: string;
  bidsCount: number;
  awardedBid: boolean;
  isCompleted: boolean;
  rejectionReason?: string;
};
