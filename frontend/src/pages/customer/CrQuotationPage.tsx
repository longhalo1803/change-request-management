// import { Card, Table, Tag, Button, Space, Empty } from 'antd';
// import { PageHeader } from '@/components/PageHeader';
// import { DownloadOutlined } from '@ant-design/icons';

// const CrQuotationPage = () => {
//   const quotations = [
//     {
//       id: '1',
//       crId: 'CR-001',
//       crTitle: 'System Performance Optimization',
//       vendor: 'Tech Solutions Inc',
//       amount: 50000,
//       validity: '2026-04-30',
//       status: 'pending'
//     },
//     {
//       id: '2',
//       crId: 'CR-002',
//       crTitle: 'UI Redesign',
//       vendor: 'Design Pro',
//       amount: 35000,
//       validity: '2026-04-25',
//       status: 'accepted'
//     }
//   ];

//   const columns = [
//     {
//       title: 'CR ID',
//       dataIndex: 'crId',
//       key: 'crId',
//       width: 100
//     },
//     {
//       title: 'CR Title',
//       dataIndex: 'crTitle',
//       key: 'crTitle',
//       ellipsis: true
//     },
//     {
//       title: 'Vendor',
//       dataIndex: 'vendor',
//       key: 'vendor'
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'amount',
//       key: 'amount',
//       render: (amount: number) => `$${amount.toLocaleString()}`
//     },
//     {
//       title: 'Validity Date',
//       dataIndex: 'validity',
//       key: 'validity'
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status: string) => (
//         <Tag color={status === 'accepted' ? 'success' : 'warning'}>
//           {status.toUpperCase()}
//         </Tag>
//       )
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       width: 120,
//       render: () => (
//         <Space>
//           <Button type="link" size="small" icon={<DownloadOutlined />}>
//             Download
//           </Button>
//           <Button type="link" size="small">
//             View
//           </Button>
//         </Space>
//       )
//     }
//   ];

//   return (
//     <div>
//       <PageHeader title="Quotations" />
//       <div style={{ padding: '24px' }}>
//         <Card>
//           {quotations.length === 0 ? (
//             <Empty description="No quotations available" />
//           ) : (
//             <Table
//               columns={columns as any}
//               dataSource={quotations}
//               rowKey="id"
//               size="small"
//               pagination={false}
//             />
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CrQuotationPage;
