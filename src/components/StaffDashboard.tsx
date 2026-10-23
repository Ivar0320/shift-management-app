import React, { useState } from 'react';
import type { ShiftRequest, Staff } from '../types';

interface StaffDashboardProps {
  staffList: Staff[];
  currentStaffId: string;
  onChangeStaff: (id: string) => void;
  requests: ShiftRequest[];
  onAddRequest: (req: Omit<ShiftRequest, 'id' | 'status' | 'staffId' | 'staffName'>) => void;
  onLogout: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  staffList,
  currentStaffId,
  onChangeStaff,
  requests,
  onAddRequest,
  onLogout,
}) => {
  const [date, setDate] = useState('');
  const [shiftType, setShiftType] = useState<ShiftRequest['shiftType']>('早番 (9:00-15:00)');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(11);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    onAddRequest({ date, shiftType });
    setDate('');
  };

  // 月間集計の計算
  const totalRequests = requests.length;
  const approvedCount = requests.filter(r => r.status === '承認済み').length;
  const pendingCount = requests.filter(r => r.status === '申請中').length;

  // カレンダー生成
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(currentMonth).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    calendarDays.push(`${currentYear}-${monthStr}-${dayStr}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ヘッダー */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">スタッフダッシュボード</h1>
          {/* ログインスタッフ切り替えプルダウン */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
            <span className="text-xs text-gray-500 font-medium">ログイン中:</span>
            <select
              value={currentStaffId}
              onChange={(e) => onChangeStaff(e.target.value)}
              className="bg-transparent text-sm font-bold text-gray-800 focus:outline-none cursor-pointer"
            >
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={onLogout} className="text-sm text-red-600 hover:underline font-medium">
          ログアウト
        </button>
      </header>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">提出済み総数</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalRequests} <span className="text-sm font-normal text-gray-500">件</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">承認済み</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{approvedCount} <span className="text-sm font-normal text-gray-500">件</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">承認待ち（申請中）</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount} <span className="text-sm font-normal text-gray-500">件</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左側：新規提出フォーム */}
        <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">新規シフト希望の提出</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">希望日</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">希望区分</label>
              <select 
                value={shiftType}
                onChange={(e) => setShiftType(e.target.value as ShiftRequest['shiftType'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="早番 (9:00-15:00)">早番 (9:00-15:00)</option>
                <option value="遅番 (15:00-21:00)">遅番 (15:00-21:00)</option>
                <option value="希望休">希望休</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              希望を提出する
            </button>
          </form>
        </div>

        {/* 右側：一覧・カレンダービュー */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800">マイシフト希望一覧</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                リスト表示
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  viewMode === 'calendar' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                カレンダー表示
              </button>
            </div>
          </div>

          {viewMode === 'list' && (
            <div>
              {requests.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">提出されたシフト希望はありません。</p>
              ) : (
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div key={req.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-semibold text-gray-800">{req.date}</p>
                        <p className="text-sm text-gray-600">{req.shiftType}</p>
                      </div>
                      <div>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          req.status === '承認済み' ? 'bg-green-100 text-green-700' :
                          req.status === '申請中' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'calendar' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => currentMonth === 1 ? (setCurrentYear(currentYear - 1), setCurrentMonth(12)) : setCurrentMonth(currentMonth - 1)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  &larr; 前の月
                </button>
                <span className="font-bold text-gray-800 text-base">{currentYear}年 {currentMonth}月</span>
                <button 
                  onClick={() => currentMonth === 12 ? (setCurrentYear(currentYear + 1), setCurrentMonth(1)) : setCurrentMonth(currentMonth + 1)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  次の月 &rarr;
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-gray-500 mb-2">
                <span className="text-red-500">日</span><span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span className="text-blue-500">土</span>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((dateStr, index) => {
                  if (!dateStr) return <div key={`e-${index}`} className="h-24 bg-gray-50 rounded-lg"></div>;
                  const matched = requests.find((r) => r.date === dateStr);
                  const dayNum = parseInt(dateStr.split('-')[2], 10);

                  return (
                    <div key={dateStr} className={`h-24 border rounded-lg p-1.5 flex flex-col justify-between ${matched ? 'bg-blue-50/40 border-blue-200' : 'bg-white border-gray-200'}`}>
                      <span className="text-xs font-semibold text-gray-700">{dayNum}</span>
                      {matched ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border text-gray-700 truncate font-medium">
                            {matched.shiftType.includes('早番') ? '早番' : matched.shiftType.includes('遅番') ? '遅番' : '希望休'}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full text-center font-semibold ${
                            matched.status === '承認済み' ? 'bg-green-100 text-green-700' : matched.status === '申請中' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {matched.status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300 text-center my-auto">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};