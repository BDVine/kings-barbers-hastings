import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  Camera,
  Lock,
  CreditCard,
  Wallet,
  Sun,
  LogOut,
  Scissors,
  CalendarDays,
  PiggyBank,
  Repeat,
} from 'lucide-react';
import { BrandConfig } from '../config/brand';
import { MemberProfile, SubscriptionPlan } from '../data/mockData';
import { Crest, Segmented, PassCard, Group, Row, useToast } from './ui';
import { greeting } from './utils';

/* ===================== Shared top bar ===================== */
const TopBar: React.FC<{ onBack: () => void; title?: string; right?: React.ReactNode }> = ({ onBack, title, right }) => (
  <div className="sticky top-0 z-30 glass border-b hairline pt-safe">
    <div className="max-w-[480px] mx-auto h-12 px-2 flex items-center justify-between">
      <button onClick={onBack} className="press flex items-center text-[#0A84FF] text-[17px] pr-3">
        <ChevronLeft className="w-6 h-6" />
        Back
      </button>
      {title && <span className="text-[17px] font-semibold">{title}</span>}
      <div className="min-w-[64px] flex justify-end pr-2">{right}</div>
    </div>
  </div>
);

const Field: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <label className="block px-4 py-2.5">
    <span className="block text-[12px] text-b-muted">{label}</span>
    <input {...props} className="w-full bg-transparent text-[17px] text-b-cream placeholder:text-b-cream/25 focus:outline-none py-0.5" />
  </label>
);

/* ===================== Sign in ===================== */
export const SignIn: React.FC<{
  brand: BrandConfig;
  members: MemberProfile[];
  onBack: () => void;
  onSignedIn: (memberId: string) => void;
  onJoin: () => void;
}> = ({ brand, members, onBack, onSignedIn, onJoin }) => {
  const [contact, setContact] = useState('');
  const [step, setStep] = useState<'contact' | 'code'>('contact');
  const [code, setCode] = useState('');

  const match = members.find(
    (m) => m.email.toLowerCase() === contact.trim().toLowerCase() || m.phone.replace(/\s/g, '') === contact.replace(/\s/g, '')
  );

  return (
    <div className="font-ios min-h-[100dvh]">
      <TopBar onBack={onBack} />
      <div className="max-w-[480px] mx-auto px-5 pt-8 pb-safe-plus">
        <Crest src={brand.logoUrl} size={56} />
        <h1 className="mt-5 font-editorial text-[36px] leading-tight">
          {step === 'contact' ? 'Welcome back' : 'Check your phone'}
        </h1>
        <p className="mt-2 text-[16px] text-b-cream/65">
          {step === 'contact'
            ? 'Enter your mobile number or email and we’ll send you a login code. No passwords to remember.'
            : `We’ve sent a 6-digit code to ${contact || 'your phone'}.`}
        </p>

        {step === 'contact' ? (
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              setStep('code');
            }}
          >
            <div className="rounded-[14px] bg-b-surface border hairline">
              <Field label="Mobile or email" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="07700 900412" autoComplete="username" inputMode="email" />
            </div>
            <button className="press mt-4 w-full h-[52px] rounded-[14px] bg-b-cream text-b-ink text-[16px] font-semibold">Send code</button>
          </form>
        ) : (
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              onSignedIn((match ?? members[0]).id);
            }}
          >
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="••••••"
              className="w-full h-16 rounded-[14px] bg-b-surface border hairline text-center text-[28px] tracking-[0.5em] font-semibold text-b-cream placeholder:text-b-cream/20 focus:outline-none focus:border-b-brass/60"
            />
            <p className="mt-2 text-[13px] text-b-muted text-center">Demo: enter any 6 digits. On iPhone the code auto-fills from Messages.</p>
            <button disabled={code.length < 6} className="press mt-4 w-full h-[52px] rounded-[14px] bg-b-cream text-b-ink text-[16px] font-semibold disabled:opacity-40">
              Sign in
            </button>
          </form>
        )}

        <div className="mt-10">
          <Group title="Demo accounts" footer="Tap one to jump straight into a member’s pass.">
            {members.slice(0, 5).map((m) => (
              <Row
                key={m.id}
                onClick={() => onSignedIn(m.id)}
                icon={<img src={m.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />}
                label={m.fullName}
                value={
                  <span className={`text-[13px] ${m.status === 'active' ? 'text-emerald-300' : 'text-red-300'}`}>
                    {m.status === 'active' ? 'Active' : 'Payment due'}
                  </span>
                }
              />
            ))}
          </Group>
        </div>

        <p className="mt-8 text-center text-[15px] text-b-cream/60">
          Not a member yet?{' '}
          <button onClick={onJoin} className="text-b-brass font-semibold">Join the Club</button>
        </p>
      </div>
    </div>
  );
};

/* ===================== Join flow ===================== */
const DEMO_FACES = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
];

export const Join: React.FC<{
  brand: BrandConfig;
  initialPlan: SubscriptionPlan;
  onBack: () => void;
  onComplete: (m: MemberProfile) => void;
}> = ({ brand, initialPlan, onBack, onComplete }) => {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<SubscriptionPlan>(initialPlan);
  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paying, setPaying] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const steps = ['Plan', 'Photo', 'Details', 'Pay'];

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => typeof r.result === 'string' && setPhoto(r.result);
    r.readAsDataURL(f);
  };

  const price = plan === 'annual' ? '£250.00' : '£25.00';

  const finish = () => {
    setPaying(true);
    setTimeout(() => {
      const digits = Math.floor(1000 + Math.random() * 9000);
      onComplete({
        id: `mem-${Date.now()}`,
        memberCode: `KINGS-${digits}-${plan === 'annual' ? 'VIP' : 'MTH'}`,
        fullName: name.trim() || 'New Member',
        phone: phone.trim() || '07700 900000',
        email: email.trim() || 'member@example.com',
        photoUrl: photo || DEMO_FACES[0],
        photoLocked: true,
        plan,
        status: 'active',
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        renewalDate: (() => {
          const d = new Date();
          plan === 'annual' ? d.setFullYear(d.getFullYear() + 1) : d.setMonth(d.getMonth() + 1);
          return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        })(),
        totalCutsThisYear: 0,
        lastCutDate: null,
        lastCutShopId: null,
      });
    }, 1100);
  };

  const canNext = step === 0 || (step === 1 && !!photo) || (step === 2 && name.trim() && phone.trim() && email.trim());

  return (
    <div className="font-ios min-h-[100dvh] flex flex-col">
      <TopBar onBack={() => (step === 0 ? onBack() : setStep(step - 1))} title="Join the Club" right={<span className="text-[13px] text-b-muted">{step + 1}/4</span>} />

      <div className="max-w-[480px] w-full mx-auto px-5 pt-4 flex-1 flex flex-col pb-safe-plus">
        {/* progress */}
        <div className="grid grid-cols-4 gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-b-brass' : 'bg-white/10'}`} />
          ))}
        </div>

        <div key={step} className="animate-riseIn flex-1 pt-7">
          {step === 0 && (
            <>
              <h1 className="font-editorial text-[32px] leading-tight">Choose your membership</h1>
              <p className="mt-2 text-[16px] text-b-cream/65">Unlimited cuts at both shops. Change or cancel any time.</p>
              <div className="mt-7 space-y-3">
                {(['annual', 'monthly'] as SubscriptionPlan[]).map((p) => {
                  const sel = plan === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPlan(p)}
                      className={`press w-full text-left rounded-[16px] p-4 border-2 transition-colors ${sel ? 'border-b-brass bg-b-brass/[0.08]' : 'border-white/10 bg-b-surface'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[17px] font-semibold flex items-center gap-2">
                            {p === 'annual' ? 'Yearly' : 'Monthly'}
                            {p === 'annual' && <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-b-brass text-b-ink font-bold">2 MONTHS FREE</span>}
                          </p>
                          <p className="text-[14px] text-b-muted mt-0.5">{p === 'annual' ? '£20.83 a month, billed yearly' : 'Rolling, cancel anytime'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-editorial text-[28px] leading-none">£{p === 'annual' ? brand.subscription.annualPrice : brand.subscription.monthlyPrice}</p>
                          <p className="text-[12px] text-b-muted">/{p === 'annual' ? 'year' : 'month'}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="font-editorial text-[32px] leading-tight">Add your photo</h1>
              <p className="mt-2 text-[16px] text-b-cream/65">
                It goes on your pass and pops up on your barber’s screen when you’re scanned — so nobody else can use your membership.
              </p>
              <div className="mt-8 flex flex-col items-center">
                <button onClick={() => fileRef.current?.click()} className="press relative w-44 h-44 rounded-[28px] bg-b-surface border-2 border-dashed border-b-brass/40 overflow-hidden flex items-center justify-center">
                  {photo ? <img src={photo} alt="You" className="w-full h-full object-cover" /> : (
                    <div className="text-center">
                      <Camera className="w-9 h-9 mx-auto text-b-brass" />
                      <p className="mt-2 text-[14px] text-b-cream/70">Take a selfie</p>
                    </div>
                  )}
                </button>
                {/* capture="user" opens the iPhone front camera directly */}
                <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={onFile} className="hidden" />
                {photo && (
                  <button onClick={() => fileRef.current?.click()} className="mt-3 text-[15px] text-[#0A84FF]">Retake</button>
                )}
                <div className="mt-6 flex items-center gap-2 text-[13px] text-b-muted">
                  Demo faces:
                  {DEMO_FACES.map((f) => (
                    <button key={f} onClick={() => setPhoto(f)} className={`w-8 h-8 rounded-full overflow-hidden ring-2 ${photo === f ? 'ring-b-brass' : 'ring-transparent'}`}>
                      <img src={f} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="mt-8 w-full rounded-[14px] bg-b-surface border hairline p-4 flex gap-3 text-[14px] text-b-cream/70">
                  <Lock className="w-4 h-4 text-b-brass shrink-0 mt-0.5" />
                  Once your membership starts, your photo is locked. Need a new one? Just ask at the shop.
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-editorial text-[32px] leading-tight">Your details</h1>
              <p className="mt-2 text-[16px] text-b-cream/65">We’ll use these to log you in and send receipts.</p>
              <div className="mt-7 rounded-[14px] bg-b-surface border hairline divide-y divide-white/[0.06]">
                <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Jack Reynolds" />
                <Field label="Mobile" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" type="tel" placeholder="07700 900000" />
                <Field label="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" type="email" placeholder="jack@example.com" />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="font-editorial text-[32px] leading-tight">Confirm & pay</h1>
              <div className="mt-7">
                <Group>
                  <Row label="Membership" value={plan === 'annual' ? 'Yearly' : 'Monthly'} />
                  <Row label="Member" value={name || '—'} />
                  <Row label="Valid at" value="Queens Rd & Silverhill" />
                  <Row label={<span className="font-semibold">Today</span>} value={<span className="text-b-cream font-semibold">{price}</span>} />
                </Group>
                <p className="px-4 pt-2 text-[12px] text-b-muted">
                  {plan === 'annual' ? 'Renews yearly at £250.' : 'Renews monthly at £25.'} Cancel anytime from your account. Payments are handled securely by Stripe.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-6">
          {step < 3 ? (
            <button disabled={!canNext} onClick={() => setStep(step + 1)} className="press w-full h-[52px] rounded-[14px] bg-b-cream text-b-ink text-[16px] font-semibold disabled:opacity-40">
              Continue
            </button>
          ) : (
            <div className="space-y-2.5">
              <button onClick={finish} disabled={paying} className="press w-full h-[52px] rounded-[14px] bg-black border border-white/20 text-white text-[17px] font-semibold flex items-center justify-center gap-2">
                {paying ? 'Processing…' : <>Pay with <Wallet className="w-5 h-5" /> Apple Pay</>}
              </button>
              <button onClick={finish} disabled={paying} className="press w-full h-[52px] rounded-[14px] bg-white/[0.06] text-[16px] font-medium flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" /> Pay by card
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===================== Member home ===================== */
export const MemberHome: React.FC<{
  brand: BrandConfig;
  member: MemberProfile;
  isNew?: boolean;
  onSignOut: () => void;
  onSwitchPlan: () => void;
  onFixPayment: () => void;
}> = ({ brand, member, isNew, onSignOut, onSwitchPlan, onFixPayment }) => {
  const { toast, toastNode } = useToast();
  const [awake, setAwake] = useState(false);

  // Keep the iPhone screen on while the pass is showing (iOS 16.4+)
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    const nav = navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    if (nav.wakeLock) {
      nav.wakeLock.request('screen').then((l) => { lock = l; setAwake(true); }).catch(() => setAwake(false));
    }
    return () => { lock?.release().catch(() => undefined); };
  }, []);

  useEffect(() => {
    if (isNew) toast('Welcome to the Kings Club 👑');
  }, [isNew]);

  const firstName = member.fullName.split(' ')[0];
  const paid = member.plan === 'annual' ? 250 : 25 * 6;
  const saved = Math.max(0, member.totalCutsThisYear * 18 - paid);

  return (
    <div className="font-ios min-h-[100dvh]">
      {toastNode}
      <div className="sticky top-0 z-30 glass border-b hairline pt-safe">
        <div className="max-w-[480px] mx-auto h-12 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crest src={brand.logoUrl} size={28} />
            <span className="font-editorial text-[17px]">Kings Club</span>
          </div>
          <button onClick={onSignOut} className="press text-[15px] text-[#0A84FF]">Sign out</button>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 pt-6 pb-safe-plus space-y-8">
        <div>
          <p className="text-[15px] text-b-muted">{greeting()},</p>
          <h1 className="font-editorial text-[38px] leading-tight">{firstName}</h1>
        </div>

        <div className="animate-riseIn">
          <PassCard brand={brand} member={member} onFixPayment={onFixPayment} />
          <div className="mt-3 flex items-center justify-center gap-4 text-[12px] text-b-muted">
            {awake && <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5" />Screen kept on</span>}
            <span>Turn your brightness up at the counter</span>
          </div>
        </div>

        <button
          onClick={() => toast('Apple Wallet passes come in the live version')}
          className="press w-full h-[52px] rounded-[14px] bg-black border border-white/20 text-white text-[16px] font-semibold flex items-center justify-center gap-2"
        >
          <Wallet className="w-5 h-5" /> Add to Apple Wallet
        </button>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: <Scissors className="w-4 h-4" />, label: 'Cuts this year', value: member.totalCutsThisYear },
            { icon: <PiggyBank className="w-4 h-4" />, label: 'Saved', value: `£${saved}` },
            { icon: <CalendarDays className="w-4 h-4" />, label: 'Last cut', value: member.lastCutDate?.replace(' ago', '') ?? '—' },
          ].map((s) => (
            <div key={s.label} className="rounded-[14px] bg-b-surface border hairline p-3">
              <span className="text-b-brass">{s.icon}</span>
              <p className="mt-2 text-[18px] font-semibold leading-tight truncate">{s.value}</p>
              <p className="text-[12px] text-b-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <Group title="Membership">
          <Row label="Plan" value={member.plan === 'annual' ? 'Yearly · £250' : 'Monthly · £25'} />
          <Row label={member.status === 'active' ? 'Renews' : 'Status'} value={member.status === 'active' ? member.renewalDate : <span className="text-red-300">Payment due</span>} />
          <Row label="Payment method" value="Apple Pay" />
          {member.plan === 'monthly' && (
            <Row onClick={onSwitchPlan} icon={<Repeat className="w-4 h-4 text-b-brass" />} label="Switch to yearly & save £50" accent />
          )}
          <Row onClick={() => toast('Opens the Stripe billing portal in the live version')} label="Manage subscription" value="›" />
        </Group>

        <Group title="Your photo" footer="Your photo is locked to stop memberships being shared. Ask your barber if you need a new one.">
          <Row icon={<img src={member.photoUrl} alt="" className="w-9 h-9 rounded-[10px] object-cover" />} label="Pass photo" value={<span className="flex items-center gap-1 text-[13px]"><Lock className="w-3.5 h-3.5" />Locked</span>} />
        </Group>

        <button onClick={onSignOut} className="press w-full h-12 rounded-[14px] bg-b-surface border hairline text-red-300 text-[16px] font-medium flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );
};

