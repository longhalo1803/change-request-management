// import { Card, Table, Tag, Button, Space, Empty } from 'antd';
// import { PageHeader } from '@/components/shared/PageHeader';
// import { DownloadOutlined } from '@ant-design/icons';
// import { useTranslation } from 'react-i18next';

// const CrQuotationPage = () => {
//   const { t } = useTranslation('quotation');
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
//       title: t('table.cr_id'),
//       dataIndex: 'crId',
//       key: 'crId',
//       width: 100
//     },
//     {
//       title: t('table.cr_title'),
//       dataIndex: 'crTitle',
//       key: 'crTitle',
//       ellipsis: true
//     },
//     {
//       title: t('table.vendor'),
//       dataIndex: 'vendor',
//       key: 'vendor'
//     },
//     {
//       title: t('table.amount'),
//       dataIndex: 'amount',
//       key: 'amount',
//       render: (amount: number) => `$${amount.toLocaleString()}`
//     },
//     {
//       title: t('table.validity_date'),
//       dataIndex: 'validity',
//       key: 'validity'
//     },
//     {
//       title: t('table.status'),
//       dataIndex: 'status',
//       key: 'status',
//       render: (status: string) => (
//         <Tag color={status === 'accepted' ? 'success' : 'warning'}>
//           {status === 'accepted' ? t('status.accepted') : t('status.pending')}
//         </Tag>
//       )
//     },
//     {
//       title: t('table.actions'),
//       key: 'actions',
//       width: 120,
//       render: () => (
//         <Space>
//           <Button type="link" size="small" icon={<DownloadOutlined />}>
//             {t('buttons.download')}
//           </Button>
//           <Button type="link" size="small">
//             {t('buttons.view')}
//           </Button>
//         </Space>
//       )
//     }
//   ];

//   return (
//     <div>
//       <PageHeader title={t('page_title')} />
//       <div style={{ padding: '24px' }}>
//         <Card>
//           {quotations.length === 0 ? (
//             <Empty description={t('messages.no_quotations')} />
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
