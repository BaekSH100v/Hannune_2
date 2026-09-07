"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { initialVehicles, loadVehicles, type VehicleRecord } from './data/vehicles';

const workAreas = [
  { area: '강남 A구역', route: '테헤란로 · 영동대로', status: '진행중', progress: 82, updated: '5분 전' },
  { area: '서초 B구역', route: '반포대로 · 서초대로', status: '진행중', progress: 64, updated: '8분 전' },
  { area: '송파 C구역', route: '올림픽로 · 위례성대로', status: '완료', progress: 100, updated: '21분 전' },
  { area: '강동 D구역', route: '천호대로 · 양재대로', status: '대기', progress: 18, updated: '12분 전' },
];

const materials = [
  { name: '염화칼슘', amount: '142.5톤', percent: 68, state: '양호', tone: 'bg-blue-500' },
  { name: '소금', amount: '86.2톤', percent: 54, state: '양호', tone: 'bg-cyan-500' },
  { name: '친환경 제설제', amount: '31.4톤', percent: 24, state: '보충 필요', tone: 'bg-amber-500' },
  { name: '모래', amount: '58.0톤', percent: 41, state: '보통', tone: 'bg-slate-500' },
];

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-black tracking-[0.18em] text-blue-400">{eyebrow}</p>
        <h2 className="mt-1 text-base font-black tracking-tight text-white">{title}</h2>
        {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default function SupportDashboardPage() {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(initialVehicles);
  const [smsOpen, setSmsOpen] = useState(false);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [smsMessage, setSmsMessage] = useState('');

  useEffect(() => {
    setVehicles(loadVehicles());
  }, []);

  const vehicleSummary = useMemo(() => {
    const running = vehicles.filter((vehicle) => vehicle.status === '운행중').length;
    const stopped = vehicles.filter((vehicle) => vehicle.status === '미운행').length;
    const commError = vehicles.filter((vehicle) => vehicle.status === '통신이상').length;
    return [
      { label: '운행중', value: running, tone: 'bg-emerald-400' },
      { label: '미운행', value: stopped, tone: 'bg-slate-400' },
      { label: '통신이상', value: commError, tone: 'bg-rose-400' },
    ];
  }, [vehicles]);

  const runningCount = vehicleSummary[0].value;
  const runningRate = vehicles.length > 0 ? Math.round((runningCount / vehicles.length) * 100) : 0;

  const areaVehicleCount = (area: string) => vehicles.filter((vehicle) => vehicle.area === area).length;

  const openSmsModal = () => {
    setVehicles(loadVehicles());
    setSmsOpen(true);
  };

  const toggleVehicle = (id: string) => {
    setSelectedVehicleIds((current) =>
      current.includes(id) ? current.filter((vehicleId) => vehicleId !== id) : [...current, id],
    );
  };

  const toggleAllVehicles = () => {
    if (selectedVehicleIds.length === vehicles.length) {
      setSelectedVehicleIds([]);
      return;
    }
    setSelectedVehicleIds(vehicles.map((vehicle) => vehicle.id));
  };

  const handleSendSms = () => {
    if (selectedVehicleIds.length === 0) {
      window.alert('문자를 받을 차량을 선택해 주세요.');
      return;
    }
    if (!smsMessage.trim()) {
      window.alert('발송할 문자 내용을 작성해 주세요.');
      return;
    }

    window.alert(`프로토타입 문자 발송 요청\n대상 ${selectedVehicleIds.length}명\n\n${smsMessage.trim()}`);
    setSmsOpen(false);
    setSelectedVehicleIds([]);
    setSmsMessage('');
  };

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950">
      <div className="mx-auto w-full max-w-[1640px] px-5 py-6 lg:px-7 xl:px-8">
        <section className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black tracking-[0.12em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                OPERATION NORMAL
              </span>
              <span className="text-[10px] font-bold text-slate-600">업무 데이터 프로토타입</span>
            </div>
            <h1 className="text-2xl font-black tracking-[-0.03em] text-white lg:text-3xl">제설업무 운영 대시보드</h1>
            <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-400 lg:text-sm">
              구역별 제설 작업, 차량 운영 상태와 주요 제설자재 현황을 한 화면에서 확인합니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/sup/vehicle" className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800">
              차량 관리
            </Link>
            <Link href="/sup/stock" className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-black text-white shadow-[0_8px_24px_rgba(37,99,235,0.22)] transition hover:bg-blue-500">
              자재 현황 보기
            </Link>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.55fr_0.85fr]">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 shadow-lg">
            <SectionHeader
              eyebrow="TODAY'S OPERATION"
              title="금일 구역별 제설 작업 현황"
              description="차량관리에서 지정한 담당구역을 기준으로 현재 투입 차량 수를 표시합니다."
              action={<span className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-[10px] font-bold text-slate-500">4개 주요 구역</span>}
            />

            <div className="mt-5 space-y-3">
              {workAreas.map((work) => {
                const assignedVehicles = areaVehicleCount(work.area);
                return (
                  <div key={work.area} className="rounded-xl border border-slate-800/70 bg-slate-950/45 p-4 transition hover:border-slate-700">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-slate-100">{work.area}</p>
                          <span className={`rounded-md px-2 py-0.5 text-[9px] font-black ${
                            work.status === '완료'
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : work.status === '진행중'
                                ? 'bg-blue-500/10 text-blue-300'
                                : 'bg-slate-800 text-slate-400'
                          }`}>
                            {work.status}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500">{work.route}</p>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                        <span className="rounded-md bg-blue-500/10 px-2 py-1 text-blue-300">투입 {assignedVehicles}대</span>
                        <span>{work.updated}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full ${work.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${work.progress}%` }}
                        />
                      </div>
                      <span className="w-10 text-right font-mono text-xs font-black text-slate-300">{work.progress}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 shadow-lg">
            <SectionHeader
              eyebrow="FLEET STATUS"
              title="차량 운영 현황"
              description={`차량관리 등록 ${vehicles.length}대 기준 실시간 상태 요약`}
              action={<Link href="/sup/vehicle" className="text-[10px] font-black text-blue-400 hover:text-blue-300">상세보기 →</Link>}
            />

            <div className="mt-5 rounded-2xl border border-slate-800/70 bg-slate-950/50 p-5 text-center">
              <p className="font-mono text-5xl font-black tracking-tight text-white">{runningRate}<span className="ml-1 text-xl text-blue-400">%</span></p>
              <p className="mt-1 text-[11px] font-bold text-slate-500">현재 차량 운행률</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${runningRate}%` }} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {vehicleSummary.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.tone}`} />
                    <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                  </div>
                  <p className="mt-2 font-mono text-xl font-black text-slate-100">{item.value}<span className="ml-1 text-[10px] font-bold text-slate-600">대</span></p>
                </div>
              ))}
            </div>

            <button
              onClick={openSmsModal}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-black text-rose-300 transition hover:border-rose-400/50 hover:bg-rose-500/15 hover:text-rose-200"
            >
              <span>✉</span>
              비상 문자 발송
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 shadow-lg">
          <SectionHeader
            eyebrow="MATERIAL STATUS"
            title="주요 제설자재 현황"
            description="전체 저장소 기준 재고 수준을 요약합니다."
            action={<Link href="/sup/stock" className="text-[10px] font-black text-blue-400 hover:text-blue-300">재고관리 →</Link>}
          />

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {materials.map((material) => (
              <div key={material.name} className="rounded-xl border border-slate-800/70 bg-slate-950/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-slate-200">{material.name}</p>
                    <p className="mt-2 font-mono text-xl font-black text-white">{material.amount}</p>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-[9px] font-black ${material.state === '보충 필요' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                    {material.state}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full ${material.tone}`} style={{ width: `${material.percent}%` }} />
                  </div>
                  <span className="font-mono text-[10px] font-black text-slate-500">{material.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {smsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-rose-400">EMERGENCY MESSAGE</p>
                <h3 className="mt-1 text-lg font-black text-white">비상 문자 발송</h3>
                <p className="mt-1 text-[11px] text-slate-500">발송 대상을 선택하고 문자 내용을 직접 작성해 주세요.</p>
              </div>
              <button
                onClick={() => setSmsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-lg text-slate-400 transition hover:text-white"
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            <div className="grid min-h-0 flex-1 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="min-h-0 border-b border-slate-800 p-5 lg:border-b-0 lg:border-r">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-white">발송 대상 차량</p>
                    <p className="mt-1 text-[10px] text-slate-500">차량관리의 등록 정보를 불러옵니다.</p>
                  </div>
                  <button onClick={toggleAllVehicles} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[10px] font-bold text-slate-300 hover:bg-slate-800">
                    {selectedVehicleIds.length === vehicles.length ? '전체 해제' : '전체 선택'}
                  </button>
                </div>

                <div className="max-h-[48vh] overflow-y-auto rounded-xl border border-slate-800">
                  <table className="w-full min-w-[620px] text-left text-xs">
                    <thead className="sticky top-0 bg-slate-950 text-slate-500">
                      <tr>
                        <th className="w-12 p-3 text-center">선택</th>
                        <th className="p-3">이름</th>
                        <th className="p-3">차량명</th>
                        <th className="p-3">차량번호</th>
                        <th className="p-3">연락처</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {vehicles.map((vehicle) => {
                        const checked = selectedVehicleIds.includes(vehicle.id);
                        return (
                          <tr key={vehicle.id} onClick={() => toggleVehicle(vehicle.id)} className={`cursor-pointer transition ${checked ? 'bg-blue-500/10' : 'hover:bg-slate-800/50'}`}>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleVehicle(vehicle.id)}
                                onClick={(event) => event.stopPropagation()}
                                className="h-4 w-4 accent-blue-600"
                              />
                            </td>
                            <td className="p-3 font-bold text-slate-200">{vehicle.driver}</td>
                            <td className="p-3 text-slate-300">{vehicle.name}</td>
                            <td className="p-3 font-mono text-slate-400">{vehicle.plate}</td>
                            <td className="p-3 font-mono text-slate-400">{vehicle.phone}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-white">문자 내용</p>
                  <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-black text-blue-300">{selectedVehicleIds.length}명 선택</span>
                </div>
                <textarea
                  value={smsMessage}
                  onChange={(event) => setSmsMessage(event.target.value)}
                  placeholder="비상 문자 내용을 직접 입력하세요."
                  className="mt-3 min-h-52 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <p className="mt-2 text-right text-[10px] text-slate-600">{smsMessage.length}자</p>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => setSmsOpen(false)} className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-bold text-slate-300 transition hover:bg-slate-700">
                    취소
                  </button>
                  <button onClick={handleSendSms} className="flex-[1.4] rounded-xl bg-blue-600 px-4 py-3 text-xs font-black text-white shadow-[0_8px_24px_rgba(37,99,235,0.24)] transition hover:bg-blue-500">
                    선택 대상 문자 발송
                  </button>
                </div>
                <p className="mt-3 text-[10px] leading-5 text-slate-600">현재는 프로토타입으로 실제 SMS API 발송 대신 발송 대상과 문구를 확인합니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
