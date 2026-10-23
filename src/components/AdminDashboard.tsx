import React, { useState } from 'react';
import type { ShiftRequest } from '../types';

interface AdminDashboardProps {
  requests: ShiftRequest[];
  onUpdateStatus: (id: string, status: ShiftRequest['status']) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ requests, onUpdateStatus, onLogout }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch = 
      req.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.date.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // 全体集計
  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === '申請中').length;
  const approvedCount = requests.filter(r => r.status === '承認済み').length;

  const handleExportCSV = () => {
    const headers = ['ID', 'スタッフ名', '希望日', '希望区分', 'ステータス'];
    const rows = filteredRequests.map((req) => [
      req.id,
      `"${req.staffName}"`,
      req.date,
      `"${req.shiftType}"`,
      req.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shift_requests_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6">
        <h1 className="text-xl font-bold text-gray-800">管理者ダッシュボード（シフト承認管理）</h1>
        <button onClick={onLogout} className="text-sm text-red-600 hover:underline font-medium">
          ログアウト
        </button>
      </header>

      {/* 管理者用サマリーカード */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">全申請総数</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalCount} <span className="text-sm font-normal text-gray-500">件</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">要対応（申請中）</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount} <span className="text-sm font-normal text-gray-500">件</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">承認済み</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{approvedCount} <span className="text-sm font-normal text-gray-500">件</span></p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold text-gray-800">全スタッフのシフト希望一覧</h2>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
            <input 
              type="text"
              placeholder="スタッフ名や日付で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-56"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">すべてのステータス</option>
              <option value="申請中">申請中のみ</option>
              <option value="承認済み">承認済みのみ</option>
              <option value="差し戻し">差し戻しのみ</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition flex items-center gap-1.5"
            >
              <span>CSV出力</span>
            </button>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">条件に一致するシフト希望はありません。</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600 text-sm">
                  <th className="py-3 px-4">スタッフ名</th>
                  <th className="py-3 px-4">希望日</th>
                  <th className="py-3 px-4">希望区分</th>
                  <th className="py-3 px-4">ステータス</th>
                  <th className="py-3 px-4 text-center">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{req.staffName}</td>
                    <td className="py-3 px-4 text-gray-600">{req.date}</td>
                    <td className="py-3 px-4 text-gray-600">{req.shiftType}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        req.status === '承認済み' ? 'bg-green-100 text-green-700' :
                        req.status === '申請中' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button 
                        onClick={() => onUpdateStatus(req.id, '承認済み')}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-green-700 transition"
                      >
                        承認
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(req.id, '差し戻し')}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-700 transition"
                      >
                        差し戻し
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};