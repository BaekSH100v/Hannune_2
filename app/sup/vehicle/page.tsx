"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  initialAreas,
  initialVehicles,
  loadAreas,
  loadVehicles,
  saveAreas,
  saveVehicles,
  type AreaRecord,
  type VehicleRecord,
} from '../data/vehicles';

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(initialVehicles);
  const [areas, setAreas] = useState<AreaRecord[]>(initialAreas);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<VehicleRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [areaForm, setAreaForm] = useState<AreaRecord | null>(null);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaRoute, setNewAreaRoute] = useState('');

  useEffect(() => {
    setVehicles(loadVehicles());
    setAreas(loadAreas());
  }, []);

  const persistVehicles = (nextVehicles: VehicleRecord[]) => {
    setVehicles(nextVehicles);
    saveVehicles(nextVehicles);
  };

  const persistAreas = (nextAreas: AreaRecord[]) => {
    const sorted = [...nextAreas].sort((a, b) => a.order - b.order);
    setAreas(sorted);
    saveAreas(sorted);
  };

  const activeAreaOptions = useMemo(
    () => ['미지정', ...areas.filter((area) => area.enabled).sort((a, b) => a.order - b.order).map((area) => area.name)],
    [areas],
  );

  const sortedVehicles = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return vehicles
      .filter((car) => {
        if (!keyword) return true;
        return [car.name, car.plate, car.driver, car.id, car.area]
          .some((value) => value.toLowerCase().includes(keyword));
      })
      .sort((a, b) => a.order - b.order);
  }, [vehicles, searchTerm]);

  const handleEditClick = (car: VehicleRecord) => {
    setEditingId(car.id);
    setEditFormData({ ...car });
  };

  const handleInputChange = <K extends keyof VehicleRecord>(field: K, value: VehicleRecord[K]) => {
    setEditFormData((current) => current ? { ...current, [field]: value } : current);
  };

  const handleSaveClick = () => {
    if (!editFormData) return;
    persistVehicles(vehicles.map((car) => (car.id === editingId ? editFormData : car)));
    setEditingId(null);
    setEditFormData(null);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('정말로 이 차량 정보를 삭제하시겠습니까?')) {
      persistVehicles(vehicles.filter((car) => car.id !== id));
    }
  };

  const startAreaEdit = (area: AreaRecord) => {
    setEditingAreaId(area.id);
    setAreaForm({ ...area });
  };

  const saveAreaEdit = () => {
    if (!areaForm || !editingAreaId) return;
    const original = areas.find((area) => area.id === editingAreaId);
    if (!original) return;
    if (!areaForm.name.trim()) {
      window.alert('구역명을 입력해 주세요.');
      return;
    }

    const duplicate = areas.some((area) => area.id !== editingAreaId && area.name.trim() === areaForm.name.trim());
    if (duplicate) {
      window.alert('같은 구역명이 이미 등록되어 있습니다.');
      return;
    }

    const renamed = original.name !== areaForm.name.trim();
    const nextArea = { ...areaForm, name: areaForm.name.trim(), route: areaForm.route.trim() };
    persistAreas(areas.map((area) => area.id === editingAreaId ? nextArea : area));

    if (renamed) {
      persistVehicles(vehicles.map((vehicle) =>
        vehicle.area === original.name ? { ...vehicle, area: nextArea.name } : vehicle,
      ));
    }

    setEditingAreaId(null);
    setAreaForm(null);
  };

  const addArea = () => {
    const name = newAreaName.trim();
    const route = newAreaRoute.trim();
    if (!name) {
      window.alert('신규 구역명을 입력해 주세요.');
      return;
    }
    if (areas.some((area) => area.name === name)) {
      window.alert('같은 구역명이 이미 등록되어 있습니다.');
      return;
    }

    const nextOrder = areas.length === 0 ? 1 : Math.max(...areas.map((area) => area.order)) + 1;
    const newArea: AreaRecord = {
      id: `area-${Date.now()}`,
      order: nextOrder,
      name,
      route,
      enabled: true,
      status: '대기',
      progress: 0,
      updated: '방금 등록',
    };
    persistAreas([...areas, newArea]);
    setNewAreaName('');
    setNewAreaRoute('');
  };

  const deleteArea = (area: AreaRecord) => {
    const assigned = vehicles.filter((vehicle) => vehicle.area === area.name).length;
    const message = assigned > 0
      ? `${area.name}에 차량 ${assigned}대가 배정되어 있습니다.\n삭제하면 해당 차량은 '미지정'으로 변경됩니다. 계속하시겠습니까?`
      : `${area.name} 구역을 삭제하시겠습니까?`;

    if (!window.confirm(message)) return;
    persistAreas(areas.filter((item) => item.id !== area.id));
    if (assigned > 0) {
      persistVehicles(vehicles.map((vehicle) =>
        vehicle.area === area.name ? { ...vehicle, area: '미지정' } : vehicle,
      ));
    }
  };

  return (
    <main className="flex-1 p-6 max-w-[1900px] w-full mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30 shrink-0">
          <span className="text-2xl">🚜</span>
        </div>
        <div>
          <h2 className="text-xl font-black text-white">제설 차량 및 담당구역 관리</h2>
          <p className="text-xs text-slate-500 mt-1">차량 정보와 담당구역을 한 페이지에서 관리합니다. 구역 변경 내용은 대시보드에도 반영됩니다.</p>
        </div>
      </div>

      <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col overflow-hidden">
        <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-black text-white">등록 차량 {vehicles.length}대</p>
            <p className="mt-1 text-[11px] text-slate-500">차량 검색과 신규 차량 등록 기능을 이 카드에서 관리합니다.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-[10px] font-bold text-blue-300">
              구역 미지정 {vehicles.filter((vehicle) => vehicle.area === '미지정').length}대
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="차량명, 번호, 운전자, 구역 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 transition-all w-72 shadow-inner"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
            </div>
            <button
              onClick={() => window.alert('신규 차량 등록 기능은 다음 단계에서 연결합니다.')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95 shrink-0"
            >
              + 신규 차량 등록
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs border-collapse min-w-[1430px]">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3 w-16 text-center">순서</th><th className="p-3 w-16 text-center">아이콘</th><th className="p-3 w-20">ID (호수)</th><th className="p-3 w-32">차량명</th><th className="p-3 w-28">차량번호</th><th className="p-3 w-20">구분</th><th className="p-3 w-24">운전자명</th><th className="p-3 w-32">연락처</th><th className="p-3 w-36">담당구역</th><th className="p-3 w-28">단말기번호</th><th className="p-3 w-32">일련번호(S/N)</th><th className="p-3 w-32 text-center bg-slate-900">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {sortedVehicles.length > 0 ? sortedVehicles.map((car) => {
                const isEditing = editingId === car.id && editFormData;
                const options = isEditing && editFormData && !activeAreaOptions.includes(editFormData.area)
                  ? [...activeAreaOptions, editFormData.area]
                  : activeAreaOptions;
                return (
                  <tr key={car.id} className={`transition-colors ${isEditing ? 'bg-blue-900/20' : 'hover:bg-slate-800/40 group'}`}>
                    <td className="p-3 text-center">{isEditing ? <input type="number" value={editFormData.order} onChange={(e) => handleInputChange('order', Number(e.target.value))} className="w-12 bg-slate-950 border border-blue-500 rounded px-1 py-1 text-center text-white outline-none" /> : <span className="font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">{car.order}</span>}</td>
                    <td className="p-3 text-center text-lg">{isEditing ? <select value={editFormData.icon} onChange={(e) => handleInputChange('icon', e.target.value)} className="bg-slate-950 border border-blue-500 rounded px-1 py-1 outline-none text-base"><option value="🚜">🚜</option><option value="🚛">🚛</option><option value="🚙">🚙</option></select> : car.icon}</td>
                    <td className="p-3 font-bold text-slate-500">{car.id}</td>
                    <td className="p-3">{isEditing ? <input value={editFormData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none font-bold" /> : <span className="font-bold text-slate-200">{car.name}</span>}</td>
                    <td className="p-3">{isEditing ? <input value={editFormData.plate} onChange={(e) => handleInputChange('plate', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none" /> : <span className="font-mono text-slate-300">{car.plate}</span>}</td>
                    <td className="p-3">{isEditing ? <select value={editFormData.type} onChange={(e) => handleInputChange('type', e.target.value as VehicleRecord['type'])} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none"><option value="관용">관용</option><option value="임대">임대</option></select> : <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${car.type === '관용' ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900' : 'bg-amber-950/50 text-amber-400 border-amber-900'}`}>{car.type}</span>}</td>
                    <td className="p-3">{isEditing ? <input value={editFormData.driver} onChange={(e) => handleInputChange('driver', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none" /> : <span className="text-slate-300 font-bold">{car.driver}</span>}</td>
                    <td className="p-3">{isEditing ? <input value={editFormData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none font-mono" /> : <span className="font-mono text-slate-400">{car.phone}</span>}</td>
                    <td className="p-3">{isEditing ? <select value={editFormData.area} onChange={(e) => handleInputChange('area', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none">{options.map((area) => <option key={area} value={area}>{area}</option>)}</select> : <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold ${car.area === '미지정' ? 'bg-rose-500/10 text-rose-300' : 'bg-blue-500/10 text-blue-300'}`}>{car.area}</span>}</td>
                    <td className="p-3">{isEditing ? <input value={editFormData.termId} onChange={(e) => handleInputChange('termId', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none font-mono" /> : <span className="font-mono text-blue-400 font-bold">{car.termId}</span>}</td>
                    <td className="p-3">{isEditing ? <input value={editFormData.serial} onChange={(e) => handleInputChange('serial', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none font-mono text-[10px]" /> : <span className="font-mono text-slate-500 text-[10px]">{car.serial}</span>}</td>
                    <td className="p-3 text-center bg-slate-900/30">{isEditing ? <div className="flex items-center justify-center gap-1.5"><button onClick={handleSaveClick} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded text-[10px]">저장</button><button onClick={() => { setEditingId(null); setEditFormData(null); }} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-2 py-1 rounded text-[10px]">취소</button></div> : <div className="flex items-center justify-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity"><button onClick={() => handleEditClick(car)} className="bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 font-bold px-2.5 py-1 rounded text-[10px]">수정</button><button onClick={() => handleDeleteClick(car.id)} className="bg-slate-800 hover:bg-red-900/30 text-slate-500 hover:text-red-400 border border-slate-700 font-bold px-2.5 py-1 rounded text-[10px]">삭제</button></div>}</td>
                  </tr>
                );
              }) : <tr><td colSpan={12} className="p-10 text-center text-slate-500 font-bold">검색 결과가 없습니다.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.16em] text-blue-400">AREA MANAGEMENT</p>
            <h3 className="mt-1 text-base font-black text-white">담당구역 관리</h3>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">신규 구역 추가, 구역명·주요 노선 변경, 사용 중지까지 차량관리 화면에서 바로 처리합니다.</p>
          </div>
          <div className="grid w-full gap-2 sm:grid-cols-[180px_1fr_auto] xl:w-auto xl:min-w-[720px]">
            <input value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} placeholder="신규 구역명" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500" />
            <input value={newAreaRoute} onChange={(e) => setNewAreaRoute(e.target.value)} placeholder="주요 노선 예: 테헤란로 · 영동대로" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500" />
            <button onClick={addArea} className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-500">+ 신규 구역 추가</button>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full min-w-[980px] text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400">
              <tr><th className="p-3 w-20 text-center">순서</th><th className="p-3 w-44">구역명</th><th className="p-3">주요 노선</th><th className="p-3 w-28 text-center">배정 차량</th><th className="p-3 w-28 text-center">사용여부</th><th className="p-3 w-36 text-center">관리</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[...areas].sort((a, b) => a.order - b.order).map((area) => {
                const editing = editingAreaId === area.id && areaForm;
                const assigned = vehicles.filter((vehicle) => vehicle.area === area.name).length;
                return (
                  <tr key={area.id} className={editing ? 'bg-blue-900/15' : 'hover:bg-slate-800/30'}>
                    <td className="p-3 text-center">{editing ? <input type="number" value={areaForm.order} onChange={(e) => setAreaForm({ ...areaForm, order: Number(e.target.value) })} className="w-14 rounded border border-blue-500 bg-slate-950 px-2 py-1 text-center text-white" /> : <span className="font-mono text-slate-500">{area.order}</span>}</td>
                    <td className="p-3">{editing ? <input value={areaForm.name} onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })} className="w-full rounded border border-blue-500 bg-slate-950 px-2 py-1.5 font-bold text-white" /> : <span className="font-black text-slate-200">{area.name}</span>}</td>
                    <td className="p-3">{editing ? <input value={areaForm.route} onChange={(e) => setAreaForm({ ...areaForm, route: e.target.value })} className="w-full rounded border border-blue-500 bg-slate-950 px-2 py-1.5 text-white" /> : <span className="text-slate-400">{area.route || '주요 노선 미입력'}</span>}</td>
                    <td className="p-3 text-center"><span className="rounded-md bg-blue-500/10 px-2 py-1 font-black text-blue-300">{assigned}대</span></td>
                    <td className="p-3 text-center">{editing ? <select value={areaForm.enabled ? '사용' : '중지'} onChange={(e) => setAreaForm({ ...areaForm, enabled: e.target.value === '사용' })} className="rounded border border-blue-500 bg-slate-950 px-2 py-1.5 text-white"><option>사용</option><option>중지</option></select> : <span className={`rounded-md px-2 py-1 text-[10px] font-black ${area.enabled ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>{area.enabled ? '사용중' : '사용중지'}</span>}</td>
                    <td className="p-3 text-center">{editing ? <div className="flex justify-center gap-1.5"><button onClick={saveAreaEdit} className="rounded bg-blue-600 px-2.5 py-1 font-bold text-white hover:bg-blue-500">저장</button><button onClick={() => { setEditingAreaId(null); setAreaForm(null); }} className="rounded bg-slate-700 px-2.5 py-1 font-bold text-slate-200">취소</button></div> : <div className="flex justify-center gap-1.5"><button onClick={() => startAreaEdit(area)} className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 font-bold text-blue-400 hover:bg-slate-700">수정</button><button onClick={() => deleteArea(area)} className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 font-bold text-slate-500 hover:bg-red-900/30 hover:text-red-400">삭제</button></div>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
