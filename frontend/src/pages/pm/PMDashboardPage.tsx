import { Card, Row, Col, Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

/**
 * PM Dashboard Page
 * 
 * Placeholder PM dashboard for project managers
 * This page shows the PM workspace with project management features
 * 
 * Features to be implemented:
 * - Project overview
 * - Task management
 * - Team management
 * - Project metrics
 */
export const PMDashboardPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">PM Dashboard</h1>
        <p className="text-gray-600 mt-2">Project Management Overview</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card 
            title="Welcome to PM Dashboard"
            extra={<Button type="primary" icon={<PlusOutlined />}>New Project</Button>}
          >
            <Empty
              description="No projects yet"
              style={{ marginTop: '50px', marginBottom: '50px' }}
            />
            <p className="text-center text-gray-600">
              Start by creating a new project or contact your administrator for existing projects
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PMDashboardPage;
