import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CrDetailPage.css';

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

export default function CrDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<ActivityTab>('All');
  const [comment, setComment] = useState('');
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);

  const displayId = useMemo(() => {
    if (!id) return 'CR-2024-0852';
    return id.toUpperCase();
  }, [id]);

  const filteredActivities = useMemo(() => {
    if (activeTab === 'All') return activities;
    if (activeTab === 'History') return activities.filter((item) => item.type === 'history');
    if (activeTab === 'Comments') return activities.filter((item) => item.type === 'comment');
    return activities.filter((item) => item.type === 'attachment');
  }, [activeTab, activities]);

  const handleApprove = () => {
    alert(`Approved requirement ${displayId}`);
  };

  const handleReject = () => {
    alert(`Rejected requirement ${displayId}`);
  };

  const handleShare = () => {
    navigator.clipboard
        ?.writeText(window.location.href)
        .then(() => alert('Detail page link copied'))
        .catch(() => alert('Link copied is not supported in this browser'));
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
      <div className="cr-detail-page">
        <div className="detail-shell">
          <div className="detail-topbar">
            <div>
              <div className="detail-breadcrumb">Project Alpha &gt; {displayId}</div>
              <h1>Requirement Details</h1>
            </div>

            <div className="detail-actions">
              <button className="icon-action-btn" type="button" onClick={handleShare}>
                ⤴
              </button>
              <button className="text-danger-btn" type="button" onClick={handleReject}>
                Reject
              </button>
              <button className="primary-action-btn" type="button" onClick={handleApprove}>
                Approve
              </button>
              <button
                  className="icon-action-btn"
                  type="button"
                  onClick={() => navigate('/change-requests')}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="detail-layout">
            <section className="detail-main">
              <div className="status-pill">IN DISCUSSION</div>

              <h2 className="requirement-title">
                Integrated Multi-channel Payment Gateway for Mobile Checkout
              </h2>

              <div className="section-block">
                <div className="section-label">DESCRIPTION</div>

                <p>
                  This change request proposes integrating Stripe, PayPal, and Apple Pay into the
                  mobile checkout experience so customers can complete purchases using their preferred
                  payment channel with minimal friction.
                </p>

                <p>
                  The implementation should ensure a unified payment experience across supported
                  devices while maintaining strong transaction security, clean callback handling, and
                  compatibility with the current backend order lifecycle.
                </p>

                <ul>
                  <li>Universal UI for selecting available payment methods during mobile checkout.</li>
                  <li>Security measures for tokenized payment flow and validation.</li>
                  <li>Reliable callback and webhook handling for payment result synchronization.</li>
                </ul>

                <p>
                  Error states, retry flows, and transaction logging should be aligned with the
                  existing audit and reporting model so the customer support team can investigate
                  payment issues efficiently.
                </p>
              </div>

              <div className="section-block activity-section">
                <div className="section-label">ACTIVITY LOG</div>

                <div className="activity-tabs">
                  {(['All', 'History', 'Comments', 'Attachments'] as ActivityTab[]).map((tab) => (
                      <button
                          key={tab}
                          type="button"
                          className={activeTab === tab ? 'tab-btn active' : 'tab-btn'}
                          onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                  ))}
                </div>

                <div className="activity-list">
                  {filteredActivities.map((item) => (
                      <div key={item.id} className="activity-item">
                        <div className="activity-avatar">{item.avatar}</div>

                        <div className="activity-body">
                          <div className="activity-meta">
                            <span className="activity-user">{item.user}</span>
                            <span className="activity-source">{item.source}</span>
                            <span className="activity-time">{item.time}</span>
                          </div>

                          <div className="activity-message">{item.content}</div>
                        </div>
                      </div>
                  ))}

                  {filteredActivities.length === 0 && (
                      <div className="empty-activity">No activity available in this tab.</div>
                  )}
                </div>

                <div className="comment-box">
                <textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                />
                  <div className="comment-actions">
                    <button type="button" className="send-btn" onClick={handleSendMessage}>
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <aside className="detail-sidebar">
              <div className="sla-card">
                <div className="sla-title">SLA Reminder</div>
                <p>This CR is in discussion for 2 days. BrSE block limit is 3 days.</p>
              </div>

              <div className="attribute-card">
                <div className="section-label">ATTRIBUTES</div>

                <div className="attribute-list">
                  <div className="attribute-row">
                    <span className="attribute-key">Priority</span>
                    <span className="critical-badge">CRITICAL</span>
                  </div>

                  <div className="attribute-row">
                    <span className="attribute-key">Sprint</span>
                    <span className="attribute-value">Q4_SPRINT_02</span>
                  </div>

                  <div className="attribute-row">
                    <span className="attribute-key">Start Date</span>
                    <span className="attribute-value">Aug 24, 2024</span>
                  </div>

                  <div className="attribute-row">
                    <span className="attribute-key">Due Date</span>
                    <span className="attribute-value">Sep 15, 2024</span>
                  </div>

                  <div className="attribute-row">
                    <span className="attribute-key">Parent Task</span>
                    <span className="attribute-value">None</span>
                  </div>

                  <div className="attribute-row reporter-row">
                    <span className="attribute-key">Reporter</span>
                    <div className="reporter-info">
                      <span className="reporter-avatar">S</span>
                      <span className="attribute-value">Sarah Connor</span>
                    </div>
                  </div>
                </div>

                <div className="meta-footer">Created Aug 24, 2024 • Updated 2 hours ago</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
  );
}