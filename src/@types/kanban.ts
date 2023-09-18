import { User } from 'src/@types/user'

export type CardComment = {
  id: string;
  avatar: string;
  name: string;
  createdAt: Date | string | number;
  messageType: 'image' | 'text';
  message: string;
};

export type Assignee = {
  id: string;
  avatar: string;
  name: string;
};

export type KanbanCard = {
  id: string;
  name: string;
  description?: string;
  assignee: Assignee[] | User[];
  due: [number | null, number | null];
  attachments: string[];
  comments: CardComment[] | null;
  completed: boolean;
};

export type KanbanColumn = {
  id: string;
  name: string;
  cardIds: string[];
};

export type KanbanBoard = {
  cards: KanbanCard[];
  columns: KanbanColumn[];
  columnOrder: string[];
};
