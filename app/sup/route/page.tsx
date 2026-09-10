"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { loadAreas, type AreaRecord } from '../data/vehicles';
import {
  initialRoutes,
  loadRoutes,
  saveRoutes,
  type RoutePoint,
  type RoutePriority,
  type RouteRecord,
} from '../data/routes';

type DrawingMode = 'route' | 'checkpoint';

type RouteDraft = {
  id?: string;
  name: string;
  area: string;
  priority: RoutePriority;
  enabled: boolean;
  points: RoutePoint[];
  checkpointPoints: RoutePoint[];
  distanceKm: number;
};

const emptyDraft: RouteDraft = {
  name: '',
  area: '강남 A구역',
  priority: '일반',
  enabled: true,
  points: [],
  checkpointPoints: [],
  distanceKm: 0,
};

function estimateDistance(points: RoutePoint[]) {
  if (points.length < 2) return 0;

  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const dx = (current.x - previous.x) * 0.2;
    const dy = (current.y - previous.y) * 0.14;
    total += Math.sqrt(dx * dx + dy * dy);
  }

  return Math.round(total * 10) / 10;
}

function priorityStyle(priority: RoutePriority) {
  if (priority === '최우선') return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
  if (priority === '중요') return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  return 'border-slate-700 bg-slate-800/70 text-slate-400';
}

function activityStyle(activity: RouteRecord['activity']) {
  if (activity === '정상') return 'bg-emerald-400';
  if (activity === '주의') return 'bg-amber-400';
  return 'bg-slate-500';
}

export default function RouteManagementPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [routes, setRoutes] = useState<RouteRecord[]>(initialRoutes);
  const [areas, setAreas] = useState<AreaRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialRoutes[0]?.id ?? null);
  const [draft, setDraft] = useState<RouteDraft>(emptyDraft);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('route');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const loadedRoutes = loadRoutes();
    const loadedAreas = loadAreas().filter((area) => area.enabled);
    setRoutes(loadedRoutes);
    setAreas(loadedAreas);

    const first = loadedRoutes[0];
    if (first) {
      setSelectedId(first.id);
      setDraft({
        id: first.id,
        name: first.name,
        area: first.area,
        priority: first.priority,
        enabled: first.enabled,
        points: first.points,
        checkpointPoints: first.checkpointPoints,
        distanceKm: first.distanceKm,
      });
    } else {
      setSelectedId(null);
      setDraft({ ...emptyDraft, area: loadedAreas[0]?.name ?? '미지정' });
    }
  }, []);

  const enabledRoutes = useMemo(() => routes.filter((route) => route.enabled), [routes]);
  const totalDistance = useMemo(
    () => enabledRoutes.reduce((sum, route) => sum + route.distanceKm, 0),
    [enabledRoutes],
  );
  const checkpointCount = useMemo(
    () => enabledRoutes.reduce((sum, route) => sum + route.checkpointPoints.length, 0),
    [enabledRoutes],
  );

  const selectRoute = (route: RouteRecord) => {
    if (isDirty && !window.confirm('저장하지 않은 변경사항이 있습니다. 다른 노선을 선택할까요?')) return;

    setSelectedId(route.id);
    setDraft({
      id: route.id,
      name: route.name,
      area: route.area,
      priority: route.priority,
      enabled: route.enabled,
      points: route.points,
      checkpointPoints: route.checkpointPoints,
      distanceKm: route.distanceKm,
    });
    setDrawingMode('route');
    setIsDirty(false);
  };

  const startNewRoute = () => {
    if (isDirty && !window.confirm('저장하지 않은 변경사항이 있습니다. 신규 노선을 만들까요?')) return;

    setSelectedId(null);
    setDraft({ ...emptyDraft, area: areas[0]?.name ?? '미지정' });
    setDrawingMode('route');
    setIsDirty(false);
  };

  const patchDraft = (patch: Partial<RouteDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setIsDirty(true);
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = mapRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    const point = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };

    if (drawingMode === 'checkpoint') {
      patchDraft({ checkpointPoints: [...draft.checkpointPoints, point] });
      return;
    }

    const nextPoints = [...draft.points, point];
    patchDraft({ points: nextPoints, distanceKm: estimateDistance(nextPoints) });
  };

  const undoPoint = () => {
    if (drawingMode === 'checkpoint') {
      if (draft.checkpointPoints.length === 0) return;
      patchDraft({ checkpointPoints: draft.checkpointPoints.slice(0, -1) });
      return;
    }

    if (draft.points.length === 0) return;
    const nextPoints = draft.points.slice(0, -1);
    patchDraft({ points: nextPoints, distanceKm: estimateDistance(nextPoints) });
  };

  const clearDrawing = () => {
    if (!window.confirm('현재 지도에 표시한 노선과 주요지점을 모두 지울까요?')) return;
    patchDraft({ points: [], checkpointPoints: [], distanceKm: 0 });
  };

  const saveDraft = () => {
    if (!draft.name.trim()) {
      window.alert('노선명을 입력해 주세요.');
      return;
    }
    if (draft.points.length < 2) {
      window.alert('지도에서 노선을 2개 지점 이상 지정해 주세요.');
      return;
    }

    let nextRoutes: RouteRecord[];
    if (draft.id) {
      nextRoutes = routes.map((route) =>
        route.id === draft.id
          ? {
              ...route,
              name: draft.name.trim(),
              area: draft.area,
              priority: draft.priority,
              enabled: draft.enabled,
              distanceKm: draft.distanceKm,
              points: draft.points,
              checkpointPoints: draft.checkpointPoints,
            }
          : route,
      );
    } else {
      const id = `route-${Date.now()}`;
      const newRoute: RouteRecord = {
        id,
        order: routes.length + 1,
        name: draft.name.trim(),
        area: draft.area,
        priority: draft.priority,
        enabled: draft.enabled,
        distanceKm: draft.distanceKm,
        checkpointPoints: draft.checkpointPoints,
        passedCheckpoints: 0,
        passesToday: 0,
        lastActivity: '금일 미확인',
        activity: '미확인',
        points: draft.points,
      };
      nextRoutes = [...routes, newRoute];
      setSelectedId(id);
      setDraft((current) => ({ ...current, id }));
    }

    setRoutes(nextRoutes);
    saveRoutes(nextRoutes);
    setIsDirty(false);
    window.alert('노선 정보가 저장되었습니다.');
  };

  const deleteSelected = () => {
    if (!draft.id) return;
    if (!window.confirm(`'${draft.name}' 노선을 삭제할까요?`)) return;

    const nextRoutes = routes.filter((route) => route.id !== draft.id);
    setRoutes(nextRoutes);
    saveRoutes(nextRoutes);

    const next = nextRoutes[0];
    if (next) {
      setSelectedId(next.id);
      setDraft({
        id: next.id,
        name: next.name,
        area: next.area,
        priority: next.priority,
        enabled: next.enabled,
        points: next.points,
        checkpointPoints: next.checkpointPoints,
        distanceKm: next.distanceKm,
      });
    } else {
      startNewRoute();
    }
    setIsDirty(false);
  };

  const routePolyline = draft.points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <main className="min-h-full bg-slate-950">
      <div className="mx-auto w-full max-w-[1720px] px-5 py-6 lg:px-7 xl:px-8">
        <section className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-black tracking-[0.13em] text-blue-300">ROUTE MANAGEMENT</span>
              <span className="text-[10px] font-bold text-slate-600">지도 API 연동 전 프로토타입</span>
            </div>
            <h1 className="text-2xl font-black tracking-[-0.03em] text-white lg:text-3xl">제설 노선관리</h1>
            <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-400 lg:text-sm">
              담당자가 지도에서 제설 관리노선을 직접 정의하고 노선 거리, 담당구역, 우선순위와 주요 관리지점을 함께 관리합니다.
            </p>
          </div>

          <button
            onClick={startNewRoute}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-[0_8px_24px_rgba(37,99,235,0.22)] transition hover:bg-blue-500"
          >
            + 신규 노선 등록
          </button>
        </section>

        <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['등록 노선', `${routes.length}개`, '전체 관리노선'],
            ['사용중 노선', `${enabledRoutes.length}개`, '현재 운영 대상'],
            ['총 계획 연장', `${totalDistance.toFixed(1)} km`, '사용중 노선 합계'],
            ['주요 관리지점', `${checkpointCount}개`, '교량·결빙·교차로 등'],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-2xl border border-slate-800/80 bg-slate-900/55 p-4 shadow-lg">
              <p className="text-[10px] font-black tracking-[0.13em] text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-2xl font-black text-white">{value}</p>
              <p className="mt-1 text-[10px] text-slate-600">{note}</p>
            </div>
          ))}
        </section>

        <section className="grid min-h-[690px] gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/55 shadow-lg">
            <div className="border-b border-slate-800 px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black tracking-[0.14em] text-blue-400">REGISTERED ROUTES</p>
                  <h2 className="mt-1 text-sm font-black text-white">등록 노선</h2>
                </div>
                <span className="rounded-lg bg-slate-950 px-2.5 py-1 text-[10px] font-bold text-slate-500">{routes.length}</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {routes.map((route) => {
                const active = selectedId === route.id;
                return (
                  <button
                    key={route.id}
                    onClick={() => selectRoute(route)}
                    className={`w-full rounded-xl border p-3.5 text-left transition ${active ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-800/80 bg-slate-950/35 hover:border-slate-700 hover:bg-slate-900'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${activityStyle(route.activity)}`} />
                          <p className="truncate text-xs font-black text-slate-100">{route.name}</p>
                        </div>
                        <p className="mt-1 truncate text-[10px] text-slate-500">{route.area}</p>
                      </div>
                      <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-black ${priorityStyle(route.priority)}`}>{route.priority}</span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-800/70 pt-3">
                      <div>
                        <p className="text-[9px] font-bold text-slate-600">계획거리</p>
                        <p className="mt-1 font-mono text-[11px] font-black text-slate-300">{route.distanceKm.toFixed(1)}km</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-600">주요지점</p>
                        <p className="mt-1 font-mono text-[11px] font-black text-slate-300">{route.checkpointPoints.length}개</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-600">최근활동</p>
                        <p className="mt-1 truncate text-[10px] font-black text-slate-300">{route.lastActivity}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className="flex min-h-[690px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/55 shadow-lg">
              <div className="flex flex-col gap-3 border-b border-slate-800 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-black tracking-[0.14em] text-blue-400">MAP EDITOR</p>
                  <h2 className="mt-1 text-sm font-black text-white">노선 지도 편집</h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-1">
                    <button
                      onClick={() => setDrawingMode('route')}
                      className={`rounded-md px-3 py-1.5 text-[10px] font-black transition ${drawingMode === 'route' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      노선 그리기
                    </button>
                    <button
                      onClick={() => setDrawingMode('checkpoint')}
                      className={`rounded-md px-3 py-1.5 text-[10px] font-black transition ${drawingMode === 'checkpoint' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      주요지점 추가
                    </button>
                  </div>
                  <button onClick={undoPoint} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[10px] font-bold text-slate-400 hover:text-white">↶ 실행취소</button>
                  <button onClick={clearDrawing} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[10px] font-bold text-slate-500 hover:text-rose-300">초기화</button>
                </div>
              </div>

              <div className="relative flex-1 p-4">
                <div
                  ref={mapRef}
                  onClick={handleMapClick}
                  className="relative h-full min-h-[580px] cursor-crosshair overflow-hidden rounded-xl border border-slate-700 bg-[#0b1220] shadow-inner"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.10)_1px,transparent_1px)] bg-[size:36px_36px]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_28%,rgba(30,64,175,0.10),transparent_24%),radial-gradient(circle_at_72%_68%,rgba(8,145,178,0.08),transparent_28%)]" />

                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                    <g fill="none" strokeLinecap="round">
                      <path d="M-5 72 C14 67 22 55 35 55 S58 61 105 42" stroke="rgba(100,116,139,0.42)" strokeWidth="2.8" />
                      <path d="M7 18 C20 30 37 31 48 44 S62 71 92 83" stroke="rgba(100,116,139,0.38)" strokeWidth="2.1" />
                      <path d="M4 43 C23 42 38 47 55 39 S79 19 104 25" stroke="rgba(71,85,105,0.42)" strokeWidth="1.8" />
                      <path d="M28 -5 C31 15 35 30 45 45 S55 73 52 105" stroke="rgba(71,85,105,0.34)" strokeWidth="1.6" />
                      <path d="M67 -5 C62 18 58 31 62 48 S78 72 74 105" stroke="rgba(71,85,105,0.34)" strokeWidth="1.6" />
                      <path d="M-4 88 C18 77 34 78 52 84 S82 92 104 78" stroke="rgba(51,65,85,0.42)" strokeWidth="1.4" />
                      <path d="M10 8 C26 15 40 14 54 10 S81 8 96 15" stroke="rgba(51,65,85,0.35)" strokeWidth="1.2" />
                    </g>

                    {draft.points.length > 1 && (
                      <polyline points={routePolyline} fill="none" stroke="rgba(59,130,246,0.95)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    )}

                    {draft.points.map((point, index) => (
                      <g key={`route-point-${index}`}>
                        <circle cx={point.x} cy={point.y} r="0.85" fill="rgba(191,219,254,1)" stroke="rgba(37,99,235,1)" strokeWidth="0.35" vectorEffect="non-scaling-stroke" />
                        <circle cx={point.x} cy={point.y} r="1.7" fill="none" stroke="rgba(59,130,246,0.28)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
                      </g>
                    ))}

                    {draft.checkpointPoints.map((point, index) => (
                      <g key={`checkpoint-${index}`}>
                        <circle cx={point.x} cy={point.y} r="1.2" fill="rgba(251,191,36,0.95)" stroke="rgba(15,23,42,1)" strokeWidth="0.45" vectorEffect="non-scaling-stroke" />
                        <circle cx={point.x} cy={point.y} r="2.1" fill="none" stroke="rgba(251,191,36,0.38)" strokeWidth="0.45" vectorEffect="non-scaling-stroke" />
                      </g>
                    ))}
                  </svg>

                  <div className="pointer-events-none absolute left-[13%] top-[21%] rounded bg-slate-950/55 px-2 py-1 text-[9px] font-bold text-slate-600">테헤란로</div>
                  <div className="pointer-events-none absolute left-[48%] top-[48%] rounded bg-slate-950/55 px-2 py-1 text-[9px] font-bold text-slate-600">서초대로</div>
                  <div className="pointer-events-none absolute right-[12%] top-[31%] rounded bg-slate-950/55 px-2 py-1 text-[9px] font-bold text-slate-600">영동대로</div>
                  <div className="pointer-events-none absolute bottom-[14%] left-[34%] rounded bg-slate-950/55 px-2 py-1 text-[9px] font-bold text-slate-600">반포대로</div>

                  <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 py-2 backdrop-blur">
                    <p className="text-[9px] font-black tracking-[0.12em] text-slate-500">DRAW MODE</p>
                    <p className={`mt-1 text-[11px] font-black ${drawingMode === 'route' ? 'text-blue-300' : 'text-amber-300'}`}>
                      {drawingMode === 'route' ? '클릭하여 노선 연결' : '클릭하여 주요지점 지정'}
                    </p>
                  </div>

                  <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 py-2 backdrop-blur">
                    <p className="text-[9px] text-slate-600">프로토타입 축척</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="block h-[2px] w-14 bg-slate-400" />
                      <span className="font-mono text-[9px] font-bold text-slate-400">약 5 km</span>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute bottom-3 right-3 rounded-xl border border-blue-500/20 bg-slate-950/85 px-4 py-3 text-right backdrop-blur">
                    <p className="text-[9px] font-black tracking-[0.12em] text-blue-400">ESTIMATED ROUTE LENGTH</p>
                    <p className="mt-1 font-mono text-2xl font-black text-white">{draft.distanceKm.toFixed(1)} <span className="text-xs text-blue-300">km</span></p>
                    <p className="mt-1 text-[9px] text-slate-600">실제 지도 API 연동 시 도로거리로 자동 계산</p>
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.14em] text-blue-400">ROUTE PROFILE</p>
                    <h2 className="mt-1 text-sm font-black text-white">노선 기본정보</h2>
                  </div>
                  {isDirty && <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[9px] font-black text-amber-300">수정중</span>}
                </div>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-bold text-slate-500">노선명</span>
                    <input
                      value={draft.name}
                      onChange={(event) => patchDraft({ name: event.target.value })}
                      placeholder="예: 서초 1노선"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-xs font-bold text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[10px] font-bold text-slate-500">담당구역</span>
                    <select
                      value={draft.area}
                      onChange={(event) => patchDraft({ area: event.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-xs font-bold text-slate-200 outline-none focus:border-blue-500"
                    >
                      {areas.length > 0 ? areas.map((area) => <option key={area.id}>{area.name}</option>) : <option>미지정</option>}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[10px] font-bold text-slate-500">관리 우선순위</span>
                    <select
                      value={draft.priority}
                      onChange={(event) => patchDraft({ priority: event.target.value as RoutePriority })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-xs font-bold text-slate-200 outline-none focus:border-blue-500"
                    >
                      <option>일반</option>
                      <option>중요</option>
                      <option>최우선</option>
                    </select>
                  </label>

                  <label className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/55 px-3.5 py-3">
                    <div>
                      <p className="text-xs font-black text-slate-300">운영 대상</p>
                      <p className="mt-1 text-[9px] text-slate-600">대시보드 집계에 포함</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={draft.enabled}
                      onChange={(event) => patchDraft({ enabled: event.target.checked })}
                      className="h-4 w-4 accent-blue-600"
                    />
                  </label>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                    <p className="text-[9px] font-bold text-slate-600">노선 포인트</p>
                    <p className="mt-1 font-mono text-lg font-black text-slate-200">{draft.points.length}<span className="ml-1 text-[9px] text-slate-600">개</span></p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                    <p className="text-[9px] font-bold text-slate-600">주요 관리지점</p>
                    <p className="mt-1 font-mono text-lg font-black text-amber-300">{draft.checkpointPoints.length}<span className="ml-1 text-[9px] text-slate-600">개</span></p>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  {draft.id && (
                    <button onClick={deleteSelected} className="rounded-xl border border-rose-500/20 bg-rose-500/[0.06] px-3 py-3 text-xs font-black text-rose-400 transition hover:bg-rose-500/10">삭제</button>
                  )}
                  <button onClick={saveDraft} className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-xs font-black text-white shadow-[0_8px_24px_rgba(37,99,235,0.20)] transition hover:bg-blue-500">
                    {draft.id ? '변경사항 저장' : '신규 노선 저장'}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 shadow-lg">
                <p className="text-[10px] font-black tracking-[0.14em] text-amber-400">DESIGN NOTE</p>
                <h3 className="mt-1 text-sm font-black text-white">운영 기준</h3>
                <div className="mt-4 space-y-3 text-[10px] leading-5 text-slate-500">
                  <p className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">노선 거리는 담당자가 직접 입력하지 않고 지도에서 그린 경로를 기준으로 시스템이 계산합니다.</p>
                  <p className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">삽날·살포기 신호가 없으므로 GPS 통과 기록은 ‘제설완료’가 아닌 ‘노선 활동·통과’로 표현합니다.</p>
                  <p className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">실서비스에서는 카카오·네이버·공공 도로망 등 실제 지도 API를 연결해 도로 스냅과 정확한 거리계산을 적용합니다.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
