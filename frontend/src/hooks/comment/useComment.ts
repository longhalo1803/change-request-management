import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  commentService,
  type ChangeRequestComment,
  type ChangeRequestAttachment,
  type CreateCommentInput,
} from "@/services";
import { queryKeys } from "@/hooks/queryKeys";

/**
 * Hook: Get all comments for a change request
 */
export const useComments = (crId: string) => {
  return useQuery<ChangeRequestComment[]>({
    queryKey: queryKeys.comments.list(crId),
    queryFn: () => commentService.list(crId),
    enabled: !!crId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook: Add comment with file attachments
 */
export const useAddComment = (crId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { input: CreateCommentInput; files?: File[] }) =>
      commentService.create(crId, data.input, data.files),
    onSuccess: () => {
      // Invalidate comments list
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(crId),
      });
      // Invalidate attachments
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.attachmentsByRequest(crId),
      });
    },
  });
};

/**
 * Hook: Delete comment
 */
export const useDeleteComment = (crId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.delete(crId, commentId),
    onSuccess: () => {
      // Invalidate comments list
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(crId),
      });
    },
  });
};

/**
 * Hook: Get attachments for a change request
 */
export const useAttachments = (crId: string) => {
  return useQuery<ChangeRequestAttachment[]>({
    queryKey: queryKeys.comments.attachmentsByRequest(crId),
    queryFn: () => commentService.getAttachments(crId),
    enabled: !!crId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook: Delete attachment
 */
export const useDeleteAttachment = (crId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId: string) =>
      commentService.deleteAttachment(crId, attachmentId),
    onSuccess: () => {
      // Invalidate attachments list
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.attachmentsByRequest(crId),
      });
      // Invalidate comments (since attachments are shown with comments)
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(crId),
      });
    },
  });
};
