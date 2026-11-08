import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Crown,
  Lock,
  ShieldCheck,
  Camera,
  UserCheck,
  CreditCard,
  AlertTriangle,
  Calendar,
  Scissors,
  Upload,
} from 'lucide-react';
import { BrandConfig } from '../config/brand';
import { MemberProfile, SubscriptionPlan } from '../data/mockData';

interface MemberPassViewProps {
  brand: BrandConfig;
  activeMember: MemberProfile;
  allMembers: MemberProfile[];
  onSelectDemoMember: (memberId: string) => void;
  onCreateMember: (newMember: MemberProfile) => void;
  initialJoinMode?: boolean;
  preselectedPlan?: SubscriptionPlan;
  onClearJoinMode: () => void;
  onSimulateScanInBarberView: (member: MemberProfile) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
];

export const MemberPassView: React.FC<MemberPassViewProps> = ({
  brand,
  activeMember,
  allMembers,
  onSelectDemoMember,
  onCreateMember,
  initialJoinMode = false,
  preselectedPlan = 'annual',
  onClearJoinMode,
  onSimulateScanInBarberView,
}) => {
  const [isOnboarding, setIsOnboarding] = useState<boolean>(initialJoinMode);
  const [plan, setPlan] = useState<SubscriptionPlan>(preselectedPlan);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selfieUrl, setSelfieUrl] = useState<string>('');
  const [cameraActive, setCameraActive] = useState(false);
  const [liveTime, setLiveTime] = useState<string>('');
  const [qrNonce, setQrNonce] = useState<number>(Date.now());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialJoinMode) {
      setIsOnboarding(true);
      setPlan(preselectedPlan);
    }
  }, [initialJoinMode, preselectedPlan]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    const qrTimer = setInterval(() => setQrNonce(Date.now()), 30000);
    return () => {
      clearInterval(timer);
      clearInterval(qrTimer);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 400, height: 400 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraActive(false);
      setSelfieUrl(PRESET_AVATARS[1]);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setSelfieUrl(canvas.toDataURL('image/jpeg', 0.85));
      }
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
      setCameraActive(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelfieUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCompleteSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const suffix = plan === 'annual' ? 'VIP' : 'MTH';
    const created: MemberProfile = {
      id: `mem-${Date.now()}`,
      memberCode: `KINGS-${randomDigits}-${suffix}`,
      fullName: fullName.trim() || 'Alex Mercer',
      phone: phone.trim() || '07700 900888',
      email: email.trim() || 'alex@hastings.co.uk',
      photoUrl: selfieUrl || PRESET_AVATARS[1],
      photoLocked: true,
      plan,
      status: 'active',
      joinedDate: 'Today',
      renewalDate: plan === 'annual' ? '08 Nov 2027' : '08 Dec 2026',
      totalCutsThisYear: 0,
      lastCutDate: 'Ready for 1st Cut',
      lastCutShopId: null,
    };
    onCreateMember(created);
    setIsOnboarding(false);
    onClearJoinMode();
  };

  if (isOnboarding) {
    return (
      <div className="px-4 pt-3 pb-28 space-y-4">
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-kings-gold block">
              NEW MEMBERSHIP REGISTRATION
            </span>
            <h1 className="font-serif text-xl font-bold text-white uppercase">
              Join The Kings Club
            </h1>
          </div>
          <button
            onClick={() => {
              setIsOnboarding(false);
              onClearJoinMode();
            }}
            className="text-xs font-bold uppercase tracking-wider text-kings-gold underline"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleCompleteSignup} className="space-y-4">
          {/* Step 1: Plan */}
          <div className="dark-heritage-card p-4 space-y-3">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-kings-gold block">
              01. Select Tariff
            </label>
            <div className="grid grid-cols-2 border border-white/25 bg-black">
              <button
                type="button"
                onClick={() => setPlan('monthly')}
                className={`p-3 text-left transition border-r border-white/20 ${
                  plan === 'monthly'
                    ? 'bg-kings-cream text-kings-black'
                    : 'text-kings-cream/70'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase block">
                  Monthly Rolling
                </span>
                <span className="font-serif text-xl font-black block mt-0.5">
                  £{brand.subscription.monthlyPrice}/mo
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPlan('annual')}
                className={`p-3 text-left transition ${
                  plan === 'annual'
                    ? 'bg-kings-gold text-kings-black'
                    : 'text-kings-cream/70'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase block">
                  Annual VIP (Save £50)
                </span>
                <span className="font-serif text-xl font-black block mt-0.5">
                  £{brand.subscription.annualPrice}/yr
                </span>
              </button>
            </div>
          </div>

          {/* Step 2: Headshot */}
          <div className="dark-heritage-card p-4 space-y-3">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-kings-gold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              02. Passholder Photograph (Required)
            </label>
            <p className="text-xs text-kings-cream/70">
              Printed onto your digital pass and shown on the barber's screen when scanned. Locked after registration to prevent pass sharing.
            </p>

            {cameraActive ? (
              <div className="space-y-2 text-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-40 h-40 mx-auto object-cover border-2 border-kings-gold"
                />
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-4 py-2 bg-kings-gold text-kings-black font-extrabold text-xs uppercase tracking-wider"
                >
                  Capture Photo
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3.5">
                <div className="w-20 h-20 bg-black border-2 border-kings-gold/60 overflow-hidden flex items-center justify-center shrink-0">
                  {selfieUrl ? (
                    <img
                      src={selfieUrl}
                      alt="Verification Selfie"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-kings-gold/60" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="py-2 px-3 bg-kings-gold text-kings-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Camera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-2 px-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-kings-cream/60">
                    <span>Demo photo:</span>
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelfieUrl(url)}
                        className={`w-6 h-6 overflow-hidden border ${
                          selfieUrl === url ? 'border-kings-gold' : 'border-white/20'
                        }`}
                      >
                        <img src={url} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Details */}
          <div className="dark-heritage-card p-4 space-y-3">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-kings-gold block">
              03. Your Details
            </label>
            <input
              type="text"
              required
              placeholder="Full Name (e.g. Jack Reynolds)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black border border-white/25 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-kings-gold"
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="tel"
                required
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black border border-white/25 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-kings-gold"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black border border-white/25 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-kings-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-kings-red hover:bg-red-800 text-white font-extrabold text-xs uppercase tracking-widest border-2 border-black hard-btn flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>
              Complete & Issue Pass ({plan === 'annual' ? '£250/yr' : '£25/mo'})
            </span>
          </button>
        </form>
      </div>
    );
  }

  const isActive = activeMember.status === 'active';
  const qrPayload = JSON.stringify({
    code: activeMember.memberCode,
    id: activeMember.id,
    ts: qrNonce,
  });

  return (
    <div className="px-4 pt-3 pb-28 space-y-4">
      {/* Prototype Profile Switcher */}
      <div className="bg-black border border-white/20 p-2 flex items-center justify-between gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-kings-cream/60 pl-1">
          Demo Account:
        </span>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {allMembers.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectDemoMember(m.id)}
              className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border transition flex items-center gap-1.5 ${
                m.id === activeMember.id
                  ? 'bg-kings-gold text-kings-black border-kings-gold'
                  : 'bg-transparent text-kings-cream/70 border-white/15'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 ${
                  m.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              {m.fullName.split(' ')[0]}
            </button>
          ))}
          <button
            onClick={() => setIsOnboarding(true)}
            className="px-2.5 py-1 text-[11px] font-extrabold uppercase bg-kings-red text-white whitespace-nowrap"
          >
            + New
          </button>
        </div>
      </div>

      {/* PRINTED HERITAGE MEMBERSHIP CARD */}
      <div className="signboard-card overflow-hidden">
        {/* Top Moving Barber-Pole Security Ribbon */}
        <div className="h-2.5 w-full barber-pole-bg animate-pole border-b-2 border-kings-black" />

        {/* Card Header */}
        <div className="bg-kings-black text-kings-cream px-4 py-3.5 flex items-center justify-between border-b-2 border-kings-black">
          <div className="flex items-center gap-3">
            <img
              src={brand.logoUrl}
              alt="Crest"
              className="w-10 h-10 bg-white p-0.5 object-contain border border-kings-gold"
            />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-kings-gold block">
                {activeMember.plan === 'annual' ? 'ANNUAL VIP PASS' : 'MONTHLY PASS'}
              </span>
              <h2 className="font-serif font-black text-base tracking-tight text-white uppercase">
                {brand.displayName}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${
                isActive
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-red-950 text-red-300 border-red-500'
              }`}
            >
              {isActive ? '● ACTIVE' : '▲ OVERDUE'}
            </span>
            <span className="block text-[10px] font-mono text-kings-cream/70 mt-1">
              {liveTime}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="border border-kings-black/80 p-3.5 bg-white/50">
            {/* Photo + Member Details */}
            <div className="flex items-center gap-3.5 pb-3.5 border-b border-kings-black/20">
              <div className="relative shrink-0">
                <img
                  src={activeMember.photoUrl}
                  alt={activeMember.fullName}
                  className="w-20 h-20 object-cover border-2 border-kings-black"
                />
                <div className="absolute -bottom-1.5 left-0 right-0 bg-kings-black text-kings-gold text-[9px] font-extrabold uppercase tracking-wider text-center py-0.5 flex items-center justify-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>LOCKED ID</span>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-kings-black/55 block">
                  PASSHOLDER NAME
                </span>
                <h3 className="font-serif text-lg font-black text-kings-black uppercase truncate">
                  {activeMember.fullName}
                </h3>
                <p className="text-xs font-mono font-bold text-kings-red">
                  ID: {activeMember.memberCode}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] font-bold text-kings-black/80">
                  <span>{activeMember.plan === 'annual' ? '£250/YR' : '£25/MO'}</span>
                  <span>•</span>
                  <span>{activeMember.totalCutsThisYear} CUTS LOGGED</span>
                </div>
              </div>
            </div>

            {/* QR Code Block */}
            <div className="pt-4 flex flex-col items-center relative">
              {!isActive && (
                <div className="absolute inset-0 bg-red-950/95 flex flex-col items-center justify-center p-4 text-center text-white z-10 border-2 border-red-500">
                  <AlertTriangle className="w-8 h-8 text-red-400 mb-1.5" />
                  <p className="font-serif font-bold text-sm uppercase">
                    Subscription Payment Overdue
                  </p>
                  <p className="text-xs text-red-200 mt-1">
                    Please update your payment method to reactivate your QR code.
                  </p>
                </div>
              )}

              <div className="p-3 bg-white border-2 border-kings-black">
                <QRCodeSVG
                  value={qrPayload}
                  size={168}
                  bgColor="#FFFFFF"
                  fgColor="#0D0D10"
                  level="M"
                  includeMargin={false}
                />
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-kings-black">
                <ShieldCheck className="w-4 h-4 text-kings-red" />
                <span>Present Pass in Barber Chair</span>
              </div>
            </div>
          </div>

          {/* One-Tap Prototype Demo Button */}
          <button
            onClick={() => onSimulateScanInBarberView(activeMember)}
            className="mt-3.5 w-full py-3 bg-kings-black hover:bg-kings-charcoal text-kings-gold font-extrabold text-xs uppercase tracking-wider border border-kings-black flex items-center justify-center gap-2 transition"
          >
            <UserCheck className="w-4 h-4" />
            <span>Demo: Scan This Pass on Barber Screen →</span>
          </button>
        </div>

        {/* Card Footer */}
        <div className="bg-kings-parchment px-4 py-2.5 border-t-2 border-kings-black flex items-center justify-between text-[11px] font-bold text-kings-black">
          <span className="flex items-center gap-1">
            <Scissors className="w-3.5 h-3.5 text-kings-red" />
            Last Cut: {activeMember.lastCutDate || 'None'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-kings-black" />
            Renews: {activeMember.renewalDate}
          </span>
        </div>
      </div>
    </div>
  );
};
