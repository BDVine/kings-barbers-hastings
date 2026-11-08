import React, { useEffect, useState } from 'react';
import { Check, MapPin, Phone, Clock, ArrowRight, Facebook, ChevronRight, Scissors, QrCode, Smartphone, Share } from 'lucide-react';
import { BrandConfig } from '../config/brand';
import { SubscriptionPlan, INITIAL_MEMBERS } from '../data/mockData';
import { Crest, Segmented, PassCard } from './ui';
import { shopStatus, appleMapsUrl } from './utils';

interface Props {
  brand: BrandConfig;
  onSignIn: () => void;
  onJoin: (plan: SubscriptionPlan) => void;
  onStaff: () => void;
}

const isIos = () => /iPhone|iPad|iPod/.test(navigator.userAgent);
const isStandalone = () =>
  (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches;

export const PublicSite: React.FC<Props> = ({ brand, onSignIn, onJoin, onStaff }) => {
  const [scrolled, setScrolled] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan>('annual');
  const [freq, setFreq] = useState<'1' | '2' | '4'>('2');
  const [showInstall, setShowInstall] = useState(false);
  const status = shopStatus();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isIos() && !isStandalone() && !sessionStorage.getItem('kingsB_installDismissed')) {
      const t = setTimeout(() => setShowInstall(true), 2500);
      return () => clearTimeout(t);
    }
  }, []);

  const avgCut = 18;
  const walkInYear = Number(freq) * 12 * avgCut;
  const clubYear = plan === 'annual' ? brand.subscription.annualPrice : brand.subscription.monthlyPrice * 12;
  const saving = walkInYear - clubYear;

  return (
    <div className="font-ios">
      {/* ---------- Header ---------- */}
      <header
        className={`fixed top-0 inset-x-0 z-40 pt-safe transition-colors duration-300 ${
          scrolled ? 'glass border-b hairline' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[480px] mx-auto h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Crest src={brand.logoUrl} size={34} />
            <span className={`font-editorial text-[18px] transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
              Kings Barbers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onSignIn} className="press px-3 py-1.5 text-[14px] font-medium text-b-cream/90">
              Sign in
            </button>
            <button
              onClick={() => onJoin(plan)}
              className="press px-3.5 py-1.5 rounded-[10px] bg-b-brass text-b-ink text-[14px] font-semibold"
            >
              Join
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative min-h-[88svh] max-h-[860px] flex flex-col justify-end overflow-hidden">
        <img src={brand.storefrontUrl} alt="The Kings Barber, 85 Queens Road" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-b-ink/70 via-b-ink/50 to-b-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(179,38,47,0.25),transparent_60%)]" />

        <div className="relative max-w-[480px] mx-auto w-full px-6 pb-10">
          <div className="animate-riseIn inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border hairline text-[13px]">
            <span className={`w-2 h-2 rounded-full ${status.open ? 'bg-emerald-400 animate-pulse' : 'bg-b-muted'}`} />
            <span className="text-b-cream/90">{status.label}</span>
          </div>

          <h1 className="animate-riseIn [animation-delay:80ms] mt-5 font-editorial text-[52px] leading-[0.98] tracking-[-0.01em]">
            Sharp cuts.
            <br />
            <span className="italic text-b-brass">Since 2000.</span>
          </h1>
          <p className="animate-riseIn [animation-delay:160ms] mt-4 text-[17px] leading-relaxed text-b-cream/75 max-w-[340px]">
            Two barbershops in Hastings & St Leonards. Walk in, no booking — or join the Kings Club for unlimited cuts.
          </p>

          <div className="animate-riseIn [animation-delay:240ms] mt-7 flex flex-col gap-2.5">
            <button
              onClick={() => onJoin(plan)}
              className="press h-[52px] rounded-[14px] bg-b-brass text-b-ink text-[16px] font-semibold flex items-center justify-center gap-2"
            >
              Join the Kings Club · from £20.83/mo
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#shops"
              className="press h-[52px] rounded-[14px] glass border hairline text-[16px] font-medium flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-b-brass" />
              Find a shop
            </a>
          </div>
        </div>
      </section>

      <main className="max-w-[480px] mx-auto px-5 space-y-16 pb-safe-plus">
        {/* ---------- Club ---------- */}
        <section id="club" className="pt-4">
          <p className="text-[12px] tracking-[0.2em] uppercase text-b-brass font-semibold">The Kings Club</p>
          <h2 className="mt-2 font-editorial text-[36px] leading-[1.05]">Unlimited cuts. One membership.</h2>
          <p className="mt-3 text-[16px] text-b-cream/70 leading-relaxed">
            Come in as often as you like at either shop. Show the pass on your phone, sit down, done.
          </p>

          {/* Pass preview */}
          <div className="relative mt-8 mx-2 [transform:perspective(1200px)_rotateX(8deg)_rotateZ(-2deg)]">
            <PassCard brand={brand} member={{ ...INITIAL_MEMBERS[0], fullName: 'Your Name Here', memberCode: 'KINGS-0000-VIP' }} compact showQr={false} />
          </div>

          <div className="mt-8 rounded-[20px] bg-b-surface border hairline p-5">
            <Segmented
              value={plan}
              onChange={setPlan}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'annual', label: 'Yearly · save £50' },
              ]}
            />

            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-editorial text-[48px] leading-none">
                    £{plan === 'annual' ? brand.subscription.annualPrice : brand.subscription.monthlyPrice}
                  </span>
                  <span className="text-[15px] text-b-muted">/{plan === 'annual' ? 'year' : 'month'}</span>
                </div>
                <p className="mt-1.5 text-[14px] text-b-cream/60">
                  {plan === 'annual' ? 'Works out at £20.83 a month · 2 months free' : 'Rolling monthly · cancel anytime'}
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {[
                'Unlimited haircuts at Queens Road & Silverhill',
                'Your pass lives on your iPhone — no app to download',
                'Photo-verified, so your membership stays yours',
                'Pay with Apple Pay or card',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] text-b-cream/85">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-b-brass/15 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-b-brass" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            {/* Savings */}
            <div className="mt-6 pt-5 border-t hairline">
              <p className="text-[14px] text-b-cream/70 mb-3">I usually get a cut…</p>
              <Segmented
                value={freq}
                onChange={setFreq}
                options={[
                  { value: '4', label: 'Weekly' },
                  { value: '2', label: 'Fortnightly' },
                  { value: '1', label: 'Monthly' },
                ]}
              />
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-[12px] bg-white/[0.04] p-3">
                  <p className="text-[12px] text-b-muted">Paying per cut</p>
                  <p className="mt-0.5 text-[20px] font-semibold tabular-nums text-b-cream/60 line-through decoration-1">£{walkInYear}/yr</p>
                </div>
                <div className={`rounded-[12px] p-3 ${saving > 0 ? 'bg-emerald-400/10' : 'bg-white/[0.04]'}`}>
                  <p className="text-[12px] text-b-muted">With the Club</p>
                  <p className={`mt-0.5 text-[20px] font-semibold tabular-nums ${saving > 0 ? 'text-emerald-300' : 'text-b-cream'}`}>
                    {saving > 0 ? `Save £${saving}` : `£${clubYear}/yr`}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onJoin(plan)}
              className="press mt-6 w-full h-[52px] rounded-[14px] bg-b-brass text-b-ink text-[16px] font-semibold"
            >
              Join for £{plan === 'annual' ? '250 a year' : '25 a month'}
            </button>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section>
          <p className="text-[12px] tracking-[0.2em] uppercase text-b-brass font-semibold">How it works</p>
          <div className="mt-5 space-y-5">
            {[
              { icon: <Smartphone className="w-5 h-5" />, title: 'Join online in two minutes', body: 'Pick monthly or yearly, add a photo, pay with Apple Pay.' },
              { icon: <QrCode className="w-5 h-5" />, title: 'Your pass appears instantly', body: 'Save it to your Home Screen — it’s always one tap away.' },
              { icon: <Scissors className="w-5 h-5" />, title: 'Show it, sit down', body: 'Your barber scans it, checks your photo, and gets cutting.' },
            ].map((s, i) => (
              <div key={s.title} className="flex gap-4">
                <div className="relative">
                  <div className="w-11 h-11 rounded-[12px] bg-b-surface border hairline flex items-center justify-center text-b-brass">{s.icon}</div>
                  {i < 2 && <div className="absolute left-1/2 top-12 bottom-[-20px] w-px bg-white/10" />}
                </div>
                <div className="pt-1">
                  <p className="text-[16px] font-semibold">{s.title}</p>
                  <p className="text-[15px] text-b-cream/60 mt-0.5">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Shops ---------- */}
        <section id="shops" className="scroll-mt-20">
          <p className="text-[12px] tracking-[0.2em] uppercase text-b-brass font-semibold">Our shops</p>
          <h2 className="mt-2 font-editorial text-[32px] leading-tight">Walk in. No booking.</h2>

          <div className="mt-6 -mx-5 px-5 flex gap-3.5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
            {brand.locations.map((shop, i) => (
              <article key={shop.id} className="snap-center shrink-0 w-[86%] rounded-[20px] bg-b-surface border hairline overflow-hidden">
                <div className="relative h-36">
                  {i === 0 ? (
                    <img src={brand.storefrontUrl} alt={shop.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[linear-gradient(135deg,#1C2A4A,#0B0A09)] guilloche flex items-center justify-center">
                      <Crest src={brand.logoUrl} size={72} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-b-surface via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-[12px] font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.open ? 'bg-emerald-400' : 'bg-b-muted'}`} />
                    {status.open ? 'Open now' : 'Closed'}
                  </span>
                </div>
                <div className="p-4 pt-1">
                  <h3 className="font-editorial text-[24px]">{shop.shortName}</h3>
                  <p className="text-[14px] text-b-cream/60">{shop.address}, {shop.postcode}</p>

                  <div className="mt-4 space-y-1.5 text-[14px]">
                    <div className="flex justify-between"><span className="text-b-muted flex items-center gap-2"><Clock className="w-3.5 h-3.5" />Mon – Sat</span><span>9am – 6pm</span></div>
                    <div className="flex justify-between"><span className="text-b-muted flex items-center gap-2"><Clock className="w-3.5 h-3.5" />Sunday</span><span>10am – 4pm</span></div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a href={`tel:${shop.phone.replace(/\s+/g, '')}`} className="press h-11 rounded-[12px] bg-white/[0.06] text-[14px] font-medium flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4 text-b-brass" /> Call
                    </a>
                    <a href={appleMapsUrl(shop.address, shop.postcode)} className="press h-11 rounded-[12px] bg-b-cream text-b-ink text-[14px] font-semibold flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" /> Directions
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Prices ---------- */}
        <section>
          <p className="text-[12px] tracking-[0.2em] uppercase text-b-brass font-semibold">Prices</p>
          <h2 className="mt-2 font-editorial text-[32px] leading-tight">Pay as you go</h2>
          <div className="mt-6 rounded-[20px] bg-b-surface border hairline divide-y divide-white/[0.06]">
            {brand.services.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-[16px] font-medium flex items-center gap-2">
                    {s.name}
                    {s.popular && <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-b-brass/15 text-b-brass font-semibold">Popular</span>}
                  </p>
                  <p className="text-[13px] text-b-muted mt-0.5">{s.duration}</p>
                </div>
                <span className="font-editorial text-[22px]">£{s.price}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 px-1 text-[13px] text-b-muted">Cash or card. Haircuts are included with the Kings Club.</p>
        </section>

        {/* ---------- Footer ---------- */}
        <footer className="pt-6 pb-4 border-t hairline">
          <div className="flex items-center gap-3">
            <Crest src={brand.logoUrl} size={44} />
            <div>
              <p className="font-editorial text-[20px]">The Kings Barber</p>
              <p className="text-[13px] text-b-muted">Hastings & St Leonards · Est. 2000</p>
            </div>
          </div>
          <div className="mt-6 space-y-1">
            <a href={brand.facebookUrl} target="_blank" rel="noreferrer" className="press flex items-center justify-between py-3 text-[15px]">
              <span className="flex items-center gap-3"><Facebook className="w-4 h-4 text-b-brass" />Follow us on Facebook</span>
              <ChevronRight className="w-4 h-4 text-b-muted" />
            </a>
            <button onClick={onSignIn} className="press w-full flex items-center justify-between py-3 text-[15px]">
              <span>Member sign in</span>
              <ChevronRight className="w-4 h-4 text-b-muted" />
            </button>
            <button onClick={onStaff} className="press w-full flex items-center justify-between py-3 text-[15px] text-b-muted">
              <span>Staff login (PIN: 2000)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <a href="/" className="press flex items-center justify-between py-3 text-[15px] text-b-muted">
              <span>Switch to Design A (Signboard style)</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-6 text-[12px] text-b-muted/70">© {new Date().getFullYear()} Kings Barbers. All rights reserved.</p>
        </footer>
      </main>

      {/* ---------- iPhone "Add to Home Screen" hint ---------- */}
      {showInstall && (
        <div className="fixed inset-x-3 bottom-3 z-50 pb-safe animate-sheetUp">
          <div className="max-w-[460px] mx-auto rounded-[18px] glass border hairline p-4 shadow-2xl flex gap-3">
            <Crest src={brand.logoUrl} size={44} />
            <div className="flex-1 text-[14px]">
              <p className="font-semibold">Add Kings to your Home Screen</p>
              <p className="text-b-cream/65 mt-0.5 leading-snug">
                Tap <Share className="inline w-4 h-4 -mt-1 text-[#0A84FF]" /> then <strong>“Add to Home Screen”</strong> to keep your pass one tap away.
              </p>
            </div>
            <button
              onClick={() => {
                sessionStorage.setItem('kingsB_installDismissed', '1');
                setShowInstall(false);
              }}
              className="self-start text-b-muted text-[20px] leading-none px-1"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
