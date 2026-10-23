export type UserRole = 'guest' | 'staff' | 'admin';

// スタッフ情報の型
export interface Staff {
  id: string;
  name: string;
}

// シフト希望の型定義
export interface ShiftRequest {
  id: string;
  staffId: string;    // スタッフID
  staffName: string;  // スタッフ名
  date: string;       // 例: '2026-11-01'
  shiftType: '早番 (9:00-15:00)' | '遅番 (15:00-21:00)' | '希望休';
  status: '申請中' | '承認済み' | '差し戻し';
}

// トースト通知の型
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}