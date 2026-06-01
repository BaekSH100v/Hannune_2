"use client";

import React, { useState } from 'react';

// 💡 샘플 데이터 생성 로직 (기존 유지)
const generateMonthlyData = (baseKm: number) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return days.map(day => ({
    day,
    km: day <= 10 ? Math.floor(Math.random() * 50) + baseKm : 0
  }));
};

const vehicleReportData = [
  {
    id: '01호', name: '제설 1호기', plate: '88바 1001', driver: '최긴급', type: '관용',
    monthlyStats: generateMonthlyData(20),
    totalMonthlyKm: 412.5,
    hourlyData: [
      { time: '08:00', km: 12.5 }, { time: '09:00', km: 22.1 }, { time: '10:00', km: 15.4 },
      { time: '11:00', km: 8.2 }, { time: '12:00', km: 0.0 }, { time: '13:00', km: 25.3 },
      { time: '14:00', km: 32.1 }, { time: '15:00', km: 18.2 }, { time: '16:00', km: 8.7 }
    ]
  },
  {
    id: '02호', name: '제설 2호기', plate: '88바 1002', driver: '박대기', type: '관용',
    monthlyStats: generateMonthlyData(15),
    totalMonthlyKm: 328.2,
    hourlyData: [
      { time: '08:00', km: 5.2 }, { time: '09:00', km: 10.1 }, { time: '10:00', km: 12.4 },
      { time: '11:00', km: 15.2 }, { time: '12:00', km: 4.0 }, { time: '13:00', km: 15.3 },
      { time: '14:00', km: 12.1 }, { time: '15:00', km: 10.2 }, { time: '16:00', km: 13.7 }
    ]
  },
  {
    id: '03호', name: '제설 3호기', plate: '88바 1003', driver: '이방빙', type: '임대',
    monthlyStats: generateMonthlyData(30),
    totalMonthlyKm: 580.4,
    hourlyData: [
      { time: '08:00', km: 25.5 }, { time: '09:00', km: 30.1 }, { time: '10:00', km: 28.4 },
      { time: '11:00', km: 22.2 }, { time: '12:00', km: 5.0 }, { time: '13:00', km: 35.3 },
      { time: '14:00', km: 42.1 }, { time: '15:00', km: 12.2 }, { time: '16:00', km: 9.6 }
    ]
  },
];

export default function ReportPage() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('05');

  // 💡 상태 관리: 선택된 차량과 선택된 '일자'를 동시에 관리
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(vehicleReportData[0]);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <main className="flex-1 p-6 max-w-[1800px] w-full mx-auto space-y-6 animate-in fade-in duration-500">

      {/* 1. 상단 필터 영역 (기존 유지) */}
      <div className="flex flex-wrap items-end justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
        <div className="flex gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">조회 연도</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block w-32 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="2026">2026년</option>
              <option value="2025">2025년</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">조회 월</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-32 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            >
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-lg border border-slate-700 transition-all active:scale-95 flex items-center gap-2">
            <span>🔍</span> 리포트 조회
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95 flex items-center gap-2">
            <span>📥</span> 엑셀 출력
          </button>
        </div>
      </div>

      {/* 2. 차량별 운행 요약 (숫자 클릭 시 데이터 연동) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30 shrink-0">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              {selectedYear}년 {selectedMonth}월 차량별 일일 주행 현황
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              (조회하고 싶은 날짜의 숫자를 클릭하세요)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar border border-slate-800 rounded-xl">
          <table className="w-full text-left text-[11px] border-collapse table-fixed">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3 w-12 sticky left-0 bg-slate-950 z-20">No.</th>
                <th className="p-3 w-32 sticky left-12 bg-slate-950 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">차량명/번호</th>
                <th className="p-3 w-20">운전자</th>
                {daysArray.map(day => (
                  <th key={day} className="p-2 w-10 text-center border-l border-slate-800/30 font-mono">{day}</th>
                ))}
                <th className="p-3 w-24 text-right bg-slate-900 font-bold text-blue-400">월간 합계</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {vehicleReportData.map((car, idx) => (
                <tr key={car.id} className="group transition-colors">
                  <td className="p-3 sticky left-0 bg-slate-900 group-hover:bg-slate-800 transition-colors z-10">{idx + 1}</td>
                  <td className="p-3 sticky left-12 bg-slate-900 group-hover:bg-slate-800 transition-colors z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200">{car.id}</span>
                      <span className="text-[9px] text-slate-500">{car.plate}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-400">{car.driver}</td>

                  {/* 💡 일별 주행거리 데이터 셀: 클릭 시 해당 차량과 날짜 선택 */}
                  {car.monthlyStats.map((stat, i) => {
                    const isSelected = selectedVehicle?.id === car.id && selectedDay === stat.day;
                    return (
                      <td
                        key={i}
                        onClick={() => {
                          setSelectedVehicle(car);
                          setSelectedDay(stat.day);
                        }}
                        className={`p-2 text-center border-l border-slate-800/20 font-mono cursor-pointer transition-all
                          ${stat.km > 0 ? 'hover:bg-blue-600/40 hover:text-white text-slate-200' : 'text-slate-700 hover:bg-slate-800'}
                          ${isSelected ? 'bg-blue-600 text-white font-black ring-1 ring-inset ring-blue-400 z-10' : ''}
                        `}
                      >
                        {stat.km > 0 ? stat.km : '-'}
                      </td>
                    );
                  })}

                  <td className="p-3 text-right bg-slate-900/50 z-10">
                    <span className="font-mono font-black text-blue-400">{car.totalMonthlyKm}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. 하단: 선택된 차량 및 날짜 기반 상세 분석 */}
      <div className="animate-in slide-in-from-bottom-4 duration-500">
        {selectedVehicle ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-6">

            {/* 세부 타이틀 바 */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                  <span className="text-2xl">🚛</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-black text-white">{selectedVehicle.id} 시간대별 상세 분석</h3>
                    <span className="bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded text-slate-400 border border-slate-700">{selectedVehicle.plate}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    운전자: {selectedVehicle.driver} | 구분: {selectedVehicle.type} | <span className="text-blue-400 font-bold">일자: {selectedYear}-{selectedMonth}-{String(selectedDay).padStart(2, '0')}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-widest">Selected Day Total</span>
                <span className="text-3xl font-mono font-black text-blue-400">
                  {/* 💡 에러 수정 완료: 데이터가 없을 때를 대비한 안전장치(?.) 추가 */}
                  {selectedVehicle?.monthlyStats?.find((s: any) => s.day === selectedDay)?.km || 0}
                  <span className="text-sm font-sans text-slate-500 ml-1">km</span>
                </span>
              </div>
            </div>

            {/* 💡 황금비 분할: 가로 3/4(차트+요약) + 1/4(이동경로 가상 지도) 구조 */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

              {/* 🟩 가로 3/4 파트: 시간대별 상세분석 차트 + 분석 요약 카드 */}
              <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 왼쪽: 시간대별 이동 추이 바 차트 */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 flex items-center gap-2">🕒 시간대별 이동 추이</h4>
                  <div className="flex flex-col gap-2.5">
                    {selectedVehicle.hourlyData.map((data: any, i: number) => {
                      const barWidth = Math.min((data.km / 45) * 100, 100);
                      return (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="w-12 text-[10px] font-mono font-bold text-slate-500">{data.time}</div>
                          <div className="flex-1 h-7 bg-slate-950 rounded-md border border-slate-800/50 relative overflow-hidden flex items-center">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600/30 to-blue-400/50 border-r-2 border-blue-500 transition-all duration-1000"
                              style={{ width: `${barWidth}%` }}
                            ></div>
                            <div className="absolute left-3 text-[10px] font-mono font-black text-slate-300">
                              {data.km > 0 ? `${data.km} km` : ''}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 오른쪽: 운행 분석 요약 텍스트 */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-slate-400">📝 운행 분석 요약</h4>
                  <div className="bg-slate-950/50 rounded-xl border border-slate-800/60 p-5 space-y-4 flex-1">
                    <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                      <span className="text-xs text-slate-500">최대 이동 시간대</span>
                      <span className="text-xs font-bold text-blue-400">14:00 (32.1 km)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                      <span className="text-xs text-slate-500">평균 시속</span>
                      <span className="text-xs font-bold text-slate-200">24.5 km/h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">특이사항</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">정상 운행</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed pt-2">
                      * {selectedDay}일자 데이터를 분석한 결과입니다. 오전 집중 작업 후 오후에는 거점 이동이 감지되었습니다.
                    </p>
                  </div>
                  <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl border border-slate-700 transition-all shadow-sm">
                    📥 해당 데이터 리포트 인쇄
                  </button>
                </div>

              </div>

              {/* 🟦 가로 1/4 파트: 상세운행경로 지도 보기 (가상 네비게이션) */}
              <div className="xl:col-span-1 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-400 flex items-center gap-2">🗺️ 일자별 상세 운행 경로</h4>

                <div className="flex-1 min-h-[340px] bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between p-4 group shadow-inner">
                  {/* 사이버네틱 그리드 배경 */}
                  <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:14px_14px]"></div>

                  {/* 이동 경로 네비게이션 가상 그래픽 (SVG) */}
                  <svg className="absolute inset-0 w-full h-full p-8 overflow-visible" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    {/* 점선 궤적 */}
                    <path
                      d="M 25 175 C 35 110, 55 120, 90 90 C 130 50, 110 110, 175 35"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="6 4"
                      className="animate-[dash_30s_linear_infinite]"
                    />
                    {/* 실선 펄스 (글로우 효과) */}
                    <path
                      d="M 25 175 C 35 110, 55 120, 90 90 C 130 50, 110 110, 175 35"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="opacity-70"
                    />

                    {/* 출발(START) 핀 */}
                    <circle cx="25" cy="175" r="5" fill="#10b981" />
                    <text x="25" y="165" fill="#10b981" fontSize="9" fontWeight="900" fontFamily="monospace" textAnchor="middle">START</text>

                    {/* 도착(END) 핀 */}
                    <circle cx="175" cy="35" r="5" fill="#ef4444" />
                    <text x="175" y="25" fill="#ef4444" fontSize="9" fontWeight="900" fontFamily="monospace" textAnchor="middle">END</text>

                    {/* 실시간 위치 모방 핀 */}
                    <circle cx="90" cy="90" r="7" fill="#3b82f6" className="animate-ping opacity-40" />
                    <circle cx="90" cy="90" r="3.5" fill="#60a5fa" />
                  </svg>

                  {/* 네비게이션 상태 정보 플로팅 카드 */}
                  <div className="z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 p-3 rounded-xl text-[10px] text-slate-400 font-mono space-y-1 mt-auto shadow-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">지정 구역:</span>
                      <span className="text-slate-200 font-bold">{selectedVehicle.id} 관내 노선</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">추적 일자:</span>
                      <span className="text-blue-400 font-bold">{String(selectedDay).padStart(2, '0')}일</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">상태:</span>
                      <span className="text-emerald-400 font-black tracking-widest animate-pulse">GPS_SYNC</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-slate-900/20 border border-slate-800 border-dashed rounded-3xl h-48 flex flex-col items-center justify-center text-slate-600 gap-3">
            <span className="text-4xl">🖱️</span>
            <p className="text-sm font-bold">상단 테이블의 날짜별 주행거리(숫자)를 클릭하시면 상세 분석이 표시됩니다.</p>
          </div>
        )}
      </div>

    </main>
  );
}