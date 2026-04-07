import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  projectService,
  type Project,
  type Space,
  type CreateProjectInput,
  type UpdateProjectInput,
  type CreateSpaceInput,
  type UpdateSpaceInput,
} from "@/services";
import { queryKeys } from "@/hooks/queryKeys";

/**
 * Hook: Get all projects
 */
export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: queryKeys.projects.list(),
    queryFn: () => projectService.list(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook: Get single project by ID
 */
export const useProject = (id: string) => {
  return useQuery<Project>({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => projectService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook: Create project (PM only)
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectService.create(input),
    onSuccess: () => {
      // Invalidate projects list
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.list(),
      });
    },
  });
};

/**
 * Hook: Update project (PM only, owner only)
 */
export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProjectInput) => projectService.update(id, input),
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(queryKeys.projects.detail(id), data);
      // Invalidate list
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.list(),
      });
    },
  });
};

/**
 * Hook: Delete project (PM only, owner only)
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.projects.detail(id),
      });
      // Invalidate list
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.list(),
      });
    },
  });
};

/**
 * Hook: Get spaces for a project
 */
export const useSpaces = (projectId: string) => {
  return useQuery<Space[]>({
    queryKey: queryKeys.projects.spacesForProject(projectId),
    queryFn: () => projectService.getSpaces(projectId),
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook: Get single space by ID
 */
export const useSpace = (id: string) => {
  return useQuery<Space>({
    queryKey: queryKeys.projects.spaceDetail(id),
    queryFn: () => projectService.getSpaceById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook: Create space (PM only, project owner only)
 */
export const useCreateSpace = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSpaceInput) =>
      projectService.createSpace(projectId, input),
    onSuccess: () => {
      // Invalidate spaces list
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.spacesForProject(projectId),
      });
    },
  });
};

/**
 * Hook: Update space (PM only, project owner only)
 */
export const useUpdateSpace = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateSpaceInput) =>
      projectService.updateSpace(id, input),
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(queryKeys.projects.spaceDetail(id), data);
      // Invalidate spaces list (we don't know projectId here, so invalidate all spaces)
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.spaces(),
      });
    },
  });
};

/**
 * Hook: Delete space (PM only, project owner only)
 */
export const useDeleteSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectService.deleteSpace(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.projects.spaceDetail(id),
      });
      // Invalidate all spaces lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.spaces(),
      });
    },
  });
};
