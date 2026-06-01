"use client";

import React, { useState } from 'react';

// 1. 샘플 데이터: 월별 통계
const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
  month: `${i + 1}월`,
  inbound: Math.floor(Math.random() * 300) + 50,
  outbound: Math.floor(Math.random() * 250) + 20,
}));

// 2. 샘플 데이터: 지역별 재고 담당자 리스트
const inventoryManagers = [
  { id: 'M-01', region: '서초 제3저장소', name: '박물류', phone: '010-1111-2222', status: '정상' },
  { id: 'M-02', region: '강남 대기소', name: '이창고', phone: '010-3333-4444', status: '휴가' },
  { id: 'M-03', region: '송파 오륜사거리', name: '김재고', phone: '010-5555-6666', status: '정상' },
  { id: 'M-04', region: '강동 비상거점', name: '최보급', phone: '010-7777-8888', status: '정상' },
];

// 3. 샘플 데이터: 실시간 입출고 로그 (상태로 관리하기 위해 초기값으로 사용)
const initialStockLogs = [
  { id: 'LOG-101', date: '2026-06-01 10:30', type: '입고', item: '염화칼슘', qty: 50, unit: '톤', manager: '박물류', region: '서초 제3저장소' },
  { id: 'LOG-102', date: '2026-06-01 11:15', type: '출고', item: '모래주머니', qty: 200, unit: '개', manager: '김재고', region: '송파 오륜사거리' },
  { id: 'LOG-103', date: '2026-06-01 13:40', type: '입고', item: '친환경 제설제', qty: 100, unit: '포', manager: '이창고', region: '강남 대기소' },
  { id: 'LOG-104', date: '2026-06-01 14:20', type: '출고', item: '염화칼슘', qty: 15, unit: '톤', manager: '최보급', region: '강동 비상거점' },
  { id: 'LOG-105', date: '2026-06-01 16:00', type: '요청', item: '모래주머니', qty: 500, unit: '개', manager: '박물류', region: '서초 제3저장소' },
];

export default function StockPage() {
  const [currentYear, setCurrentYear] = useState('2026');
  
  // 💡 실시간 반영을 위해 로그 리스트를 상태(State)로 변경
  const [stockLogs, setStockLogs] = useState(initialStockLogs);

  // 💡 수동 입출고 팝업 관리를 위한 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    type: '입고',
    region: '서초 제3저장소',
    item: '염화칼슘',
    qty: 0,
  });

  // 💡 팝업 폼 입력 핸들러
  const handleModalChange = (field: string, value: string | number) => {
    setModalForm({ ...modalForm, [field]: value });
  };

  // 💡 등록 완료 핸들러
  const handleModalSubmit = () => {
    if (modalForm.qty <= 0) {
      alert('수량을 1 이상 입력해주세요.');
      return;
    }

    // 자재별 단위 자동 매핑
    let unit = '개';
    if (modalForm.item === '염화칼슘') unit = '톤';
    if (modalForm.item === '친환경 제설제') unit = '포';

    // 새로운 로그 객체 생성
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      type: modalForm.type,
      item: modalForm.item,
      qty: modalForm.qty,
      unit: unit,
      manager: '시스템 관리자', // 현재 로그인한 계정 이름으로 가정
      region: modalForm.region,
    };

    // 기존 로그 배열의 맨 앞에 새 로그 추가
    setStockLogs([newLog, ...stockLogs]);
    
    // 팝업 닫기 및 초기화
    setIsModalOpen(false);
    setModalForm({ ...modalForm, qty: 0 });
  };

  return (
    <main className="flex-1 p-6 max-w-[1800px] w-full mx-auto space-y-6 animate-in fade-in duration-500 relative">
      
      {/* 타이틀 및 상단 컨트롤 */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30 shrink-0">
            <span className="text-2xl">📦</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">지역별 재고 통합 관리</h2>
            <p className="text-xs text-slate-500 mt-1">
              각 거점의 재고 입출고 현황과 담당자별 요청 사항을 실시간으로 추적합니다.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={currentYear}
            onChange={(e) => setCurrentYear(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm font-bold text-slate-200 outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="2026">2026년</option>
            <option value="2025">2025년</option>
          </select>
          {/* 💡 팝업 열기 버튼에 onClick 이벤트 연결 */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95"
          >
            + 수동 입출고 등록
          </button>
        </div>
      </div>

      {/* 1. 상단: 월별 재고 입출고 통계 (막대형 그래프) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          📊 {currentYear}년 월별 자재 입출고 트렌드
        </h3>
        
        <div className="flex items-end justify-between h-48 pt-4 gap-2 border-b border-slate-800 pb-2">
          {monthlyStats.map((stat, idx) => {
            const inHeight = Math.min((stat.inbound / 350) * 100, 100);
            const outHeight = Math.min((stat.outbound / 350) * 100, 100);

            return (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="flex gap-1 w-full justify-center items-end h-full">
                  <div 
                    className="w-1/3 bg-blue-600 rounded-t-sm transition-all duration-700 relative group-hover:bg-blue-500"
                    style={{ height: `${inHeight}%` }}
                    title={`입고: ${stat.inbound}`}
                  ></div>
                  <div 
                    className="w-1/3 bg-amber-500 rounded-t-sm transition-all duration-700 relative group-hover:bg-amber-400"
                    style={{ height: `${outHeight}%` }}
                    title={`출고: ${stat.outbound}`}
                  ></div>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{stat.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-4">
          <span className="text-[10px] text-slate-400 flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded-sm"></div> 입고량</span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded-sm"></div> 출고량</span>
        </div>
      </div>

      {/* 하단 2단 그리드 분할 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. 좌측: 지역별 재고 담당자 리스트 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">👨‍💼 지역별 재고 담당자</h3>
            <button className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 transition-colors">관리</button>
          </div>
          
          <div className="flex flex-col gap-3">
            {inventoryManagers.map(mgr => (
              <div key={mgr.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex justify-between items-center hover:border-blue-500/50 transition-colors cursor-pointer group">
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400">{mgr.region}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{mgr.name} | {mgr.phone}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${mgr.status === '정상' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900' : 'bg-red-950/50 text-red-400 border border-red-900'}`}>
                  {mgr.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 우측: 실시간 입출고 등록 및 로그 */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">📝 실시간 입출고 및 요청 로그</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded font-bold">전체 보기</span>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-slate-800 h-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">일시</th>
                  <th className="p-3">구분</th>
                  <th className="p-3">거점</th>
                  <th className="p-3">자재명</th>
                  <th className="p-3 text-right">수량</th>
                  <th className="p-3 text-center">담당자</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stockLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono text-slate-500">{log.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.type === '입고' ? 'bg-blue-950/50 text-blue-400 border-blue-900' :
                        log.type === '출고' ? 'bg-amber-950/50 text-amber-400 border-amber-900' :
                        'bg-red-950/50 text-red-400 border-red-900'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-bold">{log.region}</td>
                    <td className="p-3 text-slate-300">{log.item}</td>
                    <td className="p-3 text-right font-mono font-black text-slate-200">
                      {log.type === '출고' ? '-' : '+'}{log.qty} <span className="text-[10px] font-sans text-slate-500 font-normal">{log.unit}</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">{log.manager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 💡 수동 입출고 팝업 (모달) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            
            {/* 팝업 헤더 */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                <span>➕</span> 자재 수동 입출고 등록
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 팝업 바디 (입력 폼) */}
            <div className="p-6 space-y-5">
              
              {/* 구분 선택 */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">구분</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleModalChange('type', '입고')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-colors ${modalForm.type === '입고' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                  >
                    입고
                  </button>
                  <button 
                    onClick={() => handleModalChange('type', '출고')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-colors ${modalForm.type === '출고' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                  >
                    출고
                  </button>
                </div>
              </div>

              {/* 지역 선택 */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">대상 지역 (거점)</label>
                <select 
                  value={modalForm.region}
                  onChange={(e) => handleModalChange('region', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="서초 제3저장소">서초 제3저장소</option>
                  <option value="강남 대기소">강남 대기소</option>
                  <option value="송파 오륜사거리">송파 오륜사거리</option>
                  <option value="강동 비상거점">강동 비상거점</option>
                </select>
              </div>

              {/* 자재 선택 */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">자재명</label>
                <select 
                  value={modalForm.item}
                  onChange={(e) => handleModalChange('item', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="염화칼슘">염화칼슘 (단위: 톤)</option>
                  <option value="친환경 제설제">친환경 제설제 (단위: 포)</option>
                  <option value="모래주머니">모래주머니 (단위: 개)</option>
                </select>
              </div>

              {/* 수량 입력 */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">수량</label>
                <input 
                  type="number"
                  min="0"
                  value={modalForm.qty === 0 ? '' : modalForm.qty}
                  onChange={(e) => handleModalChange('qty', Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-colors font-mono"
                />
              </div>

            </div>

            {/* 팝업 푸터 (버튼) */}
            <div className="bg-slate-950/50 px-6 py-4 border-t border-slate-800 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-lg border border-slate-700 transition-colors text-sm"
              >
                취소
              </button>
              <button 
                onClick={handleModalSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md text-sm"
              >
                등록 완료
              </button>
            </div>
            
          </div>
        </div>
      )}

    </main>
  );
}