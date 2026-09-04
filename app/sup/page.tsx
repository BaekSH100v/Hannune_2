import Link from 'next/link';

const kpis = [
  {
    label: '금일 제설 작업',
    value: '12',
    unit: '건',
    sub: '완료 7 · 진행 4 · 대기 1',
    tone: 'blue',
    icon: '01',
  },
  {
    label: '운영 차량',
    value: '11',
    unit: '/ 15대',
    sub: '운행률 73%',
    tone: 'emerald',
    icon: '02',
  },
  {
    label: '작업 완료율',
    value: '78',
    unit: '%',
    sub: '전일 대비 +12%',
    tone: 'cyan',
    icon: '03',
  },
  {
    label: '금일 자재 사용',
    value: '38.5',
    unit: '톤',
    sub: '염화칼슘 24.2톤 사용',
    tone: 'amber',
    icon: '04',
  },
  {
    label: '보고서 처리',
    value: '8',
    unit: '/ 10건',
    sub: '미작성 2건',
    tone: 'violet',
    icon: '05',
  },
  {
    label: '확인 필요',
    value: '3',
    unit: '건',
    sub: '재고 1 · 차량 1 · 승인 1',
    tone: 'rose',
    icon: '06',
  },
];

const workAreas = [
  { area: '강남 A구역', route: '테헤란로 · 영동대로', status: '진행중', progress: 82, vehicles: 3, updated: '5분 전' },
  { area: '서초 B구역', route: '반포대로 · 서초대로', status: '진행중', progress: 64, vehicles: 2, updated: '8분 전' },
  { area: '송파 C구역', route: '올림픽로 · 위례성대로', status: '완료', progress: 100, vehicles: 2, updated: '21분 전' },
  { area: '강동 D구역', route: '천호대로 · 양재대로', status: '대기', progress: 18, vehicles: 1, updated: '12분 전' },
];

const vehicleSummary = [
  { label: '운행중', value: 11, tone: 'bg-emerald-400' },
  { label: '대기', value: 2, tone: 'bg-blue-400' },
  { label: '정비 필요', value: 1, tone: 'bg-amber-400' },
  { label: '통신 이상', value: 1, tone: 'bg-rose-400' },
];

const materials = [
  { name: '염화칼슘', amount: '142.5톤', percent: 68, state: '양호', tone: 'bg-blue-500' },
  { name: '소금', amount: '86.2톤', percent: 54, state: '양호', tone: 'bg-cyan-500' },
  { name: '친환경 제설제', amount: '31.4톤', percent: 24, state: '보충 필요', tone: 'bg-amber-500' },
  { name: '모래', amount: '58.0톤', percent: 41, state: '보통', tone: 'bg-slate-500' },
];

const tasks = [
  { type: '승인', title: '서초 제3저장소 염화칼슘 5톤 출고 요청', meta: 'REQ-042 · 10분 전', tone: 'blue' },
  { type: '차량', title: '12호 차량 제설기 유압 계통 점검 필요', meta: '정비 알림 · 23분 전', tone: 'amber' },
  { type: '재고', title: '친환경 제설제 안전재고 기준 미만', meta: '강남 저장소 · 35분 전', tone: 'rose' },
  { type: '보고', title: '강남 A구역 작업일지 미작성', meta: '마감 18:00 · 담당 김제설', tone: 'violet' },
];

const recentReports = [
  { id: 'RPT-260904-07', title: '송파 C구역 제설작업 완료보고', author: '윤제설', time: '16:42', status: '완료' },
  { id: 'RPT-260904-06', title: '강남 A구역 2차 제설작업 중간보고', author: '김제설', time: '16:18', status: '검토중' },
  { id: 'RPT-260904-05', title: '서초 B구역 자재 추가투입 보고', author: '정제설', time: '15:54', status: '완료' },
];

const toneMap: Record<string, string> = {
  blue: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
  emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  cyan: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
  amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  violet: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
  rose: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
};

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
              오늘의 제설 작업, 차량 운영, 자재 재고와 미처리 업무를 한 화면에서 확인합니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/sup/report" className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800">
              보고서 관리
            </Link>
            <Link href="/sup/vehicle" className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800">
              차량 관리
            </Link>
            <Link href="/sup/stock" className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-black text-white shadow-[0_8px_24px_rgba(37,99,235,0.22)] transition hover:bg-blue-500">
              자재 현황 보기
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
          {kpis.map((item) => (
            <div key={item.label} className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/65 p-4 shadow-sm">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/[0.04] blur-2xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-500">{item.label}</p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="font-mono text-2xl font-black tracking-tight text-white lg:text-3xl">{item.value}</span>
                    <span className="text-xs font-black text-slate-400">{item.unit}</span>
                  </div>
                </div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border text-[10px] font-black ${toneMap[item.tone]}`}>
                  {item.icon}
                </div>
              </div>
              <p className="relative mt-3 truncate text-[10px] font-bold text-slate-600">{item.sub}</p>
            </div>
          ))}
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_0.85fr_0.9fr]">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 shadow-lg">
            <SectionHeader
              eyebrow="TODAY'S OPERATION"
              title="금일 구역별 제설 작업 현황"
              description="구역별 진행률과 투입 차량을 기준으로 현재 작업 우선순위를 확인합니다."
              action={<span className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-[10px] font-bold text-slate-500">4개 주요 구역</span>}
            />

            <div className="mt-5 space-y-3">
              {workAreas.map((work) => (
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
                      <span>차량 {work.vehicles}대</span>
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
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 shadow-lg">
            <SectionHeader
              eyebrow="FLEET STATUS"
              title="차량 운영 현황"
              description="전체 15대 기준 실시간 상태 요약"
              action={<Link href="/sup/vehicle" className="text-[10px] font-black text-blue-400 hover:text-blue-300">상세보기 →</Link>}
            />

            <div className="mt-5 rounded-2xl border border-slate-800/70 bg-slate-950/50 p-5 text-center">
              <p className="font-mono text-5xl font-black tracking-tight text-white">73<span className="ml-1 text-xl text-blue-400">%</span></p>
              <p className="mt-1 text-[11px] font-bold text-slate-500">현재 차량 운행률</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[73%] rounded-full bg-blue-500" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
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
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 shadow-lg">
            <SectionHeader
              eyebrow="MATERIAL STOCK"
              title="주요 제설자재 현황"
              description="전체 저장소 가용 재고 기준"
              action={<Link href="/sup/stock" className="text-[10px] font-black text-blue-400 hover:text-blue-300">재고관리 →</Link>}
            />

            <div className="mt-5 space-y-4">
              {materials.map((material) => (
                <div key={material.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-slate-200">{material.name}</p>
                      <p className="mt-0.5 font-mono text-[10px] font-bold text-slate-600">{material.amount}</p>
                    </div>
                    <span className={`rounded-md px-2 py-1 text-[9px] font-black ${material.state === '보충 필요' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                      {material.state}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full ${material.tone}`} style={{ width: `${material.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-amber-500/15 bg-amber-500/[0.06] p-3">
              <p className="text-[10px] font-black tracking-wide text-amber-300">LOW STOCK ALERT</p>
              <p className="mt-1 text-[11px] leading-5 text-slate-400">친환경 제설제가 안전재고 30% 아래로 내려갔습니다.</p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.25fr]">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 shadow-lg">
            <SectionHeader
              eyebrow="ACTION REQUIRED"
              title="확인 및 처리 필요 업무"
              description="오늘 업무 마감 전 확인이 필요한 항목입니다."
            />

            <div className="mt-4 space-y-2">
              {tasks.map((task) => (
                <div key={task.title} className="group flex items-start gap-3 rounded-xl border border-slate-800/70 bg-slate-950/40 p-3.5 transition hover:border-slate-700 hover:bg-slate-950/65">
                  <span className={`mt-0.5 rounded-md border px-2 py-1 text-[9px] font-black ${toneMap[task.tone]}`}>
                    {task.type}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-200 group-hover:text-white">{task.title}</p>
                    <p className="mt-1 text-[10px] font-medium text-slate-600">{task.meta}</p>
                  </div>
                  <span className="text-xs text-slate-700 group-hover:text-blue-400">→</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 shadow-lg">
            <SectionHeader
              eyebrow="RECENT REPORTS"
              title="최근 작업 보고서"
              description="최근 등록·검토된 제설 작업 보고서를 빠르게 확인합니다."
              action={<Link href="/sup/report" className="text-[10px] font-black text-blue-400 hover:text-blue-300">전체 보고서 →</Link>}
            />

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/70">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-slate-950/80 px-4 py-2.5 text-[9px] font-black tracking-wide text-slate-600 sm:grid-cols-[130px_1fr_80px_70px]">
                <span className="hidden sm:block">보고번호</span>
                <span>보고서</span>
                <span>작성자</span>
                <span className="hidden sm:block">상태</span>
              </div>
              <div className="divide-y divide-slate-800/60">
                {recentReports.map((report) => (
                  <div key={report.id} className="grid grid-cols-[1fr_auto_auto] gap-4 bg-slate-900/20 px-4 py-3.5 transition hover:bg-slate-800/35 sm:grid-cols-[130px_1fr_80px_70px] sm:items-center">
                    <span className="hidden font-mono text-[10px] font-bold text-slate-600 sm:block">{report.id}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-200">{report.title}</p>
                      <p className="mt-1 text-[9px] text-slate-600 sm:hidden">{report.id} · {report.time}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{report.author}</span>
                    <span className={`hidden rounded-md px-2 py-1 text-center text-[9px] font-black sm:block ${report.status === '완료' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-blue-500/10 text-blue-300'}`}>
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
