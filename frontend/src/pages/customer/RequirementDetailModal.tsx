import { useMemo, useState } from 'react';
import './RequirementDetailModal.css';

type ActivityTab = 'All' | 'History' | 'Comments' | 'Attachments';

interface ActivityItem {
  id: number;
  type: 'history' | 'comment' | 'attachment';
  user: string;
  source: string;
  avatar: string;
  content: string;
  time: string;
}

export interface RequirementDetailData {
  id: string;
  title: string;
  status: string;
  priority: string;
  sprint: string;
  startDate: string;
  dueDate: string;
  parentTask: string;
  reporter: string;
  description: string[];
}

interface RequirementDetailModalProps {
  open: boolean;
  onClose: () => void;
  data?: RequirementDetailData | null;
  onApprove?: () => void;
  onReject?: () => void;
}

const initialActivities: ActivityItem[] = [
  {
    id: 1,
    type: 'comment',
    user: 'Sarah Connor',
    source: 'Project Alpha',
    avatar: 'S',
    content:
        'Please confirm whether Apple Pay should be enabled only for iOS users in phase 1, or for all supported mobile browsers.',
    time: '10 mins ago',
  },
  {
    id: 2,
    type: 'history',
    user: 'Do Thanh Long',
    source: 'System Update',
    avatar: 'L',
    content:
        'Status changed from Submitted to In Discussion after technical review with BrSE and customer team.',
    time: '2 hours ago',
  },
  {
    id: 3,
    type: 'attachment',
    user: 'Mika Sato',
    source: 'Attachment',
    avatar: 'M',
    content: 'Attached payment-flow-spec-v2.pdf for requirement clarification.',
    time: 'Yesterday',
  },
];

const defaultData: RequirementDetailData = {
  id: 'CR-2024-0852',
  title: 'Integrated Multi-channel Payment Gateway for Mobile Checkout',
  status: 'IN DISCUSSION',
  priority: 'CRITICAL',
  sprint: 'Q4_SPRINT_02',
  startDate: 'Aug 24, 2024',
  dueDate: 'Sep 15, 2024',
  parentTask: 'None',
  reporter: 'Sarah Connor',
  description: [
    'This change request proposes integrating Stripe, PayPal, and Apple Pay into the mobile checkout experience so customers can complete purchases using their preferred payment channel with minimal friction.',
    'The implementation should ensure a unified payment experience across supported devices while maintaining strong transaction security, clean callback handling, and compatibility with the current backend order lifecycle.',
    'Error states, retry flows, and transaction logging should be aligned with the existing audit and reporting model so the customer support team can investigate payment issues efficiently.',
  ],
};

export default function RequirementDetailModal({
                                                 open,
                                                 onClose,
                                                 data,
                                                 onApprove,
                                                 onReject,
                                               }: RequirementDetailModalProps) {
  const [activeTab, setActiveTab] = useState<ActivityTab>('All');
  const [comment, setComment] = useState('');
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);

  const detail = data ?? defaultData;

  const filteredActivities = useMemo(() => {
    if (activeTab === 'All') return activities;
    if (activeTab === 'History') return activities.filter((item) => item.type === 'history');
    if (activeTab === 'Comments') return activities.filter((item) => item.type === 'comment');
    return activities.filter((item) => item.type === 'attachment');
  }, [activeTab, activities]);

  if (!open) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove();
      return;
    }
    alert(`Approved requirement ${detail.id}`);
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
      return;
    }
    alert(`Rejected requirement ${detail.id}`);
  };

  const handleShare = () => {
    navigator.clipboard
        ?.writeText(window.location.href)
        .then(() => alert('Detail link copied'))
        .catch(() => alert('Copy is not supported in this browser'));
  };

  const handleSendMessage = () => {
    if (!comment.trim()) return;

    const newItem: ActivityItem = {
      id: Date.now(),
      type: 'comment',
      user: 'You',
      source: 'Customer',
      avatar: 'Y',
      content: comment.trim(),
      time: 'Just now',
    };

    setActivities((prev) => [newItem, ...prev]);
    setComment('');
    setActiveTab('All');
  };

  return (
      <div className="detail-modal-overlay" onClick={handleOverlayClick}>
        <div className="detail-modal-shell" onClick={handleModalClick}>
          <div className="detail-modal-topbar">
            <div>
              <div className="detail-modal-breadcrumb">Project Alpha &gt; {detail.id}</div>
              <h2>Requirement Details</h2>
            </div>

            <div className="detail-modal-actions">
              <button className="detail-icon-action-btn" type="button" onClick={handleShare}>
                ⤴
              </button>
              <button className="detail-text-danger-btn" type="button" onClick={handleReject}>
                Reject
              </button>
              <button className="detail-primary-action-btn" type="button" onClick={handleApprove}>
                Approve
              </button>
              <button className="detail-icon-action-btn" type="button" onClick={onClose}>
                ✕
              </button>
            </div>
          </div>

          <div className="detail-modal-layout">
            <section className="detail-modal-main">
              <div className="detail-status-pill">{detail.status}</div>

              <h3 className="detail-requirement-title">{detail.title}</h3>

              <div className="detail-section-block">
                <div className="detail-section-label">DESCRIPTION</div>

                {detail.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}

                <ul>
                  <li>Universal UI for selecting available payment methods during mobile checkout.</li>
                  <li>Security measures for tokenized payment flow and validation.</li>
                  <li>Reliable callback and webhook handling for payment result synchronization.</li>
                </ul>
              </div>

              <div className="detail-section-block detail-activity-section">
                <div className="detail-section-label">ACTIVITY LOG</div>

                <div className="detail-activity-tabs">
                  {(['All', 'History', 'Comments', 'Attachments'] as ActivityTab[]).map((tab) => (
                      <button
                          key={tab}
                          type="button"
                          className={activeTab === tab ? 'detail-tab-btn active' : 'detail-tab-btn'}
                          onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                  ))}
                </div>

                <div className="detail-activity-list">
                  {filteredActivities.map((item) => (
                      <div key={item.id} className="detail-activity-item">
                        <div className="detail-activity-avatar">{item.avatar}</div>

                        <div className="detail-activity-body">
                          <div className="detail-activity-meta">
                            <span className="detail-activity-user">{item.user}</span>
                            <span className="detail-activity-source">{item.source}</span>
                            <span className="detail-activity-time">{item.time}</span>
                          </div>

                          <div className="detail-activity-message">{item.content}</div>
                        </div>
                      </div>
                  ))}

                  {filteredActivities.length === 0 && (
                      <div className="detail-empty-activity">No activity available in this tab.</div>
                  )}
                </div>

                <div className="detail-comment-box">
                <textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                />
                  <div className="detail-comment-actions">
                    <button type="button" className="detail-send-btn" onClick={handleSendMessage}>
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <aside className="detail-modal-sidebar">
              <div className="detail-sla-card">
                <div className="detail-sla-title">SLA Reminder</div>
                <p>This CR is in discussion for 2 days. BrSE block limit is 3 days.</p>
              </div>

              <div className="detail-attribute-card">
                <div className="detail-section-label">ATTRIBUTES</div>

                <div className="detail-attribute-list">
                  <div className="detail-attribute-row">
                    <span className="detail-attribute-key">Priority</span>
                    <span className="detail-critical-badge">{detail.priority}</span>
                  </div>

                  <div className="detail-attribute-row">
                    <span className="detail-attribute-key">Sprint</span>
                    <span className="detail-attribute-value">{detail.sprint}</span>
                  </div>

                  <div className="detail-attribute-row">
                    <span className="detail-attribute-key">Start Date</span>
                    <span className="detail-attribute-value">{detail.startDate}</span>
                  </div>

                  <div className="detail-attribute-row">
                    <span className="detail-attribute-key">Due Date</span>
                    <span className="detail-attribute-value">{detail.dueDate}</span>
                  </div>

                  <div className="detail-attribute-row">
                    <span className="detail-attribute-key">Parent Task</span>
                    <span className="detail-attribute-value">{detail.parentTask}</span>
                  </div>

                  <div className="detail-attribute-row detail-reporter-row">
                    <span className="detail-attribute-key">Reporter</span>
                    <div className="detail-reporter-info">
                    <span className="detail-reporter-avatar">
                      {detail.reporter.charAt(0).toUpperCase()}
                    </span>
                      <span className="detail-attribute-value">{detail.reporter}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-meta-footer">Created Aug 24, 2024 • Updated 2 hours ago</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
  );
}