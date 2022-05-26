export enum labels {
  PARAGRAPH = 'paragraph',
  BULLETS = 'bullets',
}

export class ParagraphContent {
  label: labels;
  content: string[];
}
