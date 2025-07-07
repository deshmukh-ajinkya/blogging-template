export interface Comment {
  authorID: {
    id: string;
    name: string;
  };
  content: string;
}

export interface IBlog {
  id: string | null | undefined;
  author: {
    id: string;
    name: string;
  };
  title: string;
  content: string;
  bannerImg: string;
  likesCount: number;
  category: string;
  comments?: Comment[]; // ✅ Add this line (optional since API might not return it)
}
