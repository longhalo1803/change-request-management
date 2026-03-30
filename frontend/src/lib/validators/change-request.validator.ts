import { z } from 'zod';

export const createCrSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  description: z.string().min(1, 'Mô tả là bắt buộc').min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  dueDate: z.string().optional(),
  estimatedHours: z.number().positive().optional()
});

export type CreateCrFormData = z.infer<typeof createCrSchema>;

export const updateCrStatusSchema = z.object({
  status: z.string().min(1, 'Trạng thái là bắt buộc')
});

export type UpdateCrStatusData = z.infer<typeof updateCrStatusSchema>;
