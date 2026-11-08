import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Lock, AlertTriangle } from 'lucide-react';
import { BrandConfig } from '../config/brand';
import { MemberProfile } from '../data/mockData';

/* ---------- Crest medallion ---------- */
export const Crest: React.FC<{ src: string; size?: number; className?: string }> = ({
  src,
  size = 36,
  className = '',
}) => (
  <div
    className={`rounded-full bg-white flex items-center justify-center overflow-hidden ring-1 ring-b-brass/60 shrink-0 ${className}`}
    style={{ width: size, height: size }}
  >
    <img src={src} alt="Kings Barbers crest" className="w-[82%] h-[82%] object-contain" />
  </div>
);

/* ---------- iOS-style segmented control ---------- */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div className="relative grid p-[3px] rounded-[11px] bg-white/[0.07]" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      <div
        className="absolute top-[3px] bottom-[3px] rounded-[9px] bg-b-cream shadow-[0_3px_8px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          width: `calc((100% - 6px) / ${options.length})`,
          left: 3,
          transform: `translateX(${idx * 100}%)`,
        }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`relative z-10 py-2 text-[13px] font-semibold transition-colors ${
            o.value === value ? 'text-b-ink' : 'text-b-cream/70'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Bottom sheet (iOS modal style) ---------- */
export const Sheet: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({
  open,
  onClose,
  children,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 animate-fadeIn" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-b-raised rounded-t-[22px] border-t border-white/10 pb-safe-plus animate-sheetUp max-h-[92dvh] overflow-y-auto">
        <div className="sticky top-0 pt-2.5 pb-1 flex justify-center bg-b-raised z-10">
          <div className="w-10 h-[5px] rounded-full bg-white/25" />
        </div>
        {children}
      </div>
    </div>
  );
};

/* ---------- Toast ---------- */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2200);
    return () => clearTimeout(t);
  }, [msg]);
  const node = msg ? (
    <div className="fixed left-1/2 -translate-x-1/2 z-[60] top-safe mt-3 px-4 py-2.5 rounded-full glass border border-white/10 text-[13px] font-medium text-b-cream shadow-xl animate-fadeIn whitespace-nowrap">
      {msg}
    </div>
  ) : null;
  return { toast: setMsg, toastNode: node };
}

/* ---------- Live clock (anti-screenshot) ---------- */
export function useLiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/* ---------- The membership pass (Apple Wallet-inspired) ---------- */
export const PassCard: React.FC<{
  brand: BrandConfig;
  member: MemberProfile;
  showQr?: boolean;
  compact?: boolean;
  onFixPayment?: () => void;
}> = ({ brand, member, showQr = true, compact = false, onFixPayment }) => {
  const now = useLiveClock();
  const [nonce, setNonce] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNonce(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const active = member.status === 'active';
  const qrValue = JSON.stringify({ c: member.memberCode, t: nonce });

  return (
    <div className="relative rounded-[22px] overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
      {/* Card stock */}
      <div className="absolute inset-0 bg-[linear-gradient(150deg,#6A1A20_0%,#3A0E12_45%,#1A0809_100%)]" />
      <div className="absolute inset-0 guilloche" />
      {/* Moving foil sheen — a screenshot can't reproduce this */}
      <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent animate-sheen pointer-events-none" />

      <div className={`relative ${compact ? 'p-4' : 'p-5'}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Crest src={brand.logoUrl} size={compact ? 30 : 36} />
            <div className="leading-tight">
              <p className="font-editorial text-[17px] text-b-cream">The Kings Barber</p>
              <p className="text-[10px] tracking-[0.18em] uppercase text-b-brass font-semibold">
                {member.plan === 'annual' ? 'Annual member' : 'Monthly member'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-md ${
                active ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-400/15 text-red-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              {active ? 'Active' : 'Payment due'}
            </span>
          </div>
        </div>

        {/* Holder */}
        <div className={`flex items-center gap-3.5 ${compact ? 'mt-4' : 'mt-5'}`}>
          <div className="relative shrink-0">
            <img
              src={member.photoUrl}
              alt={member.fullName}
              className={`${compact ? 'w-14 h-14' : 'w-[68px] h-[68px]'} rounded-[14px] object-cover ring-2 ring-b-brass/70`}
            />
            {member.photoLocked && (
              <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-b-ink ring-1 ring-b-brass/70 flex items-center justify-center">
                <Lock className="w-3 h-3 text-b-brass" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.16em] uppercase text-b-cream/50 font-semibold">Member</p>
            <p className="font-editorial text-[22px] leading-tight text-b-cream truncate">{member.fullName}</p>
            <p className="text-[12px] font-mono text-b-brassLight/80 mt-0.5">{member.memberCode}</p>
          </div>
        </div>

        {/* QR */}
        {showQr && (
          <div className="mt-5 relative rounded-[16px] bg-[#FBF8F1] p-4 flex flex-col items-center">
            {!active && (
              <div className="absolute inset-0 z-10 rounded-[16px] bg-[#1A0809]/95 flex flex-col items-center justify-center text-center p-5">
                <AlertTriangle className="w-7 h-7 text-red-300" />
                <p className="mt-2 font-semibold text-b-cream">Your last payment didn’t go through</p>
                <p className="text-[13px] text-b-cream/60 mt-1">Update your card to unlock your pass.</p>
                {onFixPayment && (
                  <button onClick={onFixPayment} className="press mt-3 px-4 py-2 rounded-[10px] bg-b-cream text-b-ink text-[14px] font-semibold">
                    Update payment
                  </button>
                )}
              </div>
            )}
            <QRCodeSVG value={qrValue} size={compact ? 132 : 172} bgColor="#FBF8F1" fgColor="#1A0809" level="M" />
            <div className="mt-3 flex items-center justify-between w-full text-[11px] text-[#1A0809]/60 font-medium">
              <span>Show to your barber</span>
              <span className="font-mono tabular-nums text-[#1A0809]">
                {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="relative h-[5px] pole-stripe opacity-90" />
    </div>
  );
};

/* ---------- Inset grouped list (iOS Settings style) ---------- */
export const Group: React.FC<{ title?: string; footer?: string; children: React.ReactNode }> = ({
  title,
  footer,
  children,
}) => (
  <div>
    {title && <p className="px-4 pb-2 text-[12px] uppercase tracking-[0.08em] text-b-muted font-medium">{title}</p>}
    <div className="rounded-[14px] bg-b-surface border hairline overflow-hidden divide-y divide-white/[0.06]">{children}</div>
    {footer && <p className="px-4 pt-2 text-[12px] text-b-muted leading-snug">{footer}</p>}
  </div>
);

export const Row: React.FC<{
  label: React.ReactNode;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  accent?: boolean;
}> = ({ label, value, icon, onClick, accent }) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${onClick ? 'press active:bg-white/[0.04]' : ''}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className={`flex-1 text-[15px] ${accent ? 'text-b-brass font-medium' : 'text-b-cream'}`}>{label}</span>
      {value !== undefined && <span className="text-[15px] text-b-muted text-right">{value}</span>}
    </Tag>
  );
};
