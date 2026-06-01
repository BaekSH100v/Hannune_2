"use client";

import React, { useState } from 'react';

// 💡 초기 샘플 데이터
const initialProfile = {
  name: '제설담당자',
  role: '총괄 관리자',
  department: '종합 관제 상황실',
  phone: '010-9999-8888',
  email: 'admin@hannune.go.kr',
};

const initialManagers = [
  { id: 'm1', name: '김관제', role: '상황실장', dept: '종합 상황실', phone: '02-1234-5678', email: 'kims@hannune.go.kr' },
  { id: 'm2', name: '이현장', role: '현장소장', dept: '강남구청 도로과', phone: '010-2222-3333', email: 'lee@hannune.go.kr' },
  { id: 'm3', name: '박물류', role: '자재반장', dept: '서초 제3저장소', phone: '010-4444-5555', email: 'park@hannune.go.kr' },
];

export default function MyPage() {
  // 1. 내 정보 상태 관리
  const [profile, setProfile] = useState(initialProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(initialProfile);

  // 2. 담당자 리스트 상태 관리
  const [managers, setManagers] = useState(initialManagers);
  const [editingManagerId, setEditingManagerId] = useState<string | null>(null);
  const [managerForm, setManagerForm] = useState<any>({});

  // --- 내 정보 핸들러 ---
  const handleProfileSave = () => {
    setProfile(profileForm);
    setIsEditingProfile(false);
    alert('내 정보가 성공적으로 수정되었습니다.');
  };

  const handleProfileCancel = () => {
    setProfileForm(profile);
    setIsEditingProfile(false);
  };

  // --- 담당자 리스트 핸들러 ---
  const handleManagerEdit = (mgr: any) => {
    setEditingManagerId(mgr.id);
    setManagerForm({ ...mgr });
  };

  const handleManagerChange = (field: string, value: string) => {
    setManagerForm({ ...managerForm, [field]: value });
  };

  const handleManagerSave = () => {
    setManagers(managers.map(mgr => (mgr.id === editingManagerId ? managerForm : mgr)));
    setEditingManagerId(null);
  };

  const handleManagerCancel = () => {
    // 만약 새로 추가 중이던 항목(이름이 없는 등)을 취소하면 배열에서 제거
    if (!managerForm.name && !managerForm.phone) {
      setManagers(managers.filter(mgr => mgr.id !== editingManagerId));
    }
    setEditingManagerId(null);
  };

  const handleManagerDelete = (id: string) => {
    if (confirm('이 담당자를 연락망에서 정말 삭제하시겠습니까?')) {
      setManagers(managers.filter(mgr => mgr.id !== id));
    }
  };

  const handleAddManager = () => {
    const newId = `m${Date.now()}`;
    const newManager = { id: newId, name: '', role: '', dept: '', phone: '', email: '' };
    setManagers([...managers, newManager]);
    setEditingManagerId(newId);
    setManagerForm(newManager);
  };

  return (
    <main className="flex-1 p-6 max-w-[1800px] w-full mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* 상단 타이틀 영역 */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30 shrink-0">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              내 정보 및 담당자 연락망 관리
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              관리자 본인의 프로필을 수정하거나, 시스템에 등록된 타 부서 담당자들의 정보를 관리할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 메인 2단 분할 레이아웃: 좌측(내 정보) / 우측(담당자 관리) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 🟩 좌측: 내 정보 프로필 카드 (4칸 차지) */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🛡️</span> 관리자 프로필 설정
            </h3>
            {!isEditingProfile && (
              <button 
                onClick={() => { setProfileForm(profile); setIsEditingProfile(true); }}
                className="text-xs font-bold text-blue-400 bg-blue-950/30 hover:bg-blue-900/50 border border-blue-900/50 px-3 py-1.5 rounded transition-colors"
              >
                정보 수정
              </button>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 py-2">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] border-4 border-slate-900">
              {profile.name.charAt(0)}
            </div>
            <div className="text-center">
              <h4 className="text-xl font-black text-white">{profile.name}</h4>
              <span className="text-xs font-bold text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-900/30 mt-1 inline-block">
                {profile.role}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-5 space-y-4">
            {isEditingProfile ? (
              // 수정 모드 폼
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">이름</label>
                  <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-slate-900 border border-blue-500 rounded px-3 py-1.5 text-xs text-white outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">직책/권한</label>
                  <input type="text" value={profileForm.role} onChange={(e) => setProfileForm({...profileForm, role: e.target.value})} className="w-full bg-slate-900 border border-blue-500 rounded px-3 py-1.5 text-xs text-white outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">소속 부서</label>
                  <input type="text" value={profileForm.department} onChange={(e) => setProfileForm({...profileForm, department: e.target.value})} className="w-full bg-slate-900 border border-blue-500 rounded px-3 py-1.5 text-xs text-white outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">연락처</label>
                  <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="w-full bg-slate-900 border border-blue-500 rounded px-3 py-1.5 text-xs text-white outline-none font-mono" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">이메일</label>
                  <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full bg-slate-900 border border-blue-500 rounded px-3 py-1.5 text-xs text-white outline-none font-mono" />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button onClick={handleProfileSave} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 rounded transition-colors shadow-md">저장하기</button>
                  <button onClick={handleProfileCancel} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 rounded border border-slate-700 transition-colors">취소</button>
                </div>
              </div>
            ) : (
              // 읽기 모드
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">소속 부서</label>
                  <div className="text-sm font-bold text-slate-200">{profile.department}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">연락처</label>
                  <div className="text-sm font-mono text-slate-300">{profile.phone}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">이메일 계정</label>
                  <div className="text-sm font-mono text-slate-300">{profile.email}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">비밀번호</label>
                  <div className="text-sm font-mono text-slate-500">********</div>
                  <button onClick={() => alert("비밀번호 변경 팝업 (준비중)")} className="text-[10px] text-slate-400 underline hover:text-slate-200 mt-1">비밀번호 변경하기</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🟦 우측: 타 담당자 및 비상연락망 관리 (8칸 차지) */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📋</span> 서브 담당자 및 비상 연락망
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">시스템 권한이 없더라도 비상시 소통할 유관 부서 담당자를 등록하세요.</p>
            </div>
            <button 
              onClick={handleAddManager}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-lg border border-slate-700 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
            >
              + 담당자 추가
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar border border-slate-800 rounded-xl bg-slate-950/30">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 w-24">이름</th>
                  <th className="p-3.5 w-32">소속 / 구역</th>
                  <th className="p-3.5 w-28">직책</th>
                  <th className="p-3.5 w-36">연락처</th>
                  <th className="p-3.5 w-40">이메일</th>
                  <th className="p-3.5 w-24 text-center bg-slate-900">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {managers.map((mgr) => {
                  const isEditing = editingManagerId === mgr.id;
                  
                  return (
                    <tr key={mgr.id} className={`transition-colors ${isEditing ? 'bg-blue-900/20' : 'hover:bg-slate-800/40 group'}`}>
                      <td className="p-3.5">
                        {isEditing ? (
                          <input type="text" placeholder="이름" value={managerForm.name} onChange={(e) => handleManagerChange('name', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none font-bold" />
                        ) : (
                          <span className="font-bold text-slate-200">{mgr.name}</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {isEditing ? (
                          <input type="text" placeholder="소속 입력" value={managerForm.dept} onChange={(e) => handleManagerChange('dept', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none" />
                        ) : (
                          <span className="text-slate-400">{mgr.dept}</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {isEditing ? (
                          <input type="text" placeholder="직책 입력" value={managerForm.role} onChange={(e) => handleManagerChange('role', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none" />
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-slate-800 border border-slate-700 text-slate-300">
                            {mgr.role}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {isEditing ? (
                          <input type="text" placeholder="연락처" value={managerForm.phone} onChange={(e) => handleManagerChange('phone', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none font-mono" />
                        ) : (
                          <span className="font-mono text-slate-300 font-medium">{mgr.phone}</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {isEditing ? (
                          <input type="email" placeholder="이메일" value={managerForm.email} onChange={(e) => handleManagerChange('email', e.target.value)} className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-white outline-none font-mono" />
                        ) : (
                          <span className="font-mono text-slate-500">{mgr.email}</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center bg-slate-900/30">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={handleManagerSave} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded text-[10px] transition-colors">저장</button>
                            <button onClick={handleManagerCancel} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-2.5 py-1 rounded text-[10px] transition-colors">취소</button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleManagerEdit(mgr)} className="bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 font-bold px-2.5 py-1 rounded text-[10px] transition-colors">수정</button>
                            <button onClick={() => handleManagerDelete(mgr.id)} className="bg-slate-800 hover:bg-red-900/30 text-slate-500 hover:text-red-400 border border-slate-700 font-bold px-2.5 py-1 rounded text-[10px] transition-colors">삭제</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {managers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-500 font-bold">
                      등록된 타 담당자가 없습니다. 우측 상단의 추가 버튼을 눌러보세요.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}