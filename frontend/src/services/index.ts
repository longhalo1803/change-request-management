export { authService } from "./auth.service";
export type {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
} from "./auth.service";

export { changeRequestService } from "./changeRequest.service";
export { commentService } from "./comment.service";
export { projectService } from "./project.service";

// All types are now in @/lib/types/
export type {
  ChangeRequest,
  CreateChangeRequestInput,
  UpdateChangeRequestInput,
  StatusTransitionInput,
  SearchChangeRequestInput,
  SearchChangeRequestResponse,
  ChangeRequestStatus,
  ChangeRequestPriority,
  ChangeRequestLookupData,
} from "@/lib/types/changeRequest.types";

export type {
  ChangeRequestComment,
  ChangeRequestAttachment,
  CreateCommentInput,
} from "@/lib/types/comment.types";

export type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  Space,
  CreateSpaceInput,
  UpdateSpaceInput,
} from "@/lib/types/project.types";
