const fs = require("fs");
const path = require("path");

const localesPath = path.join(__dirname, "..", "frontend", "src", "locales");

const en = require(path.join(localesPath, "en", "admin.json"));
const vi = require(path.join(localesPath, "vi", "admin.json"));
const ja = require(path.join(localesPath, "ja", "admin.json"));

const additionsEn = {
  cr_list: {
    title: "All Change Requests",
    subtitle: "Monitor all Change Requests across the system",
    table_view: "Table View",
    kanban_board: "Kanban Board",
    no_crs: "No Change Requests found",
    showing: "Showing {{count}} Change Request",
    showing_plural: "Showing {{count}} Change Requests",
  },
  permissions: {
    title: "Permissions Management",
    subtitle: "Manage user accounts and permission groups",
    accounts_tab: "Accounts",
    groups_tab: "Permission Groups",
    search_placeholder: "Search by name or email",
    create_user: "Create New User",
    delete_confirm: "Are you sure you want to delete {{name}}?",
    user_deleted: "User deleted successfully",
    user_deleted_fail: "Failed to delete user",
    user_updated: "User updated successfully",
    user_created: "User created successfully",
    user_status_active: "User activated successfully",
    user_status_inactive: "User deactivated successfully",
    status_update_fail: "Failed to update user status",
    failed_to_load: "Failed to load users, using fallback data",
    columns: {
      name: "Name",
      email: "Email",
      role: "Role",
      created_date: "Created Date",
      status: "Status",
      actions: "Actions",
    },
    roles: {
      admin: "Administrator",
      pm: "Project Manager",
      customer: "Customer",
    },
    status: {
      active: "Active",
      inactive: "Inactive",
    },
    actions: {
      edit: "Edit",
      deactivate: "Deactivate",
      activate: "Activate",
      delete: "Delete",
    },
    total_users: "Total {{total}} users",
    no_users: "No users found",
  },
};

const additionsVi = {
  cr_list: {
    title: "Tất cả yêu cầu thay đổi",
    subtitle: "Giám sát tất cả Yêu cầu thay đổi trên toàn hệ thống",
    table_view: "Dạng bảng",
    kanban_board: "Bảng Kanban",
    no_crs: "Không tìm thấy Yêu cầu thay đổi nào",
    showing: "Đang hiển thị {{count}} Yêu cầu thay đổi",
    showing_plural: "Đang hiển thị {{count}} Yêu cầu thay đổi",
  },
  permissions: {
    title: "Quản lý quyền",
    subtitle: "Quản lý tài khoản người dùng và nhóm quyền",
    accounts_tab: "Tài khoản",
    groups_tab: "Nhóm quyền",
    search_placeholder: "Tìm kiếm theo tên hoặc email",
    create_user: "Tạo người dùng mới",
    delete_confirm: "Bạn có chắc chắn muốn xóa {{name}} không?",
    user_deleted: "Xóa người dùng thành công",
    user_deleted_fail: "Lỗi khi xóa người dùng",
    user_updated: "Cập nhật người dùng thành công",
    user_created: "Tạo người dùng thành công",
    user_status_active: "Kích hoạt người dùng thành công",
    user_status_inactive: "Vô hiệu hóa người dùng thành công",
    status_update_fail: "Lỗi khi cập nhật trạng thái người dùng",
    failed_to_load: "Lỗi tải người dùng, đang dùng dữ liệu mẫu",
    columns: {
      name: "Tên",
      email: "Email",
      role: "Vai trò",
      created_date: "Ngày tạo",
      status: "Trạng thái",
      actions: "Thao tác",
    },
    roles: {
      admin: "Quản trị viên",
      pm: "Quản lý dự án",
      customer: "Khách hàng",
    },
    status: {
      active: "Hoạt động",
      inactive: "Vô hiệu",
    },
    actions: {
      edit: "Sửa",
      deactivate: "Vô hiệu hóa",
      activate: "Kích hoạt",
      delete: "Xóa",
    },
    total_users: "Tổng cộng {{total}} người dùng",
    no_users: "Không tìm thấy người dùng nào",
  },
};

const additionsJa = {
  cr_list: {
    title: "すべての変更要求",
    subtitle: "システム全体のすべての変更要求を監視します",
    table_view: "テーブルビュー",
    kanban_board: "カンバンボード",
    no_crs: "変更要求が見つかりません",
    showing: "{{count}}件の変更要求を表示中",
    showing_plural: "{{count}}件の変更要求を表示中",
  },
  permissions: {
    title: "権限管理",
    subtitle: "ユーザーアカウントと権限グループを管理します",
    accounts_tab: "アカウント",
    groups_tab: "権限グループ",
    search_placeholder: "名前またはメールで検索",
    create_user: "新規ユーザー作成",
    delete_confirm: "本当に{{name}}を削除しますか？",
    user_deleted: "ユーザーを削除しました",
    user_deleted_fail: "ユーザーの削除に失敗しました",
    user_updated: "ユーザーを更新しました",
    user_created: "ユーザーを作成しました",
    user_status_active: "ユーザーを有効化しました",
    user_status_inactive: "ユーザーを無効化しました",
    status_update_fail: "ユーザーステータスの更新に失敗しました",
    failed_to_load:
      "ユーザーの読み込みに失敗しました。フォールバックデータを使用します",
    columns: {
      name: "名前",
      email: "メール",
      role: "役割",
      created_date: "作成日",
      status: "ステータス",
      actions: "アクション",
    },
    roles: {
      admin: "管理者",
      pm: "プロジェクトマネージャー",
      customer: "顧客",
    },
    status: {
      active: "有効",
      inactive: "無効",
    },
    actions: {
      edit: "編集",
      deactivate: "無効化",
      activate: "有効化",
      delete: "削除",
    },
    total_users: "合計{{total}}人のユーザー",
    no_users: "ユーザーが見つかりません",
  },
};

fs.writeFileSync(
  path.join(localesPath, "en", "admin.json"),
  JSON.stringify({ ...en, ...additionsEn }, null, 2)
);
fs.writeFileSync(
  path.join(localesPath, "vi", "admin.json"),
  JSON.stringify({ ...vi, ...additionsVi }, null, 2)
);
fs.writeFileSync(
  path.join(localesPath, "ja", "admin.json"),
  JSON.stringify({ ...ja, ...additionsJa }, null, 2)
);

console.log("Updated admin i18n files.");
