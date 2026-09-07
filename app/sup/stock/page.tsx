"use client";

import { useEffect, useMemo, useState } from 'react';

type MaterialOption = {
  name: string;
  defaultUnit: string;
};

type WarehouseRecord = {
  id: string;
  name: string;
  managerId?: string;
  manager: string;
  phone: string;
  material: string;
  total: number | null;
  unit: string;
};

type ManagerRecord = {
  id: string;
  name: string;
  level?: '일반 담당자' | '창고 담당자';
  role: string;
  dept: string;
  phone: string;
  email: string;
};

type StockLog = {
  id: string;
  date: string;
  type: string;
  item: string;
  qty: number;
  unit: string;
  manager: string;
  region: string;
};

const DEFAULT_MATERIALS: MaterialOption[] = [
  { name: '염화칼슘', defaultUnit: '톤' },
  { name: '소금', defaultUnit: '톤' },
  { name: '친환경 제설제', defaultUnit: '톤' },
  { name: '모래', defaultUnit: '톤' },
  { name: '모래주머니', defaultUnit: '개' },
];

const initialWarehouses: WarehouseRecord[] = [
  { id: 'WH-01', name: '서초 제3 자재창고', manager: '박물류', phone: '010-1111-2222', material: '염화칼슘', total: 142.5, unit: '톤' },
  { id: 'WH-02', name: '강남 율현 자재창고', manager: '이창고', phone: '010-3333-4444', material: '소금', total: 86.2, unit: '톤' },
  { id: 'WH-03', name: '송파 장지 자재창고', manager: '김재고', phone: '010-5555-6666', material: '친환경 제설제', total: 31.4, unit: '톤' },
  { id: 'WH-04', name: '강동 비상 자재창고', manager: '최보급', phone: '010-7777-8888', material: '모래', total: 58, unit: '톤' },
];

const initialManagers: ManagerRecord[] = [
  { id: 'm1', name: '김관제', level: '일반 담당자', role: '상황실장', dept: '종합 상황실', phone: '02-1234-5678', email: 'kims@hannune.go.kr' },
  { id: 'm2', name: '이현장', level: '일반 담당자', role: '현장소장', dept: '강남구청 도로과', phone: '010-2222-3333', email: 'lee@hannune.go.kr' },
  { id: 'm3', name: '박물류', level: '창고 담당자', role: '자재반장', dept: '서초 제3 자재창고', phone: '010-1111-2222', email: 'park@hannune.go.kr' },
];

const initialStockLogs: StockLog[] = [
  { id: 'LOG-101', date: '2026-06-01 10:30', type: '입고', item: '염화칼슘', qty: 50, unit: '톤', manager: '박물류', region: '서초 제3 자재창고' },
  { id: 'LOG-102', date: '2026-06-01 11:15', type: '출고', item: '모래주머니', qty: 200, unit: '개', manager: '김재고', region: '송파 장지 자재창고' },
  { id: 'LOG-103', date: '2026-06-01 13:40', type: '입고', item: '친환경 제설제', qty: 100, unit: '포', manager: '이창고', region: '강남 율현 자재창고' },
  { id: 'LOG-104', date: '2026-06-01 14:20', type: '출고', item: '염화칼슘', qty: 15, unit: '톤', manager: '최보급', region: '강동 비상 자재창고' },
  { id: 'LOG-105', date: '2026-06-01 16:00', type: '요청', item: '모래주머니', qty: 500, unit: '개', manager: '박물류', region: '서초 제3 자재창고' },
];

const WAREHOUSE_STORAGE_KEY = 'hannune_stock_warehouses';
const MATERIAL_STORAGE_KEY = 'hannune_stock_materials';
const STOCK_LOG_STORAGE_KEY = 'hannune_stock_logs';
const MANAGER_STORAGE_KEY = 'hannune_support_managers';

function normalizeWarehouses(value: unknown): WarehouseRecord[] {
  if (!Array.isArray(value)) return initialWarehouses;

  return value.map((item) => {
    const raw = item as Partial<WarehouseRecord> & { total?: number | string | null };
    const parsedTotal = raw.total === null || raw.total === undefined || raw.total === ''
      ? null
      : Number.parseFloat(String(raw.total));

    return {
      id: raw.id ?? `WH-${Date.now()}-${Math.random()}`,
      name: raw.name ?? '미지정 자재창고',
      managerId: raw.managerId,
      manager: raw.manager ?? '',
      phone: raw.phone ?? '',
      material: raw.material ?? '',
      total: Number.isFinite(parsedTotal) ? parsedTotal : null,
      unit: raw.unit ?? '톤',
    };
  });
}

export default function StockPage() {
  const [currentYear, setCurrentYear] = useState('2026');
  const [stockLogs, setStockLogs] = useState<StockLog[]>(initialStockLogs);
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>(initialWarehouses);
  const [materials, setMaterials] = useState<MaterialOption[]>(DEFAULT_MATERIALS);
  const [managers, setManagers] = useState<ManagerRecord[]>(initialManagers);

  const [editingWarehouseId, setEditingWarehouseId] = useState<string | null>(null);
  const [warehouseForm, setWarehouseForm] = useState<WarehouseRecord | null>(null);
  const [isWarehouseAddOpen, setIsWarehouseAddOpen] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({
    name: '',
    managerId: '',
    material: '',
    total: '',
    unit: '톤',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    type: '입고',
    region: initialWarehouses[0].name,
    item: initialWarehouses[0].material,
    qty: 0,
  });

  useEffect(() => {
    try {
      const savedWarehouses = window.localStorage.getItem(WAREHOUSE_STORAGE_KEY);
      if (savedWarehouses) {
        const parsed = JSON.parse(savedWarehouses);
        const normalized = normalizeWarehouses(parsed);
        if (normalized.length > 0) setWarehouses(normalized);
      }

      const savedMaterials = window.localStorage.getItem(MATERIAL_STORAGE_KEY);
      if (savedMaterials) {
        const parsed = JSON.parse(savedMaterials) as MaterialOption[];
        if (Array.isArray(parsed) && parsed.length > 0) setMaterials(parsed);
      }

      const savedLogs = window.localStorage.getItem(STOCK_LOG_STORAGE_KEY);
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs) as StockLog[];
        if (Array.isArray(parsed)) setStockLogs(parsed);
      }

      const savedManagers = window.localStorage.getItem(MANAGER_STORAGE_KEY);
      if (savedManagers) {
        const parsed = JSON.parse(savedManagers) as ManagerRecord[];
        if (Array.isArray(parsed) && parsed.length > 0) setManagers(parsed);
      }
    } catch {
      // 저장 데이터가 손상된 경우 프로토타입 기본값을 사용합니다.
    }
  }, []);

  const persistWarehouses = (next: WarehouseRecord[]) => {
    setWarehouses(next);
    window.localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(next));
  };

  const persistLogs = (next: StockLog[]) => {
    setStockLogs(next);
    window.localStorage.setItem(STOCK_LOG_STORAGE_KEY, JSON.stringify(next));
  };

  const warehouseManagers = useMemo(
    () => managers.filter((manager) => manager.level === '창고 담당자'),
    [managers],
  );

  const monthlyStats = useMemo(() => {
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const month = String(monthIndex + 1).padStart(2, '0');
      const prefix = `${currentYear}-${month}`;
      const monthlyLogs = stockLogs.filter((log) => log.date.startsWith(prefix));
      return {
        month: `${monthIndex + 1}월`,
        inbound: monthlyLogs
          .filter((log) => log.type === '입고')
          .reduce((sum, log) => sum + Number(log.qty || 0), 0),
        outbound: monthlyLogs
          .filter((log) => log.type === '출고')
          .reduce((sum, log) => sum + Number(log.qty || 0), 0),
      };
    });
  }, [stockLogs, currentYear]);

  const chartMax = useMemo(
    () => Math.max(1, ...monthlyStats.flatMap((stat) => [stat.inbound, stat.outbound])),
    [monthlyStats],
  );

  const addCustomMaterial = () => {
    const rawName = window.prompt('신규 자재명을 입력해 주세요.');
    const name = rawName?.trim();
    if (!name) return null;

    const existing = materials.find((item) => item.name === name);
    if (existing) return existing;

    const rawUnit = window.prompt('기본 단위를 입력해 주세요. (예: 톤, 포, 개, kg)', '톤');
    const defaultUnit = rawUnit?.trim() || '톤';
    const newMaterial = { name, defaultUnit };
    const next = [...materials, newMaterial];
    setMaterials(next);
    window.localStorage.setItem(MATERIAL_STORAGE_KEY, JSON.stringify(next));
    return newMaterial;
  };

  const handleWarehouseEdit = (warehouse: WarehouseRecord) => {
    setEditingWarehouseId(warehouse.id);
    setWarehouseForm({ ...warehouse });
  };

  const handleWarehouseMaterialChange = (value: string) => {
    if (value === '__new__') {
      const added = addCustomMaterial();
      if (added) {
        setWarehouseForm((current) => current ? { ...current, material: added.name, unit: added.defaultUnit } : current);
      }
      return;
    }

    const defaultUnit = materials.find((item) => item.name === value)?.defaultUnit ?? '톤';
    setWarehouseForm((current) => current ? { ...current, material: value, unit: defaultUnit } : current);
  };

  const handleWarehouseSave = () => {
    if (!warehouseForm || !editingWarehouseId) return;
    if (warehouseForm.total !== null && warehouseForm.total < 0) {
      window.alert('총 수량은 0 이상이어야 합니다.');
      return;
    }

    persistWarehouses(
      warehouses.map((warehouse) => warehouse.id === editingWarehouseId ? warehouseForm : warehouse),
    );
    setEditingWarehouseId(null);
    setWarehouseForm(null);
  };

  const handleNewWarehouseManagerChange = (managerId: string) => {
    setNewWarehouse((current) => ({ ...current, managerId }));
  };

  const handleNewWarehouseMaterialChange = (value: string) => {
    if (value === '__new__') {
      const added = addCustomMaterial();
      if (added) {
        setNewWarehouse((current) => ({ ...current, material: added.name, unit: added.defaultUnit }));
      }
      return;
    }

    const defaultUnit = materials.find((item) => item.name === value)?.defaultUnit ?? '톤';
    setNewWarehouse((current) => ({ ...current, material: value, unit: defaultUnit }));
  };

  const handleAddWarehouse = () => {
    const name = newWarehouse.name.trim();
    if (!name) {
      window.alert('자재 창고명을 입력해 주세요.');
      return;
    }
    if (warehouses.some((warehouse) => warehouse.name === name)) {
      window.alert('같은 이름의 자재 창고가 이미 등록되어 있습니다.');
      return;
    }

    const manager = warehouseManagers.find((item) => item.id === newWarehouse.managerId);
    const total = newWarehouse.total.trim() === '' ? null : Number(newWarehouse.total);
    if (total !== null && (!Number.isFinite(total) || total < 0)) {
      window.alert('총 관리 수량을 올바르게 입력해 주세요.');
      return;
    }

    const nextWarehouse: WarehouseRecord = {
      id: `WH-${Date.now()}`,
      name,
      managerId: manager?.id,
      manager: manager?.name ?? '',
      phone: manager?.phone ?? '',
      material: newWarehouse.material,
      total,
      unit: newWarehouse.unit,
    };

    persistWarehouses([...warehouses, nextWarehouse]);
    setNewWarehouse({ name: '', managerId: '', material: '', total: '', unit: '톤' });
    setIsWarehouseAddOpen(false);
  };

  const handleModalChange = (field: string, value: string | number) => {
    if (field === 'region' && typeof value === 'string') {
      const warehouse = warehouses.find((item) => item.name === value);
      setModalForm((current) => ({
        ...current,
        region: value,
        item: warehouse?.material || current.item,
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

    const unit = materials.find((item) => item.name === modalForm.item)?.defaultUnit ?? selectedWarehouse?.unit ?? '개';
    const newLog: StockLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('sv-SE', { hour12: false }).slice(0, 16),
      type: modalForm.type,
      item: modalForm.item,
      qty: modalForm.qty,
      unit,
      manager: selectedWarehouse?.manager || '시스템 관리자',
      region: modalForm.region,
    };

    persistLogs([newLog, ...stockLogs]);

    if (selectedWarehouse && selectedWarehouse.total !== null && ['입고', '출고'].includes(modalForm.type)) {
      const delta = modalForm.type === '입고' ? modalForm.qty : -modalForm.qty;
      persistWarehouses(
        warehouses.map((warehouse) =>
          warehouse.id === selectedWarehouse.id
            ? { ...warehouse, total: Math.max(0, (warehouse.total ?? 0) + delta) }
            : warehouse,
        ),
      );
    }

    setIsModalOpen(false);
    setModalForm((current) => ({ ...current, qty: 0 }));
  };

  return (
    <main className="relative mx-auto w-full max-w-[1900px] flex-1 space-y-6 p-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-600/20">
            <span className="text-2xl">📦</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">지역별 재고 통합 관리</h2>
            <p className="mt-1 text-xs text-slate-500">자재 창고별 재고와 입출고 이력을 관리하고 운영 현황을 확인합니다.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-200 outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="2026">2026년</option>
            <option value="2025">2025년</option>
          </select>
          <button
            onClick={() => {
              const firstWarehouse = warehouses[0];
              if (!firstWarehouse) {
                window.alert('먼저 자재 창고를 등록해 주세요.');
                return;
              }
              setModalForm((current) => ({
                ...current,
                region: firstWarehouse.name,
                item: firstWarehouse.material || materials[0]?.name || '',
              }));
              setIsModalOpen(true);
            }}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all hover:bg-blue-500 active:scale-95"
          >
            + 수동 입출고 등록
          </button>
        </div>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">📊 {currentYear}년 월별 자재 입출고 현황</h3>
            <p className="mt-1 text-[10px] text-slate-500">아래 입출고 기록의 입고·출고 수량을 월별로 자동 합산합니다.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="h-3 w-3 rounded-sm bg-blue-600" /> 입고량</span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="h-3 w-3 rounded-sm bg-amber-500" /> 출고량</span>
          </div>
        </div>

        <div className="grid h-60 grid-cols-12 gap-2 border-b border-slate-800 px-1 pt-5">
          {monthlyStats.map((stat) => {
            const inboundHeight = stat.inbound === 0 ? 0 : Math.max(8, Math.round((stat.inbound / chartMax) * 100));
            const outboundHeight = stat.outbound === 0 ? 0 : Math.max(8, Math.round((stat.outbound / chartMax) * 100));

            return (
              <div key={stat.month} className="flex min-w-0 flex-col items-center">
                <div className="flex min-h-0 w-full flex-1 items-end justify-center gap-1.5">
                  <div className="flex h-full w-[34%] min-w-[12px] items-end">
                    <div
                      className="relative w-full rounded-t-md bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.18)] transition-all duration-500 hover:bg-blue-500"
                      style={{ height: `${inboundHeight}%` }}
                    >
                      {stat.inbound > 0 && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-black text-blue-300">{stat.inbound}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex h-full w-[34%] min-w-[12px] items-end">
                    <div
                      className="relative w-full rounded-t-md bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.14)] transition-all duration-500 hover:bg-amber-400"
                      style={{ height: `${outboundHeight}%` }}
                    >
                      {stat.outbound > 0 && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-black text-amber-300">{stat.outbound}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="mt-3 whitespace-nowrap text-xs font-black tracking-normal text-slate-400">{stat.month}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">🏬 재고 관리</h3>
            <p className="mt-1 text-[10px] text-slate-500">담당자·연락처는 마이페이지에서 관리하고, 자재명과 총 관리 수량은 여기에서 수정합니다.</p>
          </div>
          <button
            onClick={() => setIsWarehouseAddOpen(true)}
            className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-black text-blue-300 transition hover:bg-blue-500/15"
          >
            + 자재 창고 추가
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full table-fixed border-collapse text-left text-xs">
            <colgroup>
              <col className="w-[23%]" />
              <col className="w-[16%]" />
              <col className="w-[11%]" />
              <col className="w-[20%]" />
              <col className="w-[18%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead className="border-b border-slate-800 bg-slate-950 font-bold text-slate-500">
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
                    <td className="truncate p-3 font-black text-slate-200" title={warehouse.name}>{warehouse.name}</td>
                    <td className="p-3">
                      {isEditing ? (
                        <select
                          value={warehouseForm.material}
                          onChange={(e) => handleWarehouseMaterialChange(e.target.value)}
                          className="w-full rounded-md border border-blue-500 bg-slate-950 px-2 py-1.5 text-xs font-bold text-white outline-none"
                        >
                          <option value="">미설정</option>
                          {materials.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                          <option value="__new__">+ 신규 자재 등록</option>
                        </select>
                      ) : (
                        warehouse.material ? (
                          <span className="inline-flex max-w-full whitespace-nowrap rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-black text-blue-300">{warehouse.material}</span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-600">미설정</span>
                        )
                      )}
                    </td>
                    <td className="whitespace-nowrap p-3 font-bold text-slate-300">{warehouse.manager || '-'}</td>
                    <td className="whitespace-nowrap p-3 font-mono text-slate-500">{warehouse.phone || '-'}</td>
                    <td className="whitespace-nowrap p-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={warehouseForm.total ?? ''}
                            onChange={(e) => setWarehouseForm({ ...warehouseForm, total: e.target.value === '' ? null : Number(e.target.value) })}
                            className="w-24 rounded-md border border-blue-500 bg-slate-950 px-2 py-1.5 text-right font-mono text-xs font-bold text-white outline-none"
                            placeholder="미입력"
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
                      ) : warehouse.total === null ? (
                        <span className="text-[10px] font-bold text-amber-300">미입력</span>
                      ) : (
                        <span className="font-mono text-sm font-black text-blue-300">{warehouse.total.toLocaleString()} {warehouse.unit}</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
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

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">📝 실시간 입출고 및 요청 로그</h3>
            <p className="mt-1 text-[10px] text-slate-500">입고와 출고 기록은 위 월별 그래프에 즉시 반영됩니다.</p>
          </div>
          <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-400">전체 보기</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 font-bold text-slate-400">
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
                <tr key={log.id} className="transition-colors hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-500">{log.date}</td>
                  <td className="p-3">
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${log.type === '입고' ? 'border-blue-900 bg-blue-950/50 text-blue-400' : log.type === '출고' ? 'border-amber-900 bg-amber-950/50 text-amber-400' : 'border-red-900 bg-red-950/50 text-red-400'}`}>{log.type}</span>
                  </td>
                  <td className="p-3 font-bold text-slate-300">{log.region}</td>
                  <td className="p-3 text-slate-300">{log.item}</td>
                  <td className="p-3 text-right font-mono font-black text-slate-200">{log.type === '출고' ? '-' : log.type === '입고' ? '+' : ''}{log.qty} <span className="font-sans text-[10px] font-normal text-slate-500">{log.unit}</span></td>
                  <td className="p-3 text-center text-slate-400">{log.manager}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isWarehouseAddOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
              <div>
                <h3 className="font-black text-white">자재 창고 추가</h3>
                <p className="mt-1 text-[10px] text-slate-500">창고 담당자는 마이페이지에서 등록한 담당자를 선택합니다.</p>
              </div>
              <button onClick={() => setIsWarehouseAddOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-500">자재 창고명</label>
                <input value={newWarehouse.name} onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })} placeholder="예: 유성 제1 자재창고" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-500">창고 담당자</label>
                <select value={newWarehouse.managerId} onChange={(e) => handleNewWarehouseManagerChange(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500">
                  <option value="">담당자 미지정</option>
                  {warehouseManagers.map((manager) => <option key={manager.id} value={manager.id}>{manager.name} · {manager.dept}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-500">자재명</label>
                <select value={newWarehouse.material} onChange={(e) => handleNewWarehouseMaterialChange(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500">
                  <option value="">미설정</option>
                  {materials.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                  <option value="__new__">+ 신규 자재 등록</option>
                </select>
              </div>

              <div className="grid grid-cols-[1fr_110px] gap-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-500">총 관리 수량</label>
                  <input type="number" min="0" step="0.1" value={newWarehouse.total} onChange={(e) => setNewWarehouse({ ...newWarehouse, total: e.target.value })} placeholder="비워둘 수 있습니다" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-500">단위</label>
                  <select value={newWarehouse.unit} onChange={(e) => setNewWarehouse({ ...newWarehouse, unit: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500">
                    <option value="톤">톤</option>
                    <option value="포">포</option>
                    <option value="개">개</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-800 bg-slate-950/50 px-6 py-4">
              <button onClick={() => setIsWarehouseAddOpen(false)} className="flex-1 rounded-lg border border-slate-700 bg-slate-800 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-700">취소</button>
              <button onClick={handleAddWarehouse} className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-black text-white hover:bg-blue-500">창고 등록</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
              <h3 className="flex items-center gap-2 font-bold text-white"><span>➕</span> 자재 수동 입출고 등록</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 transition-colors hover:text-white">✕</button>
            </div>

            <div className="space-y-5 p-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">구분</label>
                <div className="flex gap-2">
                  <button onClick={() => handleModalChange('type', '입고')} className={`flex-1 rounded-lg border py-2 text-sm font-bold transition-colors ${modalForm.type === '입고' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'}`}>입고</button>
                  <button onClick={() => handleModalChange('type', '출고')} className={`flex-1 rounded-lg border py-2 text-sm font-bold transition-colors ${modalForm.type === '출고' ? 'border-amber-500 bg-amber-600 text-white' : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'}`}>출고</button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">자재 창고</label>
                <select value={modalForm.region} onChange={(e) => handleModalChange('region', e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-bold text-slate-200 outline-none transition-colors focus:border-blue-500">
                  {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.name}>{warehouse.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">자재명</label>
                <select value={modalForm.item} onChange={(e) => handleModalChange('item', e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-bold text-slate-200 outline-none transition-colors focus:border-blue-500">
                  {materials.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">수량</label>
                <input type="number" min="0" value={modalForm.qty === 0 ? '' : modalForm.qty} onChange={(e) => handleModalChange('qty', Number(e.target.value))} placeholder="0" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm font-bold text-slate-200 outline-none transition-colors focus:border-blue-500" />
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-800 bg-slate-950/50 px-6 py-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 rounded-lg border border-slate-700 bg-slate-800 py-2.5 text-sm font-bold text-slate-300 transition-colors hover:bg-slate-700">취소</button>
              <button onClick={handleModalSubmit} className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-blue-500">등록 완료</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
