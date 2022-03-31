export interface LearningMaterial {
  source: string;
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  outcomes: string;
  sourceHref: string;
}
