export type VehicleStatus = '운행중' | '미운행' | '통신이상';

export type VehicleRecord = {
  id: string;
  order: number;
  icon: string;
  name: string;
  plate: string;
  type: '관용' | '임대';
  driver: string;
  phone: string;
  termId: string;
  serial: string;
  area: string;
  status: VehicleStatus;
};

export type AreaRecord = {
  id: string;
  order: number;
  name: string;
  route: string;
  enabled: boolean;
  status: '진행중' | '완료' | '대기';
  progress: number;
  updated: string;
};

export const VEHICLE_STORAGE_KEY = 'hannune_vehicle_management';
export const AREA_STORAGE_KEY = 'hannune_area_management';

export const initialAreas: AreaRecord[] = [
  { id: 'area-001', order: 1, name: '강남 A구역', route: '테헤란로 · 영동대로', enabled: true, status: '진행중', progress: 82, updated: '5분 전' },
  { id: 'area-002', order: 2, name: '서초 B구역', route: '반포대로 · 서초대로', enabled: true, status: '진행중', progress: 64, updated: '8분 전' },
  { id: 'area-003', order: 3, name: '송파 C구역', route: '올림픽로 · 위례성대로', enabled: true, status: '완료', progress: 100, updated: '21분 전' },
  { id: 'area-004', order: 4, name: '강동 D구역', route: '천호대로 · 양재대로', enabled: true, status: '대기', progress: 18, updated: '12분 전' },
];

export const AREA_OPTIONS = ['미지정', ...initialAreas.map((area) => area.name)] as const;

export const initialVehicles: VehicleRecord[] = [
  { id: '01호', order: 1, icon: '🚜', name: '제설 1호기', plate: '88바 1001', type: '관용', driver: '최긴급', phone: '010-1234-5671', termId: 'GPS-T01', serial: 'SN-99812A', area: '강남 A구역', status: '미운행' },
  { id: '02호', order: 2, icon: '🚛', name: '제설 2호기', plate: '88바 1002', type: '관용', driver: '박대기', phone: '010-1234-5672', termId: 'GPS-T02', serial: 'SN-99813B', area: '강남 A구역', status: '미운행' },
  { id: '03호', order: 3, icon: '🚙', name: '제설 3호기', plate: '88바 1003', type: '임대', driver: '이방빙', phone: '010-1234-5673', termId: 'GPS-T03', serial: 'SN-99814C', area: '서초 B구역', status: '운행중' },
  { id: '04호', order: 4, icon: '🚜', name: '제설 4호기', plate: '88바 1004', type: '임대', driver: '김제설', phone: '010-1234-5674', termId: 'GPS-T04', serial: 'SN-99815D', area: '강남 A구역', status: '운행중' },
  { id: '05호', order: 5, icon: '🚛', name: '제설 5호기', plate: '88바 1005', type: '관용', driver: '홍길동', phone: '010-1234-5675', termId: 'GPS-T05', serial: 'SN-99816E', area: '서초 B구역', status: '운행중' },
  { id: '06호', order: 6, icon: '🚜', name: '제설 6호기', plate: '88바 1006', type: '관용', driver: '정제설', phone: '010-1234-5676', termId: 'GPS-T06', serial: 'SN-99817F', area: '강동 D구역', status: '운행중' },
  { id: '07호', order: 7, icon: '🚛', name: '제설 7호기', plate: '88바 1007', type: '임대', driver: '강제설', phone: '010-1234-5677', termId: 'GPS-T07', serial: 'SN-99818G', area: '송파 C구역', status: '운행중' },
  { id: '08호', order: 8, icon: '🚙', name: '제설 8호기', plate: '88바 1008', type: '임대', driver: '윤제설', phone: '010-1234-5678', termId: 'GPS-T08', serial: 'SN-99819H', area: '송파 C구역', status: '운행중' },
  { id: '09호', order: 9, icon: '🚜', name: '제설 9호기', plate: '88바 1009', type: '관용', driver: '한제설', phone: '010-1234-5679', termId: 'GPS-T09', serial: 'SN-99820I', area: '강남 A구역', status: '미운행' },
  { id: '10호', order: 10, icon: '🚛', name: '제설 10호기', plate: '88바 1010', type: '관용', driver: '신제설', phone: '010-1234-5680', termId: 'GPS-T10', serial: 'SN-99821J', area: '서초 B구역', status: '운행중' },
  { id: '11호', order: 11, icon: '🚙', name: '제설 11호기', plate: '88바 1011', type: '임대', driver: '유제설', phone: '010-1234-5681', termId: 'GPS-T11', serial: 'SN-99822K', area: '강동 D구역', status: '운행중' },
  { id: '12호', order: 12, icon: '🚜', name: '제설 12호기', plate: '88바 1012', type: '관용', driver: '고제설', phone: '010-1234-5682', termId: 'GPS-T12', serial: 'SN-99823L', area: '송파 C구역', status: '운행중' },
  { id: '13호', order: 13, icon: '🚛', name: '제설 13호기', plate: '88바 1013', type: '임대', driver: '송제설', phone: '010-1234-5683', termId: 'GPS-T13', serial: 'SN-99824M', area: '강남 A구역', status: '운행중' },
  { id: '14호', order: 14, icon: '🚙', name: '제설 14호기', plate: '88바 1014', type: '관용', driver: '임제설', phone: '010-1234-5684', termId: 'GPS-T14', serial: 'SN-99825N', area: '미지정', status: '통신이상' },
  { id: '15호', order: 15, icon: '🚜', name: '제설 15호기', plate: '88바 1015', type: '임대', driver: '배제설', phone: '010-1234-5685', termId: 'GPS-T15', serial: 'SN-99826O', area: '서초 B구역', status: '운행중' },
];

export function loadVehicles(): VehicleRecord[] {
  if (typeof window === 'undefined') return initialVehicles;

  try {
    const saved = window.localStorage.getItem(VEHICLE_STORAGE_KEY);
    if (!saved) return initialVehicles;

    const parsed = JSON.parse(saved) as VehicleRecord[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialVehicles;
  } catch {
    return initialVehicles;
  }
}

export function saveVehicles(vehicles: VehicleRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(vehicles));
}

export function loadAreas(): AreaRecord[] {
  if (typeof window === 'undefined') return initialAreas;

  try {
    const saved = window.localStorage.getItem(AREA_STORAGE_KEY);
    if (!saved) return initialAreas;

    const parsed = JSON.parse(saved) as AreaRecord[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialAreas;
  } catch {
    return initialAreas;
  }
}

export function saveAreas(areas: AreaRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AREA_STORAGE_KEY, JSON.stringify(areas));
}
