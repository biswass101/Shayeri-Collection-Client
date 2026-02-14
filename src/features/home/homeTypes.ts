export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type Video = {
  id: string;
  title: string;
  description?: string;
  subtitle: string;
  thumbnailLabel: string;
  categoryId: string;
  categorySlug: string;
  views: string;
  uploaded: string;
  duration: string;
  thumbnailUrl?: string;
  hlsUrl?: string;
  videoUrl?: string;
  likesCount?: number;
  sharesCount?: number;
  downloadsCount?: number;
  isPublished?: boolean;
};

export type CommentItem = {
  id: string;
  body: string;
  createdAt: string;
  userName: string;
  userId?: string;
  replies?: CommentItem[];
};
