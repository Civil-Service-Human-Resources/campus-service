export interface Module {
  type: string;
  url: string;
  fileSize: number;
  id: string;
  title: string;
  description: string;
  duration: number;
  cost: number;
  optional: boolean;
  status: string;
  associatedLearning: boolean;
  mediaId: string;
  moduleType: string;
}
