import React, { useState, useEffect } from 'react';
import {
  Home,
  QrCode,
  ShieldAlert,
  Smartphone,
  Monitor,
  Crown,
} from 'lucide-react';
import { KINGS_BRAND } from './config/brand';
import {
  INITIAL_MEMBERS,
  INITIAL_TALLIES,
  MemberProfile,
  TallyTransaction,
  CheckInRecord,
  SubscriptionPlan,
} from './data/mockData';
import { PublicHomeView } from './components/PublicHomeView';
import { MemberPassView } from './components/MemberPassView';
import { BarberAdminView } from './components/BarberAdminView';

type MainTab = 'home' | 'pass' | 'admin';

export function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(true);

  const [members, setMembers] = useState<MemberProfile[]>(() => {
    const saved = localStorage.getItem('kings_members_v1');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [activeMemberId, setActiveMemberId] = useState<string>(INITIAL_MEMBERS[0].id);
  const [joinMode, setJoinMode] = useState<boolean>(false);
  const [preselectedPlan, setPreselectedPlan] = useState<SubscriptionPlan>('annual');
  const [scannedMember, setScannedMember] = useState<MemberProfile | null>(
    INITIAL_MEMBERS[0]
  );

  const [tallies, setTallies] = useState<TallyTransaction[]>(() => {
    const saved = localStorage.getItem('kings_tallies_v1');
    return saved ? JSON.parse(saved) : INITIAL_TALLIES;
  });

  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);

  useEffect(() => {
    localStorage.setItem('kings_members_v1', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('kings_tallies_v1', JSON.stringify(tallies));
  }, [tallies]);

  const activeMember =
    members.find((m) => m.id === activeMemberId) || members[0];

  const handleStartJoin = (plan: SubscriptionPlan) => {
    setPreselectedPlan(plan);
    setJoinMode(true);
    setActiveTab('pass');
  };

  const handleCreateMember = (newMember: MemberProfile) => {
    setMembers((prev) => [newMember, ...prev]);
    setActiveMemberId(newMember.id);
    setScannedMember(newMember);
  };

  const handleConfirmMemberCut = (memberId: string, shopId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const updated = {
          ...m,
          totalCutsThisYear: m.totalCutsThisYear + 1,
          lastCutDate: 'Today (Just now)',
          lastCutShopId: shopId,
          photoLocked: true,
        };
        if (scannedMember?.id === memberId) {
          setScannedMember(updated);
        }
        return updated;
      })
    );

    const target = members.find((m) => m.id === memberId);
    if (target) {
      setCheckIns((prev) => [
        {
          id: `chk-${Date.now()}`,
          memberId: target.id,
          memberName: target.fullName,
          memberPhoto: target.photoUrl,
          shopId,
          timestamp: new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          serviceNote: 'Subscription Cut',
        },
        ...prev,
      ]);
    }
  };

  const handleTogglePhotoLock = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, photoLocked: !m.photoLocked } : m
      )
    );
  };

  const handleToggleMemberStatus = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const nextStatus = m.status === 'active' ? 'overdue' : 'active';
        const updated: MemberProfile = { ...m, status: nextStatus };
        if (scannedMember?.id === memberId) {
          setScannedMember(updated);
        }
        return updated;
      })
    );
  };

  const handleAddTally = (tx: Omit<TallyTransaction, 'id' | 'timestamp'>) => {
    const newTx: TallyTransaction = {
      ...tx,
      id: `t-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setTallies((prev) => [newTx, ...prev]);
  };

  const handleUndoLastTally = (shopId: string) => {
    setTallies((prev) => {
      const idx = prev.findIndex((t) => t.shopId === shopId);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  const handleSimulateScanInBarberView = (member: MemberProfile) => {
    setScannedMember(member);
    setActiveTab('admin');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-kings-cream flex flex-col items-center justify-start md:py-6">
      {/* Desktop Prototype Controls Header (hidden on actual phones) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-[430px] mb-3 px-3 py-2 bg-[#141417] border border-white/20 text-xs">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-kings-gold fill-kings-gold" />
          <span className="font-serif font-bold uppercase tracking-wider text-white">
            The Kings Barber — Mobile View
          </span>
        </div>
        <button
          onClick={() => setPhoneFrameMode(!phoneFrameMode)}
          className="px-2.5 py-1 bg-black border border-white/25 text-kings-cream font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 transition"
        >
          {phoneFrameMode ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-kings-gold" />
              <span>Full Width</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-kings-gold" />
              <span>Phone View</span>
            </>
          )}
        </button>
      </div>

      {/* Main Mobile App Container */}
      <div
        className={`w-full bg-kings-black min-h-screen md:min-h-[844px] relative flex flex-col transition-all ${
          phoneFrameMode
            ? 'md:max-w-[430px] md:border-2 md:border-kings-gold/60 md:shadow-[0_25px_70px_rgba(0,0,0,0.9)] md:overflow-hidden'
            : 'max-w-2xl md:border md:border-white/25'
        }`}
      >
        {/* Sticky App Top Header */}
        <header className="sticky top-0 z-30 bg-kings-black border-b-2 border-kings-gold/50 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left"
          >
            <img
              src={KINGS_BRAND.logoUrl}
              alt="Crest"
              className="w-8 h-8 bg-white p-0.5 object-contain border border-kings-gold"
            />
            <div>
              <span className="font-serif font-black text-sm tracking-wider text-white block leading-none uppercase">
                {KINGS_BRAND.displayName}
              </span>
              <span className="text-[10px] text-kings-gold font-bold tracking-[0.2em] uppercase">
                Hastings • Est. 2000
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider border transition flex items-center gap-1 ${
                activeTab === 'admin'
                  ? 'bg-kings-gold text-kings-black border-kings-gold'
                  : 'bg-black text-kings-cream/80 border-white/25 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Staff Till</span>
            </button>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {activeTab === 'home' && (
            <PublicHomeView
              brand={KINGS_BRAND}
              onStartJoin={handleStartJoin}
              onOpenPass={() => {
                setJoinMode(false);
                setActiveTab('pass');
              }}
            />
          )}

          {activeTab === 'pass' && (
            <MemberPassView
              brand={KINGS_BRAND}
              activeMember={activeMember}
              allMembers={members}
              onSelectDemoMember={(id) => setActiveMemberId(id)}
              onCreateMember={handleCreateMember}
              initialJoinMode={joinMode}
              preselectedPlan={preselectedPlan}
              onClearJoinMode={() => setJoinMode(false)}
              onSimulateScanInBarberView={handleSimulateScanInBarberView}
            />
          )}

          {activeTab === 'admin' && (
            <BarberAdminView
              brand={KINGS_BRAND}
              members={members}
              tallies={tallies}
              checkIns={checkIns}
              scannedMember={scannedMember}
              onSelectScannedMember={setScannedMember}
              onConfirmMemberCut={handleConfirmMemberCut}
              onTogglePhotoLock={handleTogglePhotoLock}
              onToggleMemberStatus={handleToggleMemberStatus}
              onAddTally={handleAddTally}
              onUndoLastTally={handleUndoLastTally}
            />
          )}
        </main>

        {/* Fixed Bottom Mobile App Navigation Bar */}
        <nav className="sticky bottom-0 z-40 bg-black border-t-2 border-kings-gold/50">
          <div className="grid grid-cols-3 divide-x divide-white/15">
            <button
              onClick={() => setActiveTab('home')}
              className={`py-3 flex flex-col items-center justify-center gap-1 transition uppercase tracking-wider ${
                activeTab === 'home'
                  ? 'bg-kings-cream text-kings-black font-extrabold'
                  : 'text-kings-cream/65 hover:text-white font-bold'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[10px]">Shop & Club</span>
            </button>

            <button
              onClick={() => {
                setJoinMode(false);
                setActiveTab('pass');
              }}
              className={`py-3 flex flex-col items-center justify-center gap-1 transition uppercase tracking-wider ${
                activeTab === 'pass'
                  ? 'bg-kings-red text-white font-extrabold'
                  : 'text-kings-cream/65 hover:text-white font-bold'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span className="text-[10px]">Member Pass</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`py-3 flex flex-col items-center justify-center gap-1 transition uppercase tracking-wider ${
                activeTab === 'admin'
                  ? 'bg-kings-gold text-kings-black font-extrabold'
                  : 'text-kings-cream/65 hover:text-white font-bold'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px]">Staff Till</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
export default App;
