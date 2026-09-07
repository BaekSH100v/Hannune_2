"use client";

import { useEffect, useState } from 'react';

type ManagerLevel = '일반 담당자' | '창고 담당자';

type ManagerRecord = {
  id: string;
  name: string;
  level: ManagerLevel;
  role: string;
  dept: string;
  phone: string;
  email: string;
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

const initialProfile = {
  name: '제설담당자',
  role: '총괄 관리자',
  department: '종합 관제 상황실',
  phone: '010-9999-8888',
  email: 'admin@hannune.go.kr',
};

const initialManagers: ManagerRecord[] = [
  { id: 'm1', name: '김관제', level: '일반 담당자', role: '상황실장', dept: '종합 상황실', phone: '02-1234-5678', email: 'kims@hannune.go.kr' },
  { id: 'm2', name: '이현장', level: '일반 담당자', role: '현장소장', dept: '강남구청 도로과', phone: '010-2222-3333', email: 'lee@hannune.go.kr' },
  { id: 'm3', name: '박물류', level: '창고 담당자', role: '자재반장', dept: '서초 제3 자재창고', phone: '010-1111-2222', email: 'park@hannune.go.kr' },
];

const initialWarehouses: WarehouseRecord[] = [
  { id: 'WH-01', name: '서초 제3 자재창고', manager: '박물류', phone: '010-1111-2222', material: '염화칼슘', total: 142.5, unit: '톤' },
  { id: 'WH-02', name: '강남 율현 자재창고', manager: '이창고', phone: '010-3333-4444', material: '소금', total: 86.2, unit: '톤' },
  { id: 'WH-03', name: '송파 장지 자재창고', manager: '김재고', phone: '010-5555-6666', material: '친환경 제설제', total: 31.4, unit: '톤' },
  { id: 'WH-04', name: '강동 비상 자재창고', manager: '최보급', phone: '010-7777-8888', material: '모래', total: 58, unit: '톤' },
];

const MANAGER_STORAGE_KEY = 'hannune_support_managers';
const WAREHOUSE_STORAGE_KEY = 'hannune_stock_warehouses';

function loadWarehouses(): WarehouseRecord[] {
  try {
    const saved = window.localStorage.getItem(WAREHOUSE_STORAGE_KEY);
    if (!saved) return initialWarehouses;
    const parsed = JSON.parse(saved) as WarehouseRecord[];
    return Array.isArray(parsed) ? parsed : initialWarehouses;
  } catch {
    return initialWarehouses;
  }
}

export default function MyPage() {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(initialProfile);

  const [managers, setManagers] = useState<ManagerRecord[]>(initialManagers);
  const [editingManagerId, setEditingManagerId] = useState<string | null>(null);
  const [managerForm, setManagerForm] = useState<ManagerRecord | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(MANAGER_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Array<Partial<ManagerRecord>>;
      if (!Array.isArray(parsed) || parsed.length === 0) return;
      setManagers(parsed.map((manager) => ({
        id: manager.id ?? `m${Date.now()}-${Math.random()}`,
        name: manager.name ?? '',
        level: manager.level === '창고 담당자' ? '창고 담당자' : '일반 담당자',
        role: manager.role ?? '',
        dept: manager.dept ?? '',
        phone: manager.phone ?? '',
        email: manager.email ?? '',
      })));
    } catch {
      // 저장 데이터가 손상된 경우 기본 연락망을 사용합니다.
    }
  }, []);

  const persistManagers = (next: ManagerRecord[]) => {
    setManagers(next);
    window.localStorage.setItem(MANAGER_STORAGE_KEY, JSON.stringify(next));
  };

  const syncWarehouseManager = (previous: ManagerRecord | undefined, next: ManagerRecord) => {
    const warehouses = loadWarehouses();

    if (next.level === '창고 담당자') {
      const byManagerId = warehouses.findIndex((warehouse) => warehouse.managerId === next.id);
      const byPrevious = previous?.level === '창고 담당자'
        ? warehouses.findIndex((warehouse) => warehouse.name === previous.dept || warehouse.manager === previous.name)
        : -1;
      const byWarehouseName = warehouses.findIndex((warehouse) => warehouse.name === next.dept);
      const targetIndex = byManagerId >= 0 ? byManagerId : byPrevious >= 0 ? byPrevious : byWarehouseName;

      if (targetIndex >= 0) {
        const updated = [...warehouses];
        updated[targetIndex] = {
          ...updated[targetIndex],
          name: next.dept.trim(),
          managerId: next.id,
          manager: next.name.trim(),
          phone: next.phone.trim(),
        };
        window.localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(updated));
        return;
      }

      const newWarehouse: WarehouseRecord = {
        id: `WH-${Date.now()}`,
        name: next.dept.trim(),
        managerId: next.id,
        manager: next.name.trim(),
        phone: next.phone.trim(),
        material: '',
        total: null,
        unit: '톤',
      };
      window.localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify([...warehouses, newWarehouse]));
      return;
    }

    if (previous?.level === '창고 담당자') {
      const updated = warehouses.map((warehouse) =>
        warehouse.managerId === previous.id || warehouse.manager === previous.name
          ? { ...warehouse, managerId: undefined, manager: '', phone: '' }
          : warehouse,
      );
      window.localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const detachWarehouseManager = (manager: ManagerRecord) => {
    if (manager.level !== '창고 담당자') return;
    const warehouses = loadWarehouses();
    const updated = warehouses.map((warehouse) =>
      warehouse.managerId === manager.id || warehouse.manager === manager.name
        ? { ...warehouse, managerId: undefined, manager: '', phone: '' }
        : warehouse,
    );
    window.localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleProfileSave = () => {
    setProfile(profileForm);
    setIsEditingProfile(false);
    window.alert('내 정보가 성공적으로 수정되었습니다.');
  };

  const handleProfileCancel = () => {
    setProfileForm(profile);
    setIsEditingProfile(false);
  };

  const handleManagerEdit = (manager: ManagerRecord) => {
    setEditingManagerId(manager.id);
    setManagerForm({ ...manager });
  };

  const handleManagerChange = <K extends keyof ManagerRecord>(field: K, value: ManagerRecord[K]) => {
    setManagerForm((current) => current ? { ...current, [field]: value } : current);
  };

  const handleManagerSave = () => {
    if (!managerForm || !editingManagerId) return;
    const normalized = {
      ...managerForm,
      name: managerForm.name.trim(),
      dept: managerForm.dept.trim(),
      role: managerForm.role.trim(),
      phone: managerForm.phone.trim(),
      email: managerForm.email.trim(),
    };

    if (!normalized.name) {
      window.alert('담당자 이름을 입력해 주세요.');
      return;
    }
    if (normalized.level === '창고 담당자' && !normalized.dept) {
      window.alert('창고 담당자는 소속/구역에 자재 창고명을 입력해 주세요.');
      return;
    }

    const previous = managers.find((manager) => manager.id === editingManagerId);
    const nextManagers = managers.map((manager) => manager.id === editingManagerId ? normalized : manager);
    persistManagers(nextManagers);
    syncWarehouseManager(previous, normalized);
    setEditingManagerId(null);
    setManagerForm(null);
  };

  const handleManagerCancel = () => {
    if (managerForm && !managerForm.name && !managerForm.phone) {
      persistManagers(managers.filter((manager) => manager.id !== editingManagerId));
    }
    setEditingManagerId(null);
    setManagerForm(null);
  };

  const handleManagerDelete = (id: string) => {
    const manager = managers.find((item) => item.id === id);
    if (!manager) return;
    if (window.confirm('이 담당자를 연락망에서 정말 삭제하시겠습니까?')) {
      detachWarehouseManager(manager);
      persistManagers(managers.filter((item) => item.id !== id));
    }
  };

  const handleAddManager = () => {
    const newManager: ManagerRecord = {
      id: `m${Date.now()}`,
      name: '',
      level: '일반 담당자',
      role: '',
      dept: '',
      phone: '',
      email: '',
    };
    persistManagers([...managers, newManager]);
    setEditingManagerId(newManager.id);
    setManagerForm(newManager);
  };

  return (
    <main className="mx-auto w-full max-w-[1800px] flex-1 space-y-6 p-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-600/20">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">내 정보 및 담당자 연락망 관리</h2>
            <p className="mt-1 text-xs text-slate-500">관리자 프로필과 업무 담당자를 관리합니다. 창고 담당자는 재고관리와 자동으로 연결됩니다.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <section className="flex flex-col gap-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl lg:col-span-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white"><span>🛡️</span> 관리자 프로필 설정</h3>
            {!isEditingProfile && (
              <button onClick={() => { setProfileForm(profile); setIsEditingProfile(true); }} className="rounded border border-blue-900/50 bg-blue-950/30 px-3 py-1.5 text-xs font-bold text-blue-400 transition-colors hover:bg-blue-900/50">정보 수정</button>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-slate-900 bg-gradient-to-tr from-blue-600 to-blue-400 text-3xl font-black text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">{profile.name.charAt(0)}</div>
            <div className="text-center">
              <h4 className="text-xl font-black text-white">{profile.name}</h4>
              <span className="mt-1 inline-block rounded border border-blue-900/30 bg-blue-950/50 px-2 py-0.5 text-xs font-bold text-blue-400">{profile.role}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            {isEditingProfile ? (
              <div className="space-y-3">
                {[
                  ['name', '이름', 'text'],
                  ['role', '직책/권한', 'text'],
                  ['department', '소속 부서', 'text'],
                  ['phone', '연락처', 'text'],
                  ['email', '이메일', 'email'],
                ].map(([field, label, type]) => (
                  <div key={field}>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>
                    <input
                      type={type}
                      value={profileForm[field as keyof typeof profileForm]}
                      onChange={(e) => setProfileForm({ ...profileForm, [field]: e.target.value })}
                      className="w-full rounded border border-blue-500 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <button onClick={handleProfileSave} className="flex-1 rounded bg-blue-600 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500">저장하기</button>
                  <button onClick={handleProfileCancel} className="flex-1 rounded border border-slate-700 bg-slate-800 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700">취소</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div><label className="mb-0.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">소속 부서</label><div className="text-sm font-bold text-slate-200">{profile.department}</div></div>
                <div><label className="mb-0.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">연락처</label><div className="font-mono text-sm text-slate-300">{profile.phone}</div></div>
                <div><label className="mb-0.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">이메일 계정</label><div className="font-mono text-sm text-slate-300">{profile.email}</div></div>
                <div><label className="mb-0.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">비밀번호</label><div className="font-mono text-sm text-slate-500">********</div><button onClick={() => window.alert('비밀번호 변경 기능은 준비중입니다.')} className="mt-1 text-[10px] text-slate-400 underline hover:text-slate-200">비밀번호 변경하기</button></div>
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl lg:col-span-8">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-white"><span>📋</span> 서브 담당자 및 비상 연락망</h3>
              <p className="mt-1 text-[11px] text-slate-500">담당 레벨을 '창고 담당자'로 지정하면 소속/구역의 창고명이 재고관리에 자동 등록됩니다.</p>
            </div>
            <button onClick={handleAddManager} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 shadow-sm transition-all hover:bg-slate-700 active:scale-95">+ 담당자 추가</button>
          </div>

          <div className="custom-scrollbar overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/30">
            <table className="w-full min-w-[900px] border-collapse text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950 font-bold text-slate-400">
                <tr>
                  <th className="w-24 p-3.5">이름</th>
                  <th className="w-32 p-3.5">담당 레벨</th>
                  <th className="w-36 p-3.5">소속 / 구역</th>
                  <th className="w-28 p-3.5">직책</th>
                  <th className="w-36 p-3.5">연락처</th>
                  <th className="w-40 p-3.5">이메일</th>
                  <th className="w-24 bg-slate-900 p-3.5 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {managers.map((manager) => {
                  const isEditing = editingManagerId === manager.id && managerForm;
                  return (
                    <tr key={manager.id} className={`transition-colors ${isEditing ? 'bg-blue-900/20' : 'group hover:bg-slate-800/40'}`}>
                      <td className="p-3.5">
                        {isEditing ? <input value={managerForm.name} onChange={(e) => handleManagerChange('name', e.target.value)} placeholder="이름" className="w-full rounded border border-blue-500 bg-slate-950 px-2 py-1 text-white outline-none font-bold" /> : <span className="font-bold text-slate-200">{manager.name}</span>}
                      </td>
                      <td className="p-3.5">
                        {isEditing ? (
                          <select value={managerForm.level} onChange={(e) => handleManagerChange('level', e.target.value as ManagerLevel)} className="w-full rounded border border-blue-500 bg-slate-950 px-2 py-1 text-white outline-none">
                            <option value="일반 담당자">일반 담당자</option>
                            <option value="창고 담당자">창고 담당자</option>
                          </select>
                        ) : (
                          <span className={`rounded-md border px-2 py-1 text-[10px] font-black ${manager.level === '창고 담당자' ? 'border-blue-500/30 bg-blue-500/10 text-blue-300' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>{manager.level}</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {isEditing ? <input value={managerForm.dept} onChange={(e) => handleManagerChange('dept', e.target.value)} placeholder={managerForm.level === '창고 담당자' ? '자재 창고명 입력' : '소속 입력'} className="w-full rounded border border-blue-500 bg-slate-950 px-2 py-1 text-white outline-none" /> : <span className="text-slate-400">{manager.dept}</span>}
                      </td>
                      <td className="p-3.5">
                        {isEditing ? <input value={managerForm.role} onChange={(e) => handleManagerChange('role', e.target.value)} placeholder="직책 입력" className="w-full rounded border border-blue-500 bg-slate-950 px-2 py-1 text-white outline-none" /> : <span className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-300">{manager.role}</span>}
                      </td>
                      <td className="p-3.5">
                        {isEditing ? <input value={managerForm.phone} onChange={(e) => handleManagerChange('phone', e.target.value)} placeholder="연락처" className="w-full rounded border border-blue-500 bg-slate-950 px-2 py-1 font-mono text-white outline-none" /> : <span className="font-mono font-medium text-slate-300">{manager.phone}</span>}
                      </td>
                      <td className="p-3.5">
                        {isEditing ? <input type="email" value={managerForm.email} onChange={(e) => handleManagerChange('email', e.target.value)} placeholder="이메일" className="w-full rounded border border-blue-500 bg-slate-950 px-2 py-1 font-mono text-white outline-none" /> : <span className="font-mono text-slate-500">{manager.email}</span>}
                      </td>
                      <td className="bg-slate-900/30 p-3.5 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={handleManagerSave} className="rounded bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-blue-500">저장</button>
                            <button onClick={handleManagerCancel} className="rounded bg-slate-700 px-2.5 py-1 text-[10px] font-bold text-slate-200 hover:bg-slate-600">취소</button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 opacity-50 transition-opacity group-hover:opacity-100">
                            <button onClick={() => handleManagerEdit(manager)} className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-blue-400 hover:bg-slate-700">수정</button>
                            <button onClick={() => handleManagerDelete(manager.id)} className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-red-900/30 hover:text-red-400">삭제</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {managers.length === 0 && (
                  <tr><td colSpan={7} className="p-10 text-center font-bold text-slate-500">등록된 담당자가 없습니다. 우측 상단의 추가 버튼을 눌러보세요.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
