import { z } from 'zod';

export const commentSchema = z.object({
  content: z.string().min(1, 'Nội dung bình luận là bắt buộc').min(2, 'Nội dung phải có ít nhất 2 ký tự'),
  visibility: z.enum(['public', 'internal', 'pm_only'])
});

export type CommentFormData = z.infer<typeof commentSchema>;
