"use client";

import React, { useEffect, useMemo, useState } from 'react';

const monthlyStats = [
  { month: '1월', inbound: 210, outbound: 132 },
  { month: '2월', inbound: 168, outbound: 118 },
  { month: '3월', inbound: 124, outbound: 96 },
  { month: '4월', inbound: 88, outbound: 62 },
  { month: '5월', inbound: 76, outbound: 48 },
  { month: '6월', inbound: 118, outbound: 81 },
  { month: '7월', inbound: 92, outbound: 74 },
  { month: '8월', inbound: 108, outbound: 86 },
  { month: '9월', inbound: 156, outbound: 112 },
  { month: '10월', inbound: 214, outbound: 164 },
  { month: '11월', inbound: 286, outbound: 208 },
  { month: '12월', inbound: 332, outbound: 246 },
];

const MATERIAL_OPTIONS = [
  { name: '염화칼슘', defaultUnit: '톤' },
  { name: '소금', defaultUnit: '톤' },
  { name: '친환경 제설제', defaultUnit: '톤' },
  { name: '모래', defaultUnit: '톤' },
  { name: '모래주머니', defaultUnit: '개' },
];

type WarehouseRecord = {
  id: string;
  name: string;
  manager: string;
  phone: string;
  material: string;
  total: number;
  unit: string;
};

const initialWarehouses: WarehouseRecord[] = [
  { id: 'WH-01', name: '서초 제3 자재창고', manager: '박물류', phone: '010-1111-2222', material: '염화칼슘', total: 142.5, unit: '톤' },
  { id: 'WH-02', name: '강남 율현 자재창고', manager: '이창고', phone: '010-3333-4444', material: '소금', total: 86.2, unit: '톤' },
  { id: 'WH-03', name: '송파 장지 자재창고', manager: '김재고', phone: '010-5555-6666', material: '친환경 제설제', total: 31.4, unit: '톤' },
  { id: 'WH-04', name: '강동 비상 자재창고', manager: '최보급', phone: '010-7777-8888', material: '모래', total: 58, unit: '톤' },
];

const WAREHOUSE_STORAGE_KEY = 'hannune_stock_warehouses';

const initialStockLogs = [
  { id: 'LOG-101', date: '2026-06-01 10:30', type: '입고', item: '염화칼슘', qty: 50, unit: '톤', manager: '박물류', region: '서초 제3 자재창고' },
  { id: 'LOG-102', date: '2026-06-01 11:15', type: '출고', item: '모래주머니', qty: 200, unit: '개', manager: '김재고', region: '송파 장지 자재창고' },
  { id: 'LOG-103', date: '2026-06-01 13:40', type: '입고', item: '친환경 제설제', qty: 100, unit: '포', manager: '이창고', region: '강남 율현 자재창고' },
  { id: 'LOG-104', date: '2026-06-01 14:20', type: '출고', item: '염화칼슘', qty: 15, unit: '톤', manager: '최보급', region: '강동 비상 자재창고' },
  { id: 'LOG-105', date: '2026-06-01 16:00', type: '요청', item: '모래주머니', qty: 500, unit: '개', manager: '박물류', region: '서초 제3 자재창고' },
];

export default function StockPage() {
  const [currentYear, setCurrentYear] = useState('2026');
  const [stockLogs, setStockLogs] = useState(initialStockLogs);
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>(initialWarehouses);
  const [editingWarehouseId, setEditingWarehouseId] = useState<string | null>(null);
  const [warehouseForm, setWarehouseForm] = useState<WarehouseRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    type: '입고',
    region: initialWarehouses[0].name,
    item: initialWarehouses[0].material,
    qty: 0,
  });

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(WAREHOUSE_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as WarehouseRecord[];
      if (Array.isArray(parsed) && parsed.length > 0) setWarehouses(parsed);
    } catch {
      // 저장 데이터 오류 시 기본값 사용
    }
  }, []);

  const persistWarehouses = (next: WarehouseRecord[]) => {
    setWarehouses(next);
    window.localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(next));
  };

  const handleWarehouseEdit = (warehouse: WarehouseRecord) => {
    setEditingWarehouseId(warehouse.id);
    setWarehouseForm({ ...warehouse });
  };

  const handleWarehouseMaterialChange = (material: string) => {
    const defaultUnit = MATERIAL_OPTIONS.find((item) => item.name === material)?.defaultUnit ?? '톤';
    setWarehouseForm((current) => current ? { ...current, material, unit: defaultUnit } : current);
  };

  const handleWarehouseSave = () => {
    if (!warehouseForm || !editingWarehouseId) return;
    if (warehouseForm.total < 0) {
      window.alert('총 수량은 0 이상이어야 합니다.');
      return;
    }

    persistWarehouses(
      warehouses.map((warehouse) => warehouse.id === editingWarehouseId ? warehouseForm : warehouse),
    );
    setEditingWarehouseId(null);
    setWarehouseForm(null);
  };

  const handleModalChange = (field: string, value: string | number) => {
    if (field === 'region' && typeof value === 'string') {
      const warehouse = warehouses.find((item) => item.name === value);
      setModalForm((current) => ({
        ...current,
        region: value,
        item: warehouse?.material ?? current.item,
      }));
      return;
    }
    setModalForm((current) => ({ ...current, [field]: value }));
  };

  const selectedWarehouse = useMemo(
    () => warehouses.find((item) => item.name === modalForm.region),
    [warehouses, modalForm.region],
  );

  const handleModalSubmit = () => {
    if (modalForm.qty <= 0) {
      window.alert('수량을 1 이상 입력해주세요.');
      return;
    }

    const unit = MATERIAL_OPTIONS.find((item) => item.name === modalForm.item)?.defaultUnit ?? '개';
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      type: modalForm.type,
      item: modalForm.item,
      qty: modalForm.qty,
      unit,
      manager: selectedWarehouse?.manager ?? '시스템 관리자',
      region: modalForm.region,
    };

    setStockLogs([newLog, ...stockLogs]);
    setIsModalOpen(false);
    setModalForm((current) => ({ ...current, qty: 0 }));
  };

  return (
    <main className="flex-1 p-6 max-w-[1800px] w-full mx-auto space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30 shrink-0">
            <span className="text-2xl">📦</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">지역별 재고 통합 관리</h2>
            <p className="text-xs text-slate-500 mt-1">자재 창고별 재고와 입출고 이력을 관리하고 운영 현황을 확인합니다.</p>
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
          <button
            onClick={() => {
              const firstWarehouse = warehouses[0];
              if (firstWarehouse) {
                setModalForm((current) => ({ ...current, region: firstWarehouse.name, item: firstWarehouse.material }));
              }
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95"
          >
            + 수동 입출고 등록
          </button>
        </div>
      </div>

      <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">📊 {currentYear}년 월별 자재 입출고 현황</h3>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded-sm" /> 입고량</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded-sm" /> 출고량</span>
          </div>
        </div>

        <div className="flex items-end justify-between h-56 pt-8 gap-2 border-b border-slate-800 pb-2">
          {monthlyStats.map((stat) => {
            const inHeight = Math.min((stat.inbound / 350) * 100, 100);
            const outHeight = Math.min((stat.outbound / 350) * 100, 100);
            return (
              <div key={stat.month} className="flex flex-col items-center gap-2 flex-1 group min-w-0">
                <div className="flex gap-1.5 w-full justify-center items-end h-full">
                  <div
                    className="relative w-[34%] bg-blue-600 rounded-t-sm transition-all duration-700 group-hover:bg-blue-500 min-w-[10px]"
                    style={{ height: `${inHeight}%` }}
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-black text-blue-300">{stat.inbound}</span>
                  </div>
                  <div
                    className="relative w-[34%] bg-amber-500 rounded-t-sm transition-all duration-700 group-hover:bg-amber-400 min-w-[10px]"
                    style={{ height: `${outHeight}%` }}
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-black text-amber-300">{stat.outbound}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{stat.month}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">🏬 재고 관리</h3>
          <p className="mt-1 text-[10px] text-slate-500">담당자·연락처는 마이페이지에서 관리하고, 자재명과 총 수량은 여기에서 수정합니다.</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full table-fixed text-left text-xs border-collapse">
            <colgroup>
              <col className="w-[23%]" />
              <col className="w-[16%]" />
              <col className="w-[11%]" />
              <col className="w-[20%]" />
              <col className="w-[18%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead className="bg-slate-950 text-slate-500 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">자재 창고명</th>
                <th className="p-3">자재명</th>
                <th className="p-3">담당자</th>
                <th className="p-3">연락처</th>
                <th className="p-3 text-right">총 관리 수량</th>
                <th className="p-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {warehouses.map((warehouse) => {
                const isEditing = editingWarehouseId === warehouse.id && warehouseForm;
                return (
                  <tr key={warehouse.id} className={isEditing ? 'bg-blue-500/5' : 'hover:bg-slate-800/35'}>
                    <td className="p-3 font-black text-slate-200 truncate" title={warehouse.name}>{warehouse.name}</td>
                    <td className="p-3">
                      {isEditing ? (
                        <select
                          value={warehouseForm.material}
                          onChange={(e) => handleWarehouseMaterialChange(e.target.value)}
                          className="w-full rounded-md border border-blue-500 bg-slate-950 px-2 py-1.5 text-xs font-bold text-white outline-none"
                        >
                          {MATERIAL_OPTIONS.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                        </select>
                      ) : (
                        <span className="inline-flex max-w-full rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-black text-blue-300 whitespace-nowrap">{warehouse.material}</span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-slate-300 whitespace-nowrap">{warehouse.manager}</td>
                    <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{warehouse.phone}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={warehouseForm.total}
                            onChange={(e) => setWarehouseForm({ ...warehouseForm, total: Number(e.target.value) })}
                            className="w-24 rounded-md border border-blue-500 bg-slate-950 px-2 py-1.5 text-right font-mono text-xs font-bold text-white outline-none"
                          />
                          <select
                            value={warehouseForm.unit}
                            onChange={(e) => setWarehouseForm({ ...warehouseForm, unit: e.target.value })}
                            className="rounded-md border border-blue-500 bg-slate-950 px-2 py-1.5 text-xs text-white outline-none"
                          >
                            <option value="톤">톤</option>
                            <option value="포">포</option>
                            <option value="개">개</option>
                            <option value="kg">kg</option>
                          </select>
                        </div>
                      ) : (
                        <span className="font-mono text-sm font-black text-blue-300">{warehouse.total.toLocaleString()} {warehouse.unit}</span>
                      )}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex justify-center gap-1.5">
                          <button onClick={handleWarehouseSave} className="rounded-md bg-blue-600 px-2.5 py-1.5 text-[10px] font-black text-white hover:bg-blue-500">저장</button>
                          <button onClick={() => { setEditingWarehouseId(null); setWarehouseForm(null); }} className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-[10px] font-bold text-slate-300 hover:bg-slate-700">취소</button>
                        </div>
                      ) : (
                        <button onClick={() => handleWarehouseEdit(warehouse)} className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-[10px] font-bold text-blue-300 hover:bg-slate-700">수정</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">📝 실시간 입출고 및 요청 로그</h3>
          <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded font-bold">전체 보기</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">일시</th>
                <th className="p-3">구분</th>
                <th className="p-3">자재 창고</th>
                <th className="p-3">자재명</th>
                <th className="p-3 text-right">수량</th>
                <th className="p-3 text-center">담당자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{log.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${log.type === '입고' ? 'bg-blue-950/50 text-blue-400 border-blue-900' : log.type === '출고' ? 'bg-amber-950/50 text-amber-400 border-amber-900' : 'bg-red-950/50 text-red-400 border-red-900'}`}>{log.type}</span>
                  </td>
                  <td className="p-3 text-slate-300 font-bold">{log.region}</td>
                  <td className="p-3 text-slate-300">{log.item}</td>
                  <td className="p-3 text-right font-mono font-black text-slate-200 whitespace-nowrap">{log.type === '출고' ? '-' : '+'}{log.qty} <span className="text-[10px] font-sans text-slate-500 font-normal">{log.unit}</span></td>
                  <td className="p-3 text-center text-slate-400">{log.manager}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2"><span>➕</span> 자재 수동 입출고 등록</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">구분</label>
                <div className="flex gap-2">
                  <button onClick={() => handleModalChange('type', '입고')} className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-colors ${modalForm.type === '입고' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}>입고</button>
                  <button onClick={() => handleModalChange('type', '출고')} className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-colors ${modalForm.type === '출고' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}>출고</button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">자재 창고</label>
                <select value={modalForm.region} onChange={(e) => handleModalChange('region', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-colors">
                  {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.name}>{warehouse.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">자재명</label>
                <select value={modalForm.item} onChange={(e) => handleModalChange('item', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-colors">
                  {MATERIAL_OPTIONS.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">수량</label>
                <input type="number" min="0" value={modalForm.qty === 0 ? '' : modalForm.qty} onChange={(e) => handleModalChange('qty', Number(e.target.value))} placeholder="0" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-colors font-mono" />
              </div>
            </div>

            <div className="bg-slate-950/50 px-6 py-4 border-t border-slate-800 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-lg border border-slate-700 transition-colors text-sm">취소</button>
              <button onClick={handleModalSubmit} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md text-sm">등록 완료</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
