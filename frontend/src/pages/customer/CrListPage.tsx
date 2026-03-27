import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cr-list-page.css';

type Priority = 'High' | 'Medium' | 'Low';
type Status = 'Draft' | 'Submitted' | 'In Discussion' | 'Approved';

interface CrItem {
  id: string;
  title: string;
  project: string;
  priority: Priority;
  status: Status;
  updatedAt: string;
}

const crData: CrItem[] = [
  {
    id: '#CR-2026-001',
    title: 'CMS Dashboard Export Feature Enhancement',
    project: 'Project: SOLASHI-Portal v2.0',
    priority: 'Medium',
    status: 'Draft',
    updatedAt: 'Mar 15, 2026 10:30 AM',
  },
  {
    id: '#CR-2026-002',
    title: 'Biometric Login Integration (iOS App)',
    project: 'Project: SOLASHI-Mobile',
    priority: 'High',
    status: 'Submitted',
    updatedAt: 'Mar 14, 2026 04:15 PM',
  },
  {
    id: '#CR-2026-003',
    title: 'Localized Japanese UI Support',
    project: 'Project: SOLASHI-Web',
    priority: 'Low',
    status: 'In Discussion',
    updatedAt: 'Mar 16, 2026 09:00 AM',
  },
  {
    id: '#CR-2026-004',
    title: 'Payment Gateway Webhook Redundancy',
    project: 'Project: SOLASHI-Pay',
    priority: 'High',
    status: 'Approved',
    updatedAt: 'Mar 12, 2026 02:45 PM',
  },
];

const statusOptions: Array<Status | 'All'> = [
  'All',
  'Draft',
  'Submitted',
  'In Discussion',
  'Approved',
];

export default function CrListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | 'All'>('All');

  const filteredData = useMemo(() => {
    return crData.filter((item) => {
      const matchesSearch =
          item.id.toLowerCase().includes(search.toLowerCase()) ||
          item.title.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
          selectedStatus === 'All' || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [search, selectedStatus]);

  const handleView = (id: string) => {
    navigate(`/change-requests/${id.replace('#', '').toLowerCase()}`);
  };

  const handleCreate = () => {
    navigate('/change-requests/create');
  };

  return (
      <div className="cr-list-page">
        <div className="cr-list-header">
          <div>
            <h1>Change Request Management</h1>
            <p>Review and manage your project requests</p>
          </div>

          <div className="cr-list-toolbar">
            <div className="cr-search-box">
              <span className="search-icon">⌕</span>
              <input
                  type="text"
                  placeholder="Search CR ID or Title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="avatar-stack">
              <span className="mini-avatar">A</span>
              <span className="mini-avatar">B</span>
              <span className="mini-avatar">C</span>
              <span className="mini-avatar more">+5</span>
            </div>

            <div className="filter-wrap">
              <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => setShowFilters((prev) => !prev)}
              >
                Filters
              </button>

              {showFilters && (
                  <div className="filter-dropdown">
                    {statusOptions.map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => {
                              setSelectedStatus(status);
                              setShowFilters(false);
                            }}
                        >
                          {status}
                        </button>
                    ))}
                  </div>
              )}
            </div>

            <button className="primary-btn" type="button" onClick={handleCreate}>
              + Create New CR
            </button>
          </div>
        </div>

        <section className="table-card">
          <table className="cr-table">
            <thead>
            <tr>
              <th>CR ID</th>
              <th>TITLE</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th>LAST UPDATE</th>
              <th>ACTION</th>
            </tr>
            </thead>

            <tbody>
            {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <button
                        className="link-btn"
                        type="button"
                        onClick={() => handleView(item.id)}
                    >
                      {item.id}
                    </button>
                  </td>

                  <td>
                    <div className="title-cell">
                      <div className="title-main">{item.title}</div>
                      <div className="title-sub">{item.project}</div>
                    </div>
                  </td>

                  <td>
                  <span className={`priority-badge ${item.priority.toLowerCase()}`}>
                    <span className="dot" />
                    {item.priority}
                  </span>
                  </td>

                  <td>
                  <span
                      className={`status-badge ${item.status
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                  >
                    {item.status}
                  </span>
                  </td>

                  <td className="muted-cell">{item.updatedAt}</td>

                  <td>
                    <div className="action-group">
                      {item.status === 'Draft' && (
                          <>
                            <button className="ghost-danger-btn" type="button">
                              Delete
                            </button>
                            <button className="small-primary-btn" type="button">
                              Submit
                            </button>
                          </>
                      )}

                      {item.status === 'Submitted' && (
                          <span className="no-action">No actions available</span>
                      )}

                      {item.status === 'In Discussion' && (
                          <>
                            <button className="ghost-danger-btn" type="button">
                              Reject
                            </button>
                            <button className="approve-btn" type="button">
                              Approve
                            </button>
                          </>
                      )}

                      {item.status === 'Approved' && (
                          <button
                              className="icon-only-btn"
                              type="button"
                              onClick={() => handleView(item.id)}
                          >
                            👁
                          </button>
                      )}
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>

          <div className="table-footer">
            <span>Showing 1 - 15 of 24 entries</span>

            <div className="pagination">
              <button type="button">‹</button>
              <button type="button" className="active">
                1
              </button>
              <button type="button">2</button>
              <button type="button">›</button>
            </div>
          </div>
        </section>
      </div>
  );
}