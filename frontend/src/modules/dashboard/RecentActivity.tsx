import { Card, Button, Avatar, Tag } from 'antd';
import { useTranslation } from '@/hooks/useTranslation';

export interface Activity {
  id: string;
  type: 'created' | 'commented' | 'status_change';
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
  onMarkAllRead,
  onLoadMore
}) => {
  const { t } = useTranslation('dashboard');

  const getActivityText = (activity: Activity) => {
    const { type, user, crId, crTitle, status } = activity;
    
    switch (type) {
      case 'created':
        return (
          <>
            <span className="font-semibold">{user.name}</span>
            {' '}{t('recent_activity.created')}{' '}
            <a href={`/change-requests/${crId}`} className="text-blue-600 hover:underline">
              [{crId}: {crTitle}]
            </a>
          </>
        );
      case 'commented':
        return (
          <>
            <span className="font-semibold">{user.name}</span>
            {' '}{t('recent_activity.commented_on')}{' '}
            <a href={`/change-requests/${crId}`} className="text-blue-600 hover:underline">
              [{crId}: {crTitle}]
            </a>
          </>
        );
      case 'status_change':
        return (
          <>
            <span className="font-semibold">{user.name}</span>
            {' '}{t('recent_activity.updated_status')}{' '}
            <a href={`/change-requests/${crId}`} className="text-blue-600 hover:underline">
              [{crId}]
            </a>
            {' → '}
            <Tag color="green">{status}</Tag>
          </>
        );
    }
  };

  const getStatusTagColor = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return 'blue';
      case 'commented':
        return 'purple';
      case 'status_change':
        return 'green';
      default:
        return 'default';
    }
  };

  const getStatusTagLabel = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return 'SUBMITTED';
      case 'commented':
        return 'IN DISCUSSION';
      case 'status_change':
        return 'STATUS_CHANGE';
      default:
        return '';
    }
  };

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{t('recent_activity.title')}</span>
          <Button type="link" onClick={onMarkAllRead}>
            {t('recent_activity.mark_all_read')}
          </Button>
        </div>
      }
      className="h-full"
    >
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
                    {activity.user.name.charAt(0)}
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 mb-1">
                      {getActivityText(activity)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag color={getStatusTagColor(activity.type)} className="text-xs">
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

      <Button 
        type="text" 
        onClick={onLoadMore}
        className="w-full mt-6"
      >
        {t('recent_activity.load_more')}
      </Button>
    </Card>
  );
};
