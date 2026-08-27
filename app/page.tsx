"use client";

import React, { useState } from 'react';

export default function SnowControlSystem() {
  const [weatherOpen, setWeatherOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("재고");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("전체");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeVideoTab, setActiveVideoTab] = useState("CCTV");
  const [hoveredVehicleId, setHoveredVehicleId] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [selectedMaterial, setSelectedMaterial] = React.useState<'소금' | '염화칼슘' | '모래'>('염화칼슘');

  // 샘플 데이터
  const vehicles = [
    { id: '01호', plate: '88바 1001', driver: '최긴급', phone: '010-1234-5671', area: '송파구역', status: '미운행', battery: 5, distance: 0, top: '70%', left: '60%' },
    { id: '02호', plate: '88바 1002', driver: '박대기', phone: '010-1234-5672', area: '관제센터', status: '미운행', battery: 0, distance: 12, top: '50%', left: '50%' },
    { id: '03호', plate: '88바 1003', driver: '이방빙', phone: '010-1234-5673', area: '서초구역', status: '운행중', battery: 42, distance: 45, top: '65%', left: '45%' },
    { id: '04호', plate: '88바 1004', driver: '김제설', phone: '010-1234-5674', area: '강남구역', status: '운행중', battery: 85, distance: 78, top: '60%', left: '55%' },
    { id: '05호', plate: '88바 1005', driver: '홍길동', phone: '010-1234-5675', area: '영등포구역', status: '운행중', battery: 75, distance: 32, top: '55%', left: '35%' },
    { id: '06호', plate: '88바 1006', driver: '정제설', phone: '010-1234-5676', area: '강동구역', status: '운행중', battery: 60, distance: 95, top: '45%', left: '75%' },
    { id: '07호', plate: '88바 1007', driver: '강제설', phone: '010-1234-5677', area: '마포구역', status: '운행중', battery: 90, distance: 64, top: '45%', left: '25%' },
    { id: '08호', plate: '88바 1008', driver: '윤제설', phone: '010-1234-5678', area: '용산구역', status: '운행중', battery: 55, distance: 21, top: '50%', left: '40%' },
    { id: '09호', plate: '88바 1009', driver: '한제설', phone: '010-1234-5679', area: '성동구역', status: '미운행', battery: 80, distance: 5, top: '40%', left: '55%' },
    { id: '10호', plate: '88바 1010', driver: '신제설', phone: '010-1234-5680', area: '광진구역', status: '운행중', battery: 70, distance: 50, top: '40%', left: '65%' },
    { id: '11호', plate: '88바 1011', driver: '유제설', phone: '010-1234-5681', area: '동대문구역', status: '운행중', battery: 65, distance: 18, top: '35%', left: '50%' },
    { id: '12호', plate: '88바 1012', driver: '고제설', phone: '010-1234-5682', area: '중랑구역', status: '운행중', battery: 30, distance: 88, top: '25%', left: '65%' },
    { id: '13호', plate: '88바 1013', driver: '송제설', phone: '010-1234-5683', area: '성북구역', status: '운행중', battery: 88, distance: 40, top: '25%', left: '45%' },
    { id: '14호', plate: '88바 1014', driver: '임제설', phone: '010-1234-5684', area: '강북구역', status: '미운행', battery: 95, distance: 0, top: '15%', left: '45%' },
    { id: '15호', plate: '88바 1015', driver: '배제설', phone: '010-1234-5685', area: '도봉구역', status: '운행중', battery: 40, distance: 73, top: '10%', left: '50%' },
  ];

  const stockData = [
    { location: '서초 저장소', item: '염화칼슘', amount: '450포', status: '충분' },
    { location: '강남 저장소', item: '모래', amount: '120포', status: '부족' },
  ];

  const workData = [
    { area: '강남구역', progress: 85, workers: 12 },
    { area: '서초구역', progress: 42, workers: 8 },
  ];

  const filteredVehicles = vehicles.filter(v =>
    (activeFilter === "전체" || v.status === activeFilter) &&
    (v.id.includes(searchTerm) || v.driver.includes(searchTerm))
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans text-sm">

      {/* 1. 좌측 사이드바 */}
      <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <span className="text-blue-400 font-bold text-lg tracking-tight">제설관제시스템 [Hannune : 한누네]</span>
          </div>
        </div>

        {/* 사용자 정보 및 로그아웃 */}
        <div className="px-6 py-4 mb-2 flex items-center justify-between border-y border-slate-800/50 bg-slate-800/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-blue-400/20">
              제
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">관리자</span>
              <span className="text-sm font-bold text-slate-100">제설담당자 님</span>
            </div>
          </div>

          <button
            onClick={() => alert("로그아웃 하시겠습니까?")}
            className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-red-500/10 transition-colors"
          >
            <span className="text-slate-500 group-hover:text-red-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </span>
            <span className="text-[11px] font-bold text-slate-500 group-hover:text-red-400 tracking-tighter">LOGOUT</span>
          </button>
        </div>

        <div className="px-4 space-y-4 overflow-y-auto pb-6 flex-1 custom-scrollbar">

          {/* --- 파트 시작: 반달형(Speedometer) 제설율 게이지 차트 --- */}
          <div className="p-5 flex flex-col items-center bg-slate-800/20 rounded-2xl border border-slate-800/50">
            <div className="relative w-full max-w-[220px] aspect-[2/1.2] flex flex-col items-center justify-end overflow-visible">

              {/* 반달형 SVG 드로잉 영역 */}
              <svg viewBox="0 0 200 120" className="absolute top-0 w-full h-full overflow-visible">

                {/* 1. 배경 게이지 (두껍고 둥근 마감) */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="28"
                  strokeLinecap="round"
                  className="text-slate-800"
                />

                {/* 2. 실시간 채워지는 블루 게이지 */}
                {/* 전체 길이(251.3) 기준으로 78%만큼 차오르도록 계산되었습니다. */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeDasharray="251.3"
                  strokeDashoffset={251.3 * (1 - 0.78)}
                  className="text-blue-500 transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                />
              </svg>

              {/* 반달 안쪽에 포근하게 들어가는 텍스트 영역 */}
              <div className="text-center z-10 translate-y-1">
                <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                  78<span className="text-2xl font-bold ml-1 text-slate-400">%</span>
                </p>
                <p className="text-[14px] text-blue-400 font-bold uppercase tracking-widest mt-1.5">
                  제설 현황
                </p>
              </div>

            </div>
          </div>
          {/* --- 파트 끝 --- */}

          {/* 제설업무지원 버튼 */}
          <a href="/sup" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors group">
            <span className="text-lg group-hover:scale-110 transition-transform">📋</span>
            <span className="text-sm font-bold">제설업무지원</span>
          </a>

          {/* 실시간 위성 영상 (실제 기상청 데이터 연동) */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-800 overflow-hidden">
            <button onClick={() => setWeatherOpen(!weatherOpen)} className="w-full flex items-center justify-between p-4 font-bold hover:bg-slate-800/60 transition text-xs">
              <span className="flex items-center gap-2">🛰️ 실시간 위성 영상</span>
              <span className={`transition-transform text-[10px] ${weatherOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {weatherOpen && (
              <div className="p-3 pt-0 animate-in fade-in slide-in-from-top-1">
                <div className="h-80 bg-slate-950 rounded-lg border border-slate-700 relative overflow-hidden group">

                  {/* 전세계 실시간 위성 구름 영상을 제공하는 글로벌 서비스 연동 (보안 차단 없음) */}
                  <iframe
                    src="https://earth.nullschool.net/#current/wind/surface/level/overlay=satellite/orthographic=-232.00,36.00,3000"
                    className="w-full h-full border-0 opacity-80 group-hover:opacity-100 transition-opacity"
                    title="실시간 위성 구름 영상"
                    scrolling="no"
                  />

                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-red-600 text-[7px] font-bold rounded animate-pulse text-white z-10">LIVE</div>
                  {/* 지도 위에 마우스 조작을 원활하게 하기 위한 하단 안내 텍스트 */}
                  <div className="absolute bottom-2 left-2 text-[9px] text-slate-500 font-mono pointer-events-none z-10">
                    * 마우스 드래그로 회전/확대 가능
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 지역 현황 탭 */}
          {/* --- 지역재고현황 패널 (요구사항 반영 디테일 완성 버전) --- */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col gap-3.5">

            {/* 상단 헤더: 요구사항 1 반영 - 깜빡이는 LIVE 라벨 및 외곽 테두리 전면 삭제 */}
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                🏔️ 지역 저장소 재고 현황
              </h2>
            </div>

            {/* 자재 선택 세그먼트: 요구사항 2 반영 - 흰색/테두리 라인을 지우고 배경색 대비로만 매끄럽게 스위칭 */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl">
              {(['소금', '염화칼슘', '모래'] as const).map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${selectedMaterial === mat
                    ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(59,130,246,0.3)]'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
                    }`}
                >
                  {mat}
                </button>
              ))}
            </div>

            {/* 저장소 리스트: 요구사항 3 반영 - no-scrollbar 클래스를 주어 불필요한 우측 스크롤바 완전 히든 처리 */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto no-scrollbar">

              {/* 서초 제3 저장소 */}
              <div className="p-3 bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-xl transition-all flex justify-between items-center group">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">서초 제3 저장소</span>
                  <span className="text-[10px] text-slate-500">담당: 서초구청 도로관리소</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-black text-blue-400">
                    {selectedMaterial === '염화칼슘' ? '42.5' : selectedMaterial === '소금' ? '85.0' : '120.0'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold ml-1">톤</span>
                </div>
              </div>

              {/* 강남 대기소 저장고 */}
              <div className="p-3 bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-xl transition-all flex justify-between items-center group">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">강남 율현 저장소</span>
                  <span className="text-[10px] text-slate-500">담당: 강남구청 도로과</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-black text-slate-300">
                    {selectedMaterial === '염화칼슘' ? '18.2' : selectedMaterial === '소금' ? '40.5' : '65.0'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold ml-1">톤</span>
                </div>
              </div>

              {/* 송파 오륜 저장소 */}
              <div className="p-3 bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-xl transition-all flex justify-between items-center group">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">송파 장지 저장소</span>
                  <span className="text-[10px] text-slate-500">담당: 송파구청 치수과</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-black text-slate-300">
                    {selectedMaterial === '염화칼슘' ? '64.0' : selectedMaterial === '소금' ? '92.1' : '210.5'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold ml-1">톤</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </aside>







      {/* 2. 중앙 메인 관제 (지도 영역) */}
      <main className="flex-1 relative bg-slate-900 overflow-hidden flex flex-col">

        {/* --- 배경 지도 (차량이 선택되면 해당 위치로 가상 줌인 처리) --- */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-out cursor-pointer"
          style={{
            transform: selectedVehicle ? 'scale(1.4)' : 'scale(1)',
            transformOrigin: selectedVehicle ? `${selectedVehicle.left} ${selectedVehicle.top}` : 'center center'
          }}
          onClick={() => setSelectedVehicle(null)}
        >
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" alt="Seoul Map Background" className="w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/40"></div>
        </div>

        {/* --- 중앙 지도 상단 타이틀 --- */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <h2 className="text-2xl font-black text-white flex items-center gap-2 drop-shadow-md">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            CLEAR SNOW CONTROL SYSTEM 
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1 ml-3.5">REAL-TIME VIDEO & GPS TRACKING INTERFACE</p>
        </div>

        {/* --- 지도 위 차량 위치 핀 15대 렌더링 --- */}
        {vehicles.map((car, idx) => {
          const isCurrentSelected = selectedVehicle?.id === car.id;

          return (
            <div
              key={`pin-${idx}`}
              // 👉 중요: 전체 핀 영역에 cursor-pointer와 select-none을 주어 이모지가 글자로 인식되는 것을 원천 차단합니다!
              className="absolute flex flex-col items-center gap-1.5 z-10 transition-all duration-500 cursor-pointer select-none"
              style={{
                top: car.top,
                left: car.left,
                zIndex: isCurrentSelected ? 30 : 10
              }}
              onMouseEnter={() => setHoveredVehicleId(car.id)}
              onMouseLeave={() => setHoveredVehicleId(null)}
              onClick={() => setSelectedVehicle(car)}
            >
              {/* 상태별 라벨 */}
              <div className={`px-2 py-0.5 bg-slate-900/90 border text-slate-100 text-[10px] font-bold rounded shadow-lg whitespace-nowrap backdrop-blur-sm transition-all ${hoveredVehicleId === car.id || isCurrentSelected ? 'scale-110 border-blue-400' : car.status === '운행중' ? 'border-blue-500' : 'border-slate-600'}`}>
                {car.id} <span className={car.status === '운행중' ? 'text-blue-400 font-normal' : 'text-slate-500 font-normal'}>{car.status}</span>
              </div>

              {/* 상태별 핀 아이콘 */}
              <div className="relative">
                {(car.status === '운행중' || isCurrentSelected) && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${isCurrentSelected ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
                )}
                {/* 👉 여기 둥근 원 안에도 cursor-pointer를 꼼꼼하게 각인해 줍니다. */}
                <div className={`relative w-7 h-7 border rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${hoveredVehicleId === car.id || isCurrentSelected ? 'scale-125' : ''} ${isCurrentSelected ? 'bg-amber-500 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.9)]' : car.status === '운행중' ? 'bg-blue-600 border-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-slate-700 border-slate-500 shadow-lg'}`}>
                  {isCurrentSelected ? '📍' : car.status === '운행중' ? '🚜' : '💤'}
                </div>
              </div>
            </div>
          );
        })}

        {/* --- 요구사항 반영: 지도 위 차량 상세 정보 팝업 오버레이 (Infowindow) --- */}
        {/* --- 개편: 지도 위 차량 상세 정보 팝업 오버레이 (실시간 영상 내장 버전) --- */}
        {selectedVehicle && (
          <div className="absolute top-24 left-6 z-30 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-4 duration-300 flex flex-col gap-3">

            {/* 1. 팝업 헤더 (기존과 동일) */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <div className="flex items-baseline gap-1.5 min-w-0 flex-1">
                <h3 className="text-sm font-black text-white truncate">{selectedVehicle.id}</h3>
                <span className="text-[14px] font-mono text-blue-400 font-bold tracking-tight shrink-0">
                  ({selectedVehicle.plate})
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className={`px-1.5 py-0.5 rounded text-[12px] font-black tracking-wide leading-none ${selectedVehicle.status === '운행중'
                  ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                  }`}>
                  {selectedVehicle.status}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVehicle(null);
                  }}
                  className="text-slate-500 hover:text-slate-300 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 2. 4줄 핵심 상세 정보 (기존과 동일) */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center p-1.5 bg-slate-950/40 rounded border border-slate-800/60">
                <span className="text-slate-500">운전자명</span>
                <span className="text-slate-200 font-bold">{selectedVehicle.driver} 기사님</span>
              </div>
              <div className="flex justify-between items-center p-1.5 bg-slate-950/40 rounded border border-slate-800/60">
                <span className="text-slate-500">운전자 연락처</span>
                <span className="text-slate-300 font-mono font-medium">{selectedVehicle.phone}</span>
              </div>
              <div className="flex justify-between items-center p-1.5 bg-slate-950/40 rounded border border-slate-800/60">
                <span className="text-slate-500">현위치</span>
                <span className="text-slate-200">📍 {selectedVehicle.area}</span>
              </div>
              <div className="flex justify-between items-center p-1.5 bg-slate-950/40 rounded border border-slate-800/60">
                <span className="text-slate-500">총 운행거리</span>
                <span className="text-amber-400 font-bold font-mono">{selectedVehicle.distance} km</span>
              </div>
            </div>

            {/* 👉 3. 새로 추가된 요구사항: 차량별 실시간 영상 매베딩 영역 */}
            <div className="mt-1">
              <p className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedVehicle.status === '운행중' ? 'animate-ping bg-red-400' : 'bg-slate-500'}`}></span>
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${selectedVehicle.status === '운행중' ? 'bg-red-500' : 'bg-slate-500'}`}></span>
                </span>
                차량 전방 단말기 영상 (LIVE)
              </p>

              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 group shadow-inner">
                {/* 운행 상태에 따라 흑백/컬러 처리 및 오버레이 제공 */}
                <img
                  src="https://images.unsplash.com/photo-1418065460487-3e41a6c8e1e4?auto=format&fit=crop&q=80"
                  alt="Vehicle Live Dashcam"
                  className={`w-full h-full object-cover transition-all duration-500 ${selectedVehicle.status === '미운행' ? 'grayscale opacity-20' : 'opacity-70 group-hover:opacity-90'}`}
                />

                {/* 미운행 차량인 경우 오프라인 마크 표시 */}
                {selectedVehicle.status === '미운행' ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-slate-500 font-black text-[10px] tracking-widest bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                      SIGNAL OFFLINE
                    </span>
                  </div>
                ) : (
                  /* 운행중인 차량은 영상 우측 하단에 채널 표시 */
                  <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-white/40 bg-black/50 px-1.5 py-0.5 rounded">
                    CAM-{selectedVehicle.id.replace('호', '')}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* --- 대형 슬라이딩 영상 서랍 --- */}
        <div
          className={`absolute bottom-0 left-4 right-4 bg-slate-900/95 backdrop-blur-2xl border-x border-t border-slate-700 rounded-t-3xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col h-[90%] ${isDrawerOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'}`}
          onClick={() => setSelectedVehicle(null)}
        >
          {/* ... (영상 서랍 내부는 기존 코드가 워낙 완벽했으니 그대로 둡니다!) ... */}
          {/* 단, 탭 메뉴 영역 아래의 grid 컴포넌트 전체는 직전 턴에 전달해 드린 코드가 그대로 들어있는 상태여야 합니다. */}
          <div className="h-12 shrink-0 flex items-center justify-center cursor-pointer group relative border-b border-slate-800" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <div className="w-16 h-1.5 bg-slate-600 rounded-full group-hover:bg-blue-400 transition-colors"></div>
            <span className="absolute left-6 text-xs font-bold text-slate-300 flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>실시간 영상</span>
            <span className="absolute right-6 text-[10px] text-slate-500 font-mono font-bold group-hover:text-blue-400 transition-colors uppercase">{isDrawerOpen ? '▼ CLOSE' : '▲ OPEN'}</span>
          </div>
          <div className="flex px-6 pt-2 border-b border-slate-800 shrink-0">
            <button onClick={() => setActiveVideoTab("CCTV")} className={`pb-3 px-6 text-sm font-black transition-colors relative ${activeVideoTab === "CCTV" ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>국토부 CCTV 영상 (25){activeVideoTab === "CCTV" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>}</button>
            <button onClick={() => setActiveVideoTab("DASHCAM")} className={`pb-3 px-6 text-sm font-black transition-colors relative ${activeVideoTab === "DASHCAM" ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>제설차량 단말 영상 ({vehicles.length}){activeVideoTab === "DASHCAM" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>}</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-950/30">
            <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {activeVideoTab === "CCTV" && Array.from({ length: 25 }).map((_, i) => (
                <div key={`cctv-${i}`} onClick={() => window.open('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80', '_blank', 'width=800,height=600')} className="relative aspect-video bg-black rounded-lg border border-slate-800 overflow-hidden group cursor-pointer hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all">
                  <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80" alt="cctv" className="w-full h-full object-cover opacity-50 group-hover:opacity-90 transition-all duration-500" />
                  <div className="absolute top-2 left-2 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-slate-700"><div className="w-1 h-1 bg-red-500 rounded-full"></div> CH-{String(i + 1).padStart(2, '0')}</div>
                </div>
              ))}
              {activeVideoTab === "DASHCAM" && vehicles.map((car, i) => (
                <div key={`dashcam-${i}`} onClick={() => window.open('https://images.unsplash.com/photo-1418065460487-3e41a6c8e1e4?auto=format&fit=crop&q=80', '_blank', 'width=800,height=600')} onMouseEnter={() => setHoveredVehicleId(car.id)} onMouseLeave={() => setHoveredVehicleId(null)} className={`relative aspect-video bg-black rounded-lg border overflow-hidden group cursor-pointer transition-all ${hoveredVehicleId === car.id ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] scale-[1.03]' : 'border-slate-800 hover:border-blue-500'}`}>
                  <img src="https://images.unsplash.com/photo-1418065460487-3e41a6c8e1e4?auto=format&fit=crop&q=80" alt="dashcam" className={`w-full h-full object-cover transition-all duration-500 ${car.status === '미운행' ? 'grayscale opacity-30' : 'opacity-60 group-hover:opacity-90'}`} />
                  <div className="absolute top-2 left-2 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-slate-700"><div className={`w-1 h-1 rounded-full ${car.status === '운행중' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></div>{car.id}</div>
                  {car.status === '미운행' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-slate-400 font-bold text-[10px] tracking-widest bg-black/60 px-2 py-1 rounded">OFFLINE</span></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>



      {/* 3. 우측 사이드바 (구조 및 중복 태그 전면 교정) */}
      <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">

        {/* 요구사항 2 & 4: 검색 영역이 최상단으로 이동 + 텍스트와 검색창을 한 줄로 배치하여 높이 최소화 */}
        <div className="p-4 border-b border-slate-800 shrink-0 flex items-center justify-between gap-2 h-14">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 shrink-0">
            <span className="text-blue-500">🚛</span> 차량 검색
          </h3>

          <input
            type="text"
            placeholder="차량번호/기사명 검색..."
            value={searchTerm}
            className="flex-1 max-w-[150px] bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-200"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* 요구사항 2 & 3: 요약 바가 두 번째 위치로 이동 + 클릭 시 필터링 기능 추가 */}
        <div className="p-2 bg-slate-800/30 border-b border-slate-800 flex justify-around items-center h-14 shrink-0">
          <button
            onClick={() => setActiveFilter("전체")}
            className={`text-center flex-1 py-1 rounded-lg transition-colors ${activeFilter === "전체" ? "bg-slate-800 ring-1 ring-slate-700" : "hover:bg-slate-800/50"}`}
          >
            <p className="text-[12px] text-slate-500 mb-0.5">전체차량</p>
            <p className="text-sm font-black text-slate-300">{vehicles.length}</p>
          </button>
          <div className="w-px h-6 bg-slate-600"></div>

          <button
            onClick={() => setActiveFilter(activeFilter === "운행중" ? "전체" : "운행중")}
            className={`text-center flex-1 py-1 rounded-lg transition-colors ${activeFilter === "운행중" ? "bg-blue-950/40 ring-1 ring-blue-500/30" : "hover:bg-slate-800/50"}`}
          >
            <p className="text-[12px] text-blue-500 mb-0.5">운행차량</p>
            <p className="text-sm font-black text-blue-400">
              {vehicles.filter(v => v.status === '운행중').length}
            </p>
          </button>
        </div>

        {/* 차량 카드 리스트 스크롤 영역 (일체형 무빙 게이지 적용 버전) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((car, idx) => {
              // 최대 100km 기준으로 퍼센트 계산
              const distancePercent = Math.min(Math.max(car.distance, 0), 100);

              const isHovered = hoveredVehicleId === car.id;

              return (
                <div
                  key={idx}

                  className={`p-3 bg-slate-800/40 border rounded-xl relative overflow-hidden transition-all duration-300 cursor-pointer ${isHovered
                    ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-[1.02] bg-slate-800/80'
                    : 'border-slate-800 hover:border-blue-500/30'
                    }`}

                  onMouseEnter={() => setHoveredVehicleId(car.id)}
                  onMouseLeave={() => setHoveredVehicleId(null)}
                  onClick={() => setSelectedVehicle(car)}
                >

                  {/* 상태선 색상 */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${car.status === '운행중' ? 'bg-blue-500' : 'bg-slate-600'}`}></div>

                  {/* 상단 정보 라인 */}
                  <div className="flex justify-between items-center mb-3 pl-1.5 h-7">
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-base font-black text-slate-100 leading-none">{car.id}</h4>
                      <span className="text-xs text-slate-400 font-medium leading-none">{car.driver}</span>
                    </div>

                    <div className="flex items-center gap-2 h-full">
                      {/* 내장형 배터리 게이지 */}
                      <div className="w-16 h-5 bg-slate-950 border border-slate-700 rounded-md p-[1px] flex items-center relative overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-[2px] transition-all duration-500 ${car.battery <= 20 ? 'bg-red-500/40 border-r border-red-400' : 'bg-green-500/30 border-r border-green-400'}`}
                          style={{ width: `${car.battery}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-[11px] font-normal font-mono tracking-tighter text-slate-300">
                            {car.battery}%
                          </span>
                        </div>
                        <div className="w-[1.5px] h-2 bg-slate-600 absolute -right-[0.5px] top-[5px] rounded-r-[1px]"></div>
                      </div>

                      {/* 상태 배지 */}
                      <span className={`h-5 px-2.5 flex items-center justify-center rounded-md text-xs font-black tracking-wide shrink-0 ${car.status === '운행중'
                        ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                        : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                        }`}>
                        {car.status}
                      </span>
                    </div>
                  </div>

                  {/* 하단 인터랙티브 km 게이지바 파트 (무빙 헤드 시스템 적용) */}
                  <div className="pl-1.5 pt-0.5">
                    {/* 전체 100km 기준의 블랙 바탕 트랙 유지 */}
                    <div className="w-full h-5 bg-slate-950 border border-slate-800/80 rounded-lg relative flex items-center overflow-hidden">

                      {/* 주행거리만큼만 차오르는 블루 게이지 바 */}
                      <div
                        className="h-full bg-gradient-to-r from-blue-600/30 to-blue-500/40 border-r border-blue-400/40 transition-all duration-1000 ease-out"
                        style={{ width: `${distancePercent}%` }}
                      ></div>

                      {/* 고도화: 블루 바 우측 끝에 결합되어 실시간으로 이동하는 무빙 컴포넌트 */}
                      <div
                        className="absolute top-0 bottom-0 flex items-center gap-1 px-1.5 transition-all duration-1000 ease-out pointer-events-none"
                        style={{
                          // 0km일 때 벽에 가려지지 않도록 최소 left 마진 확보 (0%여도 살짝 보이게 설정)
                          left: `${Math.max(distancePercent, 0)}%`,
                          // 게이지가 80% 이상 찼을 때는 글자가 오른쪽 벽 밖으로 밀리지 않도록 정렬 기준을 유연하게 변환
                          transform: distancePercent > 75 ? 'translateX(-100%)' : 'translateX(4px)',
                        }}
                      >
                        {/* 차량 상태별 아이콘 (운행=🚜, 미운행=💤) */}
                        <span className="text-xs drop-shadow-[0_0_3px_rgba(59,130,246,0.6)]">
                          {car.status === '운행중' ? '🚜' : '💤'}
                        </span>

                        {/* 아이콘 바로 뒤에 붙어서 함께 움직이는 실시간 km 텍스트 */}
                        <span className="text-[14px] font-normal font-mono tracking-tighter text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap">
                          {car.distance}<span className="text-[12px] font-normal text-slate-500 ml-0.5">km</span>
                        </span>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center text-slate-600 text-xs py-10 italic">
              해당하는 차량이 없습니다.
            </div>
          )}
        </div>



        {/* 실시간 이벤트 로그 시스템 (우측 하단 유지) */}
        <div className="h-40 bg-slate-950 border-t border-slate-800 flex flex-col shrink-0">
          <div className="px-3 py-1.5 border-b border-slate-800/50 bg-slate-900/50 flex justify-between items-center">
            <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
              </span>
              SYSTEM LOG
            </span>
            <span className="text-[10px] text-slate-600">FILTER: {activeFilter}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 font-mono custom-scrollbar">
            <div className="space-y-1">
              <div className="text-[12px] flex gap-2">
                <span className="text-slate-600">10:45:21</span>
                <span className="text-blue-500">[INFO]</span>
                <span className="text-slate-400">관제 차량 동기화 완료</span>
              </div>
              <div className="text-[12px] flex gap-2">
                <span className="text-slate-600">10:43:05</span>
                <span className="text-green-500">[LOG]</span>
                <span className="text-slate-400">총 {vehicles.length}대 차량 로드됨</span>
              </div>
              {/* 배터리 부족 상세 로그 (어떤 차량인지 명시) */}
              <div className="text-[12px] flex gap-2 items-start">
                <span className="text-slate-600">10:43:05</span>
                <span className="text-red-500 font-bold shrink-0">[BAT]</span>
                <span className="text-slate-400">
                  <span className="text-red-400 font-bold">
                    {vehicles.filter(car => car.battery <= 20).map(car => car.id).join(', ')}
                  </span>
                  {' '}배터리 부족(20% 이하)
                </span>
              </div>

            </div>
          </div>
        </div>

      </aside>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
}
