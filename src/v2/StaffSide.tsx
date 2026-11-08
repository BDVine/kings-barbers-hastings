import React, { useMemo, useState } from 'react';
import {
  Banknote,
  CreditCard,
  RotateCcw,
  ScanLine,
  Users,
  Calculator,
  LogOut,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Delete,
  ChevronLeft,
} from 'lucide-react';
import { BrandConfig } from '../config/brand';
import { MemberProfile } from '../data/mockData';
import { Crest, Segmented, Sheet, Group, Row, useToast } from './ui';
import { DemoStore } from './useDemoStore';

const DEMO_PIN = '2000';

/* ===================== PIN login ===================== */
export const StaffLogin: React.FC<{
  brand: BrandConfig;
  onBack: () => void;
  onSuccess: (shopId: string) => void;
}> = ({ brand, onBack, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [shopId, setShopId] = useState(brand.locations[0].id);

  const press = (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === DEMO_PIN) onSuccess(shopId);
        else {
          setShake(true);
          setTimeout(() => { setShake(false); setPin(''); }, 450);
        }
      }, 120);
    }
  };

  return (
    <div className="font-ios min-h-[100dvh] bg-[radial-gradient(ellipse_at_top,#2A1012_0%,#0B0A09_60%)] flex flex-col pt-safe pb-safe-plus">
      <div className="max-w-[420px] w-full mx-auto px-6 flex-1 flex flex-col">
        <button onClick={onBack} className="press self-start mt-2 flex items-center text-[#0A84FF] text-[17px]">
          <ChevronLeft className="w-6 h-6" /> Website
        </button>

        <div className="mt-6 flex flex-col items-center text-center">
          <Crest src={brand.logoUrl} size={64} />
          <h1 className="mt-4 font-editorial text-[28px]">Staff sign in</h1>
          <p className="mt-1 text-[14px] text-b-muted">Choose your shop and enter your PIN</p>
        </div>

        <div className="mt-6">
          <Segmented
            value={shopId}
            onChange={setShopId}
            options={brand.locations.map((l) => ({ value: l.id, label: l.shortName }))}
          />
        </div>

        <div className={`mt-8 flex justify-center gap-4 ${shake ? 'animate-[shake_0.4s]' : ''}`} style={shake ? { animation: 'shake 0.4s' } : undefined}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`w-3.5 h-3.5 rounded-full border transition-colors ${i < pin.length ? 'bg-b-cream border-b-cream' : 'border-b-cream/40'}`} />
          ))}
        </div>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}`}</style>

        <div className="mt-auto pt-8 grid grid-cols-3 gap-x-6 gap-y-4 justify-items-center">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button key={d} onClick={() => press(d)} className="press w-[76px] h-[76px] rounded-full bg-white/[0.08] text-[32px] font-light">
              {d}
            </button>
          ))}
          <span />
          <button onClick={() => press('0')} className="press w-[76px] h-[76px] rounded-full bg-white/[0.08] text-[32px] font-light">0</button>
          <button onClick={() => setPin(pin.slice(0, -1))} className="press w-[76px] h-[76px] rounded-full flex items-center justify-center text-b-cream/70" aria-label="Delete">
            <Delete className="w-7 h-7" />
          </button>
        </div>
        <p className="mt-6 text-center text-[13px] text-b-muted">Demo PIN: <span className="font-mono text-b-cream">2000</span></p>
      </div>
    </div>
  );
};

/* ===================== Staff app ===================== */
type Tab = 'till' | 'scan' | 'members';

export const StaffApp: React.FC<{
  brand: BrandConfig;
  store: DemoStore;
  shopId: string;
  onShopChange: (id: string) => void;
  onSignOut: () => void;
}> = ({ brand, store, shopId, onShopChange, onSignOut }) => {
  const [tab, setTab] = useState<Tab>('till');
  const [scanned, setScanned] = useState<MemberProfile | null>(null);
  const [detail, setDetail] = useState<MemberProfile | null>(null);
  const { toast, toastNode } = useToast();
  const shop = brand.locations.find((l) => l.id === shopId) ?? brand.locations[0];

  // keep sheets in sync with store updates
  const liveScanned = scanned ? store.members.find((m) => m.id === scanned.id) ?? null : null;
  const liveDetail = detail ? store.members.find((m) => m.id === detail.id) ?? null : null;

  return (
    <div className="font-ios min-h-[100dvh]">
      {toastNode}
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b hairline pt-safe">
        <div className="max-w-[480px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Crest src={brand.logoUrl} size={32} />
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-[0.14em] text-b-brass font-semibold">Staff · Kings</p>
              <p className="text-[16px] font-semibold">{shop.shortName}</p>
            </div>
          </div>
          <button onClick={onSignOut} className="press w-9 h-9 rounded-full bg-white/[0.07] flex items-center justify-center" aria-label="Sign out">
            <LogOut className="w-4 h-4 text-b-cream/80" />
          </button>
        </div>
        <div className="max-w-[480px] mx-auto px-4 pb-3">
          <Segmented value={shopId} onChange={onShopChange} options={brand.locations.map((l) => ({ value: l.id, label: l.shortName }))} />
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-4 pt-5 pb-[calc(env(safe-area-inset-bottom)+96px)]">
        {tab === 'till' && <Till brand={brand} store={store} shopId={shopId} toast={toast} />}
        {tab === 'scan' && <Scan store={store} onScan={setScanned} />}
        {tab === 'members' && <Members store={store} onOpen={setDetail} />}
      </div>

      {/* Tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 glass border-t hairline pb-safe">
        <div className="max-w-[480px] mx-auto grid grid-cols-3">
          {([
            { id: 'till', label: 'Till', icon: Calculator },
            { id: 'scan', label: 'Scan pass', icon: ScanLine },
            { id: 'members', label: 'Members', icon: Users },
          ] as const).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`press pt-2.5 pb-2 flex flex-col items-center gap-1 ${tab === t.id ? 'text-b-brass' : 'text-b-muted'}`}>
              <t.icon className="w-6 h-6" strokeWidth={tab === t.id ? 2.2 : 1.8} />
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Scan result sheet */}
      <Sheet open={!!liveScanned} onClose={() => setScanned(null)}>
        {liveScanned && (
          <ScanResult
            member={liveScanned}
            shopName={shop.shortName}
            onLog={() => {
              store.logCut(liveScanned.id, shopId);
              toast(`Haircut logged for ${liveScanned.fullName.split(' ')[0]}`);
              setScanned(null);
            }}
            onClose={() => setScanned(null)}
          />
        )}
      </Sheet>

      {/* Member detail sheet */}
      <Sheet open={!!liveDetail} onClose={() => setDetail(null)}>
        {liveDetail && (
          <div className="px-5 pt-3 space-y-5">
            <div className="flex items-center gap-4">
              <img src={liveDetail.photoUrl} alt="" className="w-20 h-20 rounded-[18px] object-cover ring-2 ring-b-brass/60" />
              <div>
                <p className="font-editorial text-[26px] leading-tight">{liveDetail.fullName}</p>
                <p className="text-[13px] font-mono text-b-muted">{liveDetail.memberCode}</p>
              </div>
            </div>
            <Group>
              <Row label="Status" value={<span className={liveDetail.status === 'active' ? 'text-emerald-300' : 'text-red-300'}>{liveDetail.status === 'active' ? 'Active' : 'Payment due'}</span>} />
              <Row label="Plan" value={liveDetail.plan === 'annual' ? 'Yearly · £250' : 'Monthly · £25'} />
              <Row label="Phone" value={liveDetail.phone} />
              <Row label="Cuts this year" value={liveDetail.totalCutsThisYear} />
              <Row label="Last cut" value={liveDetail.lastCutDate ?? '—'} />
              <Row label="Member since" value={liveDetail.joinedDate} />
            </Group>
            <Group footer="Unlock to let the member upload a new photo. It locks again after their next cut.">
              <Row
                onClick={() => store.updateMember(liveDetail.id, { photoLocked: !liveDetail.photoLocked })}
                icon={liveDetail.photoLocked ? <Lock className="w-4 h-4 text-b-brass" /> : <Unlock className="w-4 h-4 text-amber-300" />}
                label={liveDetail.photoLocked ? 'Photo locked' : 'Photo unlocked'}
                value={<span className="text-[#0A84FF]">{liveDetail.photoLocked ? 'Unlock' : 'Lock'}</span>}
              />
              <Row
                onClick={() => store.updateMember(liveDetail.id, { status: liveDetail.status === 'active' ? 'overdue' : 'active' })}
                label="Demo: payment status"
                value={<span className="text-[#0A84FF]">{liveDetail.status === 'active' ? 'Mark overdue' : 'Mark paid'}</span>}
              />
            </Group>
            <button
              onClick={() => { setDetail(null); setScanned(liveDetail); }}
              className="press w-full h-[52px] rounded-[14px] bg-b-cream text-b-ink text-[16px] font-semibold"
            >
              Check in manually
            </button>
          </div>
        )}
      </Sheet>
    </div>
  );
};

/* ---------- Till ---------- */
const Till: React.FC<{ brand: BrandConfig; store: DemoStore; shopId: string; toast: (m: string) => void }> = ({ brand, store, shopId, toast }) => {
  const [serviceId, setServiceId] = useState(brand.services[1].id);
  const [custom, setCustom] = useState('');
  const service = brand.services.find((s) => s.id === serviceId) ?? brand.services[0];
  const amount = custom && !isNaN(Number(custom)) ? Number(custom) : service.price;

  const today = store.tallies.filter((t) => t.shopId === shopId);
  const cash = today.filter((t) => t.paymentType === 'cash');
  const card = today.filter((t) => t.paymentType === 'card');
  const sum = (a: typeof today) => a.reduce((s, t) => s + t.amount, 0);
  const total = sum(today);
  const cashPct = total ? Math.round((sum(cash) / total) * 100) : 50;

  const record = (type: 'cash' | 'card') => {
    store.addTally({ shopId, paymentType: type, serviceName: custom ? 'Custom' : service.name, amount });
    toast(`+ £${amount} ${type === 'cash' ? 'cash' : 'card'}`);
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="rounded-[20px] bg-[linear-gradient(150deg,#22201D,#151312)] border hairline p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] text-b-muted">Taken today</p>
            <p className="font-editorial text-[44px] leading-none mt-1 tabular-nums">£{total}</p>
            <p className="text-[13px] text-b-muted mt-1.5">{today.length} walk-ins</p>
          </div>
          <button onClick={() => store.undoTally(shopId)} disabled={!today.length} className="press flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.07] text-[13px] disabled:opacity-40">
            <RotateCcw className="w-3.5 h-3.5" /> Undo
          </button>
        </div>
        <div className="mt-5 h-2 rounded-full overflow-hidden flex bg-[#0A84FF]">
          <div className="bg-emerald-400 transition-all duration-500" style={{ width: `${cashPct}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-[14px]">
          <div><span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2" />Cash <span className="font-semibold tabular-nums">£{sum(cash)}</span> <span className="text-b-muted">· {cash.length}</span></div>
          <div className="text-right"><span className="inline-block w-2 h-2 rounded-full bg-[#0A84FF] mr-2" />Card <span className="font-semibold tabular-nums">£{sum(card)}</span> <span className="text-b-muted">· {card.length}</span></div>
        </div>
      </div>

      {/* Presets */}
      <div>
        <p className="px-1 pb-2 text-[12px] uppercase tracking-[0.08em] text-b-muted font-medium">Service</p>
        <div className="grid grid-cols-3 gap-2">
          {brand.services.map((s) => {
            const sel = !custom && serviceId === s.id;
            return (
              <button key={s.id} onClick={() => { setServiceId(s.id); setCustom(''); }}
                className={`press rounded-[14px] p-3 text-left border transition-colors ${sel ? 'bg-b-cream text-b-ink border-b-cream' : 'bg-b-surface border-white/[0.08]'}`}>
                <p className="font-editorial text-[24px] leading-none">£{s.price}</p>
                <p className={`mt-1.5 text-[12px] leading-tight line-clamp-2 ${sel ? 'text-b-ink/70' : 'text-b-muted'}`}>{s.name}</p>
              </button>
            );
          })}
        </div>
        <div className="mt-2 rounded-[14px] bg-b-surface border hairline flex items-center px-4">
          <span className="text-b-muted text-[15px]">Other £</span>
          <input value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" placeholder="0" className="flex-1 bg-transparent py-3 px-2 text-[17px] focus:outline-none" />
          {custom && <button onClick={() => setCustom('')} className="text-[14px] text-[#0A84FF]">Clear</button>}
        </div>
      </div>

      {/* Big buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => record('cash')} className="press h-[120px] rounded-[20px] bg-emerald-500 text-[#04210F] flex flex-col items-center justify-center shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)]">
          <Banknote className="w-8 h-8" />
          <span className="mt-1.5 text-[20px] font-bold">Cash</span>
          <span className="text-[14px] font-medium opacity-80">£{amount}</span>
        </button>
        <button onClick={() => record('card')} className="press h-[120px] rounded-[20px] bg-[#0A84FF] text-white flex flex-col items-center justify-center shadow-[0_10px_30px_-10px_rgba(10,132,255,0.6)]">
          <CreditCard className="w-8 h-8" />
          <span className="mt-1.5 text-[20px] font-bold">Card</span>
          <span className="text-[14px] font-medium opacity-80">£{amount}</span>
        </button>
      </div>

      {/* Recent */}
      {today.length > 0 && (
        <Group title="Recent">
          {today.slice(0, 6).map((t) => (
            <Row key={t.id}
              icon={<span className={`w-2 h-2 rounded-full block ${t.paymentType === 'cash' ? 'bg-emerald-400' : 'bg-[#0A84FF]'}`} />}
              label={<span>{t.serviceName} <span className="text-b-muted text-[13px]">· {t.timestamp}</span></span>}
              value={<span className="text-b-cream tabular-nums">£{t.amount}</span>} />
          ))}
        </Group>
      )}
    </div>
  );
};

/* ---------- Scan ---------- */
const Scan: React.FC<{ store: DemoStore; onScan: (m: MemberProfile) => void }> = ({ store, onScan }) => (
  <div className="space-y-6">
    <div className="relative aspect-square rounded-[24px] overflow-hidden bg-[radial-gradient(circle,#1E1B19,#0B0A09)] border hairline">
      {/* viewfinder corners */}
      {['top-6 left-6 border-t-[3px] border-l-[3px] rounded-tl-[18px]', 'top-6 right-6 border-t-[3px] border-r-[3px] rounded-tr-[18px]', 'bottom-6 left-6 border-b-[3px] border-l-[3px] rounded-bl-[18px]', 'bottom-6 right-6 border-b-[3px] border-r-[3px] rounded-br-[18px]'].map((c) => (
        <span key={c} className={`absolute w-12 h-12 border-b-brass ${c}`} />
      ))}
      <span className="absolute left-10 right-10 h-[2px] bg-b-brass/80 shadow-[0_0_16px_2px_rgba(201,164,92,0.6)] animate-scanline" />
      <div className="absolute inset-x-0 bottom-10 text-center text-[14px] text-b-cream/70">Point at the member’s QR pass</div>
    </div>
    <Group title="Demo · simulate a scan" footer="In the live version this uses the iPhone camera to read the QR code.">
      {store.members.map((m) => (
        <Row key={m.id} onClick={() => onScan(m)}
          icon={<img src={m.photoUrl} alt="" className="w-9 h-9 rounded-full object-cover" />}
          label={m.fullName}
          value={<span className={`text-[13px] ${m.status === 'active' ? 'text-emerald-300' : 'text-red-300'}`}>{m.status === 'active' ? 'Active' : 'Due'}</span>} />
      ))}
    </Group>
  </div>
);

const ScanResult: React.FC<{ member: MemberProfile; shopName: string; onLog: () => void; onClose: () => void }> = ({ member, shopName, onLog, onClose }) => {
  const ok = member.status === 'active';
  const recent = member.lastCutDate?.startsWith('Today');
  return (
    <div className="px-5 pt-2">
      <div className={`rounded-[16px] px-4 py-3 flex items-center gap-3 ${ok ? 'bg-emerald-500 text-[#04210F]' : 'bg-red-500 text-white'}`}>
        {ok ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        <div>
          <p className="text-[17px] font-bold">{ok ? 'Valid member' : 'Payment due'}</p>
          <p className="text-[13px] opacity-80">{ok ? 'Check the face matches, then cut' : 'Don’t cut on the membership — ask them to update payment'}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <img src={member.photoUrl} alt={member.fullName} className="w-44 h-44 rounded-[28px] object-cover ring-4 ring-b-brass/70 shadow-2xl" />
        <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-b-brass font-semibold">Does this match the person in the chair?</p>
        <p className="mt-3 font-editorial text-[30px] leading-tight">{member.fullName}</p>
        <p className="text-[14px] text-b-muted">{member.plan === 'annual' ? 'Yearly member' : 'Monthly member'} · {member.totalCutsThisYear} cuts this year</p>
      </div>

      <div className="mt-5">
        <Group>
          <Row label="Last cut" value={member.lastCutDate ?? 'First visit'} />
          <Row label="Member code" value={<span className="font-mono text-[13px]">{member.memberCode}</span>} />
        </Group>
      </div>

      {recent && ok && (
        <div className="mt-4 rounded-[14px] bg-amber-400/10 border border-amber-400/30 p-3.5 flex gap-3 text-[14px] text-amber-200">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          This pass was already used today. Double-check it’s the same person.
        </div>
      )}

      <div className="mt-6 space-y-2.5">
        {ok && (
          <button onClick={onLog} className="press w-full h-[56px] rounded-[16px] bg-b-cream text-b-ink text-[17px] font-semibold">
            Log haircut · {shopName}
          </button>
        )}
        <button onClick={onClose} className="press w-full h-12 rounded-[14px] bg-white/[0.06] text-[16px]">Close</button>
      </div>
    </div>
  );
};

/* ---------- Members ---------- */
const Members: React.FC<{ store: DemoStore; onOpen: (m: MemberProfile) => void }> = ({ store, onOpen }) => {
  const [q, setQ] = useState('');
  const list = useMemo(
    () => store.members.filter((m) => `${m.fullName} ${m.phone} ${m.memberCode}`.toLowerCase().includes(q.toLowerCase())),
    [store.members, q]
  );
  const active = store.members.filter((m) => m.status === 'active');
  const mrr = active.reduce((s, m) => s + (m.plan === 'annual' ? 250 / 12 : 25), 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: 'Active', value: active.length },
          { label: 'Payment due', value: store.members.length - active.length },
          { label: 'Per month', value: `£${Math.round(mrr)}` },
        ].map((s) => (
          <div key={s.label} className="rounded-[14px] bg-b-surface border hairline p-3">
            <p className="text-[22px] font-semibold tabular-nums">{s.value}</p>
            <p className="text-[12px] text-b-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-b-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone or code" className="w-full h-11 pl-9 pr-3 rounded-[12px] bg-white/[0.07] text-b-cream placeholder:text-b-muted focus:outline-none" />
      </div>

      <Group>
        {list.map((m) => (
          <Row key={m.id} onClick={() => onOpen(m)}
            icon={<img src={m.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover" />}
            label={<span className="block"><span className="block">{m.fullName}</span><span className="block text-[13px] text-b-muted">{m.plan === 'annual' ? 'Yearly' : 'Monthly'} · {m.totalCutsThisYear} cuts</span></span>}
            value={<span className={`inline-block w-2.5 h-2.5 rounded-full ${m.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`} />} />
        ))}
        {list.length === 0 && <Row label={<span className="text-b-muted">No members found</span>} />}
      </Group>
    </div>
  );
};
