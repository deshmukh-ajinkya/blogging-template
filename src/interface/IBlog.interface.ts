export interface Comment {
  authorID: {
    id: string;
    name: string;
  };
  content: string;
}

export interface IBlog {
  id: string;
  title: string;
  description: string;
  content: string;
  bannerImg: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  category: string;
  likesCount: number;
  createdAt: string;
  comments: Comment[];
}
