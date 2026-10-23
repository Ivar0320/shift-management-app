import { useState, useEffect } from 'react';
import type { UserRole, ShiftRequest, Staff, Toast } from './types';
import { Login } from './components/Login';
import { StaffDashboard } from './components/StaffDashboard';
import { AdminDashboard } from './components/AdminDashboard';

const STORAGE_KEY_REQUESTS = 'shift_management_requests';
const STORAGE_KEY_CURRENT_STAFF = 'shift_management_current_staff_id';

// サンプルのスタッフ一覧
const INITIAL_STAFF_LIST: Staff[] = [
  { id: 'staff-1', name: '山田 太郎' },
  { id: 'staff-2', name: '佐藤 花子' },
  { id: 'staff-3', name: '鈴木 一郎' },
];

const INITIAL_REQUESTS: ShiftRequest[] = [
  { id: '1', staffId: 'staff-1', staffName: '山田 太郎', date: '2026-11-05', shiftType: '早番 (9:00-15:00)', status: '承認済み' },
  { id: '2', staffId: 'staff-2', staffName: '佐藤 花子', date: '2026-11-10', shiftType: '希望休', status: '申請中' },
];

export default function App() {
  const [role, setRole] = useState<UserRole>('guest');
  
  // 現在ログインしているスタッフのID（デフォルトは山田太郎）
  const [currentStaffId, setCurrentStaffId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_CURRENT_STAFF) || 'staff-1';
  });

  // シフトデータの永続化
  const [requests, setRequests] = useState<ShiftRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REQUESTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_REQUESTS;
  });

  // トースト通知の状態
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURRENT_STAFF, currentStaffId);
  }, [currentStaffId]);

  // トースト通知を表示する関数
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // 現在ログイン中のスタッフオブジェクト
  const currentStaff = INITIAL_STAFF_LIST.find((s) => s.id === currentStaffId) || INITIAL_STAFF_LIST[0];

  // 新規申請追加
  const handleAddRequest = (newReq: Omit<ShiftRequest, 'id' | 'status' | 'staffId' | 'staffName'>) => {
    const request: ShiftRequest = {
      ...newReq,
      id: Date.now().toString(),
      staffId: currentStaff.id,
      staffName: currentStaff.name,
      status: '申請中',
    };
    setRequests([request, ...requests]);
    showToast(`${currentStaff.name}さんのシフト希望を提出しました！`);
  };

  // ステータス更新（承認・差し戻し）
  const handleUpdateStatus = (id: string, status: ShiftRequest['status']) => {
    setRequests(
      requests.map((req) => (req.id === id ? { ...req, status } : req))
    );
    showToast(`シフト申請を「${status}」に更新しました。`, status === '承認済み' ? 'success' : 'error');
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* トースト通知コンテナ */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-white text-sm font-semibold transition-all transform translate-y-0 animate-bounce-short ${
              t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* 画面ルーティング */}
      {role === 'guest' && (
        <Login onLogin={(selectedRole) => setRole(selectedRole)} />
      )}

      {role === 'staff' && (
        <StaffDashboard 
          staffList={INITIAL_STAFF_LIST}
          currentStaffId={currentStaffId}
          onChangeStaff={setCurrentStaffId}
          requests={requests.filter((r) => r.staffId === currentStaffId)}
          onAddRequest={handleAddRequest}
          onLogout={() => setRole('guest')} 
        />
      )}

      {role === 'admin' && (
        <AdminDashboard 
          requests={requests} 
          onUpdateStatus={handleUpdateStatus}
          onLogout={() => setRole('guest')} 
        />
      )}
    </div>
  );
}