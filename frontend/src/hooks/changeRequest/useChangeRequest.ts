import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changeRequestService,
  type SearchChangeRequestResponse,
  type ChangeRequest,
  type SearchChangeRequestInput,
  type CreateChangeRequestInput,
  type UpdateChangeRequestInput,
  type StatusTransitionInput,
} from "@/services";
import { queryKeys } from "@/hooks/queryKeys";

/**
 * Hook: Get change requests list with search/filter (loads all items)
 */
export const useChangeRequests = (filters?: SearchChangeRequestInput) => {
  return useQuery<SearchChangeRequestResponse>({
    queryKey: queryKeys.changeRequests.list(filters),
    queryFn: () =>
      changeRequestService.list({
        ...filters,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};

/**
 * Hook: Get single change request by ID
 */
export const useChangeRequest = (id: string) => {
  return useQuery<ChangeRequest>({
    queryKey: queryKeys.changeRequests.detail(id),
    queryFn: () => changeRequestService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook: Create change request (CUSTOMER only)
 */
export const useCreateChangeRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateChangeRequestInput) =>
      changeRequestService.create(input),
    onSuccess: (data) => {
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.changeRequests.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.changeRequests.bySpace(data.spaceId),
      });
    },
  });
};

/**
 * Hook: Update change request (CUSTOMER only, DRAFT only)
 */
export const useUpdateChangeRequest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateChangeRequestInput) =>
      changeRequestService.update(id, input),
    onSuccess: (data) => {
      // Update cache for this CR
      queryClient.setQueryData(queryKeys.changeRequests.detail(id), data);
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.changeRequests.lists(),
      });
    },
  });
};

/**
 * Hook: Delete change request (CUSTOMER only, DRAFT only)
 */
export const useDeleteChangeRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => changeRequestService.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.changeRequests.detail(id),
      });
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.changeRequests.lists(),
      });
    },
  });
};

/**
 * Hook: Submit change request (DRAFT → SUBMITTED)
 */
export const useSubmitChangeRequest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => changeRequestService.submit(id),
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(queryKeys.changeRequests.detail(id), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.changeRequests.lists(),
      });
    },
  });
};

/**
 * Hook: Transition status
 */
export const useTransitionStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StatusTransitionInput) =>
      changeRequestService.transitionStatus(id, input),
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(queryKeys.changeRequests.detail(id), data);
      // Invalidate status history
      queryClient.invalidateQueries({
        queryKey: queryKeys.changeRequests.statusHistory(id),
      });
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.changeRequests.lists(),
      });
    },
  });
};

/**
 * Hook: Get change requests by space (loads all items)
 */
export const useChangeRequestsBySpace = (spaceId: string) => {
  return useQuery<SearchChangeRequestResponse>({
    queryKey: queryKeys.changeRequests.bySpace(spaceId),
    queryFn: () => changeRequestService.getBySpace(spaceId),
    enabled: !!spaceId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook: Get change requests assigned to current user (loads all items)
 */
export const useChangeRequestsAssignedToMe = () => {
  return useQuery<SearchChangeRequestResponse>({
    queryKey: queryKeys.changeRequests.assignedToMe(),
    queryFn: () => changeRequestService.getAssignedToMe(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook: Get status history for a change request
 */
export const useStatusHistory = (id: string) => {
  return useQuery<any[]>({
    queryKey: queryKeys.changeRequests.statusHistory(id),
    queryFn: () => changeRequestService.getStatusHistory(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // Status history rarely changes
    gcTime: 30 * 60 * 1000,
  });
};
