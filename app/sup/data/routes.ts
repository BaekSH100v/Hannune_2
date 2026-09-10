export type RoutePoint = {
  x: number;
  y: number;
};

export type RoutePriority = '일반' | '중요' | '최우선';
export type RouteActivity = '정상' | '주의' | '미확인';

export type RouteRecord = {
  id: string;
  order: number;
  name: string;
  area: string;
  priority: RoutePriority;
  enabled: boolean;
  distanceKm: number;
  checkpointPoints: RoutePoint[];
  passedCheckpoints: number;
  passesToday: number;
  lastActivity: string;
  activity: RouteActivity;
  points: RoutePoint[];
};

export const ROUTE_STORAGE_KEY = 'hannune_route_management';

export const initialRoutes: RouteRecord[] = [
  {
    id: 'route-001',
    order: 1,
    name: '강남 1노선',
    area: '강남 A구역',
    priority: '최우선',
    enabled: true,
    distanceKm: 12.8,
    checkpointPoints: [
      { x: 21, y: 65 },
      { x: 35, y: 57 },
      { x: 51, y: 47 },
      { x: 68, y: 41 },
      { x: 82, y: 31 },
    ],
    passedCheckpoints: 5,
    passesToday: 4,
    lastActivity: '7분 전',
    activity: '정상',
    points: [
      { x: 13, y: 70 },
      { x: 25, y: 62 },
      { x: 38, y: 55 },
      { x: 52, y: 46 },
      { x: 68, y: 41 },
      { x: 83, y: 30 },
    ],
  },
  {
    id: 'route-002',
    order: 2,
    name: '강남 2노선',
    area: '강남 A구역',
    priority: '중요',
    enabled: true,
    distanceKm: 8.4,
    checkpointPoints: [
      { x: 29, y: 29 },
      { x: 46, y: 39 },
      { x: 66, y: 63 },
    ],
    passedCheckpoints: 3,
    passesToday: 3,
    lastActivity: '18분 전',
    activity: '정상',
    points: [
      { x: 20, y: 24 },
      { x: 33, y: 31 },
      { x: 45, y: 38 },
      { x: 56, y: 50 },
      { x: 68, y: 65 },
    ],
  },
  {
    id: 'route-003',
    order: 3,
    name: '서초 1노선',
    area: '서초 B구역',
    priority: '최우선',
    enabled: true,
    distanceKm: 15.6,
    checkpointPoints: [
      { x: 16, y: 46 },
      { x: 30, y: 48 },
      { x: 43, y: 49 },
      { x: 57, y: 56 },
      { x: 72, y: 59 },
      { x: 85, y: 57 },
    ],
    passedCheckpoints: 5,
    passesToday: 3,
    lastActivity: '12분 전',
    activity: '정상',
    points: [
      { x: 9, y: 44 },
      { x: 24, y: 48 },
      { x: 39, y: 47 },
      { x: 53, y: 55 },
      { x: 67, y: 59 },
      { x: 88, y: 57 },
    ],
  },
  {
    id: 'route-004',
    order: 4,
    name: '송파 1노선',
    area: '송파 C구역',
    priority: '중요',
    enabled: true,
    distanceKm: 10.2,
    checkpointPoints: [
      { x: 27, y: 72 },
      { x: 43, y: 65 },
      { x: 58, y: 57 },
      { x: 72, y: 51 },
    ],
    passedCheckpoints: 3,
    passesToday: 2,
    lastActivity: '46분 전',
    activity: '주의',
    points: [
      { x: 18, y: 80 },
      { x: 31, y: 69 },
      { x: 47, y: 63 },
      { x: 60, y: 56 },
      { x: 75, y: 50 },
    ],
  },
  {
    id: 'route-005',
    order: 5,
    name: '강동 1노선',
    area: '강동 D구역',
    priority: '일반',
    enabled: true,
    distanceKm: 7.9,
    checkpointPoints: [
      { x: 43, y: 27 },
      { x: 61, y: 35 },
      { x: 80, y: 39 },
    ],
    passedCheckpoints: 0,
    passesToday: 0,
    lastActivity: '금일 미확인',
    activity: '미확인',
    points: [
      { x: 35, y: 18 },
      { x: 46, y: 29 },
      { x: 58, y: 35 },
      { x: 72, y: 35 },
      { x: 86, y: 43 },
    ],
  },
];

export function loadRoutes(): RouteRecord[] {
  if (typeof window === 'undefined') return initialRoutes;

  try {
    const saved = window.localStorage.getItem(ROUTE_STORAGE_KEY);
    if (!saved) return initialRoutes;

    const parsed = JSON.parse(saved) as RouteRecord[];
    if (!Array.isArray(parsed) || parsed.length === 0) return initialRoutes;

    return parsed.map((route) => ({
      ...route,
      checkpointPoints: Array.isArray(route.checkpointPoints) ? route.checkpointPoints : [],
    }));
  } catch {
    return initialRoutes;
  }
}

export function saveRoutes(routes: RouteRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(routes));
}
