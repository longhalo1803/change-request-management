import { Card, Button, Avatar, Tag, Empty } from "antd";
import { useTranslation } from "@/hooks/useTranslation";

export interface Activity {
  id: string;
  type:
    | "cr_created"
    | "comment"
    | "status_change"
    | "attachment"
    | "created"
    | "commented";
  user: {
    name: string;
    avatar?: string;
  };
  crId: string;
  crTitle: string;
  status?: string;
  timestamp: string;
  timeAgo: string;
}

interface ActivityGroup {
  date: string;
  label: string;
  activities: Activity[];
}

interface RecentActivityProps {
  activities: ActivityGroup[];
  onMarkAllRead?: () => void;
  onLoadMore?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onLoadMore,
}) => {
  const { t } = useTranslation("dashboard");

  const getActivityText = (activity: Activity) => {
    const { type, user, crId, crTitle, status } = activity;

    switch (type) {
      case "created":
      case "cr_created":
        return (
          <>
            <span className="font-semibold">{user.name}</span>{" "}
            {t("recent_activity.created", { defaultValue: "vừa tạo yêu cầu" })}{" "}
            <a
              href={`/change-requests/${crId}`}
              className="text-blue-600 hover:underline"
            >
              [{crId}: {crTitle}]
            </a>
          </>
        );
      case "commented":
      case "comment":
        return (
          <>
            <span className="font-semibold">{user.name}</span>{" "}
            {t("recent_activity.commented_on", {
              defaultValue: "vừa thêm bình luận vào",
            })}{" "}
            <a
              href={`/change-requests/${crId}`}
              className="text-blue-600 hover:underline"
            >
              [{crId}: {crTitle}]
            </a>
          </>
        );
      case "attachment":
        return (
          <>
            <span className="font-semibold">{user.name}</span>{" "}
            {t("recent_activity.attached_to", {
              defaultValue: "vừa đính kèm tệp vào",
            })}{" "}
            <a
              href={`/change-requests/${crId}`}
              className="text-blue-600 hover:underline"
            >
              [{crId}: {crTitle}]
            </a>
          </>
        );
      case "status_change":
        return (
          <>
            <span className="font-semibold">{user.name}</span>{" "}
            {t("recent_activity.updated_status", {
              defaultValue: "vừa cập nhật trạng thái",
            })}{" "}
            <a
              href={`/change-requests/${crId}`}
              className="text-blue-600 hover:underline"
            >
              [{crId}]
            </a>
            {" → "}
            <Tag color="green">{status}</Tag>
          </>
        );
      default:
        return (
          <>
            <span className="font-semibold">{user.name}</span> có hoạt động mới
            trên
            <a
              href={`/change-requests/${crId}`}
              className="text-blue-600 hover:underline"
            >
              [{crId}: {crTitle}]
            </a>
          </>
        );
    }
  };

  const getStatusTagColor = (type: Activity["type"]) => {
    switch (type) {
      case "created":
      case "cr_created":
        return "blue";
      case "commented":
      case "comment":
        return "purple";
      case "attachment":
        return "orange";
      case "status_change":
        return "green";
      default:
        return "default";
    }
  };

  const getStatusTagLabel = (type: Activity["type"]) => {
    switch (type) {
      case "created":
      case "cr_created":
        return "NEW CR";
      case "commented":
      case "comment":
        return "COMMENT";
      case "attachment":
        return "ATTACHMENT";
      case "status_change":
        return "STATUS UPDATE";
      default:
        return "ACTIVITY";
    }
  };

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            {t("recent_activity.title", { defaultValue: "Hoạt động gần đây" })}
          </span>
        </div>
      }
      className="h-full"
    >
      {!activities || activities.length === 0 ? (
        <Empty
          description={t("recent_activity.no_data", {
            defaultValue: "Không có hoạt động nào gần đây",
          })}
          className="my-10"
        />
      ) : (
        <>
          <div className="space-y-6">
            {activities.map((group) => (
              <div key={group.date}>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  {group.label}
                </div>

                <div className="space-y-4">
                  {group.activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <Avatar
                        size={40}
                        src={activity.user.avatar}
                        className="flex-shrink-0"
                      >
                        {activity.user.name.charAt(0).toUpperCase()}
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-700 mb-1">
                          {getActivityText(activity)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag
                            color={getStatusTagColor(activity.type)}
                            className="text-xs"
                          >
                            {getStatusTagLabel(activity.type)}
                          </Tag>
                          <span className="text-xs text-gray-400">
                            {activity.timeAgo}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {onLoadMore && (
            <Button type="text" onClick={onLoadMore} className="w-full mt-6">
              {t("recent_activity.load_more", { defaultValue: "Tải thêm" })}
            </Button>
          )}
        </>
      )}
    </Card>
  );
};
