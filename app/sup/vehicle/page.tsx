"use client";

import React, { useState } from 'react';

// 💡 초기 샘플 데이터
const initialVehicles = [
  { id: '01호', order: 1, icon: '🚜', name: '제설 1호기', plate: '88바 1001', type: '관용', driver: '최긴급', phone: '010-1234-5671', termId: 'GPS-T01', serial: 'SN-99812A' },
  { id: '02호', order: 2, icon: '🚛', name: '제설 2호기', plate: '88바 1002', type: '관용', driver: '박대기', phone: '010-1234-5672', termId: 'GPS-T02', serial: 'SN-99813B' },
  { id: '03호', order: 3, icon: '🚙', name: '제설 3호기', plate: '88바 1003', type: '임대', driver: '이방빙', phone: '010-1234-5673', termId: 'GPS-T03', serial: 'SN-99814C' },
  { id: '04호', order: 4, icon: '🚜', name: '제설 4호기', plate: '88바 1004', type: '임대', driver: '김제설', phone: '010-1234-5674', termId: 'GPS-T04', serial: 'SN-99815D' },
  { id: '05호', order: 5, icon: '🚛', name: '제설 5호기', plate: '88바 1005', type: '관용', driver: '홍길동', phone: '010-1234-5675', termId: 'GPS-T05', serial: 'SN-99816E' },
];

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  
  // 💡 검색 상태 관리 추가
  const [searchTerm, setSearchTerm] = useState("");

  const handleEditClick = (car: any) => {
    setEditingId(car.id);
    setEditFormData({ ...car });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditFormData({ ...editFormData, [field]: value });
  };

  const handleSaveClick = () => {
    setVehicles(vehicles.map(car => (car.id === editingId ? editFormData : car)));
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('정말로 이 차량 정보를 삭제하시겠습니까?')) {
      setVehicles(vehicles.filter(car => car.id !== id));
    }
  };

  // 💡 검색어 필터링 로직 추가 (차량명, 번호, 운전자, ID 동시 검색)
  const filteredVehicles = vehicles.filter(car => 
    car.name.includes(searchTerm) ||
    car.plate.includes(searchTerm) ||
    car.driver.includes(searchTerm) ||
    car.id.includes(searchTerm)
  );

  // 필터링된 결과물에 순서(order) 오름차순 정렬 적용
  const sortedVehicles = [...filteredVehicles].sort((a, b) => a.order - b.order);

  return (
    <main className="flex-1 p-6 max-w-[1800px] w-full mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* 1. 상단 타이틀 및 검색/등록 영역 */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30 shrink-0">
            <span className="text-2xl">🚜</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              제설 차량 및 단말기 관리
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              차량 정보 및 표출 순서를 수정하려면 우측의 [수정] 버튼을 클릭하세요.
            </p>
          </div>
        </div>
        
        {/* 💡 검색창 UI 파트 추가 */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="차량명, 번호, 운전자 검색..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 transition-all w-64 shadow-inner"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95 shrink-0">
            + 신규 차량 등록
          </button>
        </div>
      </div>

      {/* 2. 차량 정보 리스트 테이블 */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3 w-16 text-center">순서</th>
                <th className="p-3 w-16 text-center">아이콘</th>
                <th className="p-3 w-20">ID (호수)</th>
                <th className="p-3 w-32">차량명</th>
                <th className="p-3 w-28">차량번호</th>
                <th className="p-3 w-20">구분</th>
                <th className="p-3 w-24">운전자명</th>
                <th className="p-3 w-32">연락처</th>
                <th className="p-3 w-28">단말기번호</th>
                <th className="p-3 w-32">일련번호(S/N)</th>
                <th className="p-3 w-32 text-center bg-slate-900">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {sortedVehicles.length > 0 ? (
                sortedVehicles.map((car) => {
                  const isEditing = editingId === car.id;
                  
                  return (
                    <tr key={car.id} className={`transition-colors ${isEditing ? 'bg-blue-900/20' : 'hover:bg-slate-800/40 group'}`}>
                      <td className="p-3 text-center">
                        {isEditing ? (
                          <input type="number" value={editFormData.order} onChange={(e) => handleInputChange('order', Number(e.target.value))} className="w-12 bg-slate-950 border border-blue-500 rounded px-1 py-1 text-center text-white outline-none" />
                        ) : (
                          <span className="font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">{car.order}</span>
                        )}
                      </td>
                      <td className="p-3 text-center text-lg">
                        {isEditing ? (
                          <select value={editFormData.icon} onChange={(e) => handleInputChange('icon', e.target.value)} className="bg-slate-950 border border-blue-500 rounded px-1 py-1 outline-none text-base">
                            <option value="🚜">🚜</option>
                            <option value="🚛">🚛</option>
                            <option value="🚙">🚙</option>
                          </select>
                        ) : (
                          car.icon
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-500">{car.id}</td>
                      <td className="p-3">
                        {isEditing ? (
                          <input type="text" value={editFormData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none font-bold" />
                        ) : (
                          <span className="font-bold text-slate-200">{car.name}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <input type="text" value={editFormData.plate} onChange={(e) => handleInputChange('plate', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none" />
                        ) : (
                          <span className="font-mono text-slate-300">{car.plate}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <select value={editFormData.type} onChange={(e) => handleInputChange('type', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none">
                            <option value="관용">관용</option>
                            <option value="임대">임대</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border ${car.type === '관용' ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900' : 'bg-amber-950/50 text-amber-400 border-amber-900'}`}>
                            {car.type}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <input type="text" value={editFormData.driver} onChange={(e) => handleInputChange('driver', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none" />
                        ) : (
                          <span className="text-slate-300 font-bold">{car.driver}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <input type="text" value={editFormData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none font-mono" />
                        ) : (
                          <span className="font-mono text-slate-400">{car.phone}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <input type="text" value={editFormData.termId} onChange={(e) => handleInputChange('termId', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none font-mono" />
                        ) : (
                          <span className="font-mono text-blue-400 font-bold">{car.termId}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <input type="text" value={editFormData.serial} onChange={(e) => handleInputChange('serial', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none font-mono text-[10px]" />
                        ) : (
                          <span className="font-mono text-slate-500 text-[10px]">{car.serial}</span>
                        )}
                      </td>
                      <td className="p-3 text-center bg-slate-900/30">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={handleSaveClick} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded text-[10px] transition-colors">저장</button>
                            <button onClick={handleCancelClick} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-2 py-1 rounded text-[10px] transition-colors">취소</button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(car)} className="bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 font-bold px-2.5 py-1 rounded text-[10px] transition-colors">수정</button>
                            <button onClick={() => handleDeleteClick(car.id)} className="bg-slate-800 hover:bg-red-900/30 text-slate-500 hover:text-red-400 border border-slate-700 font-bold px-2.5 py-1 rounded text-[10px] transition-colors">삭제</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="p-10 text-center text-slate-500 font-bold">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}