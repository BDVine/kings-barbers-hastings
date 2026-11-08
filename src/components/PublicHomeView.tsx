import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Crown,
  Scissors,
  Check,
  QrCode,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { BrandConfig } from '../config/brand';
import { SubscriptionPlan } from '../data/mockData';

interface PublicHomeViewProps {
  brand: BrandConfig;
  onStartJoin: (plan: SubscriptionPlan) => void;
  onOpenPass: () => void;
}

export const PublicHomeView: React.FC<PublicHomeViewProps> = ({
  brand,
  onStartJoin,
  onOpenPass,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('annual');
  const [cutsPerMonth, setCutsPerMonth] = useState<number>(2);

  const avgCutPrice = 18;
  const yearlyWalkInSpend = cutsPerMonth * 12 * avgCutPrice;
  const annualSubSavings = Math.max(0, yearlyWalkInSpend - brand.subscription.annualPrice);

  return (
    <div className="pb-28 space-y-6">
      {/* Top Heritage Barber Pole Strip */}
      <div className="h-2.5 w-full barber-pole-bg animate-pole border-b border-black" />

      {/* HERO SIGNBOARD — Modelled directly on the 85 Queens Road wooden fascia sign */}
      <section className="px-4 pt-1">
        <div className="signboard-card p-5 relative">
          {/* Inner Pinstripe Border */}
          <div className="border border-kings-black/80 p-4 text-center relative">
            {/* Corner Shop Number Stamp like the real sign ("85") */}
            <div className="flex items-center justify-between text-[11px] font-serif font-extrabold tracking-widest uppercase text-kings-black/80 border-b border-kings-black/20 pb-2 mb-4">
              <span>No. 85 QUEENS RD</span>
              <span className="text-kings-red">{brand.established}</span>
              <span>31 SILVERHILL</span>
            </div>

            {/* Authentic Crest Emblem */}
            <div className="mx-auto w-24 h-24 bg-white border-2 border-kings-black p-1.5 mb-3 shadow-sm">
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="w-full h-full object-contain"
              />
            </div>

            <p className="font-display italic text-xs text-kings-black/75">
              Traditional & Modern Gentlemen’s Grooming
            </p>
            <h1 className="font-serif text-3xl font-black tracking-tight text-kings-black uppercase mt-0.5 leading-none">
              {brand.displayName}
            </h1>

            <div className="mt-3 inline-block bg-kings-black text-kings-cream text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1">
              HASTINGS & ST LEONARDS-ON-SEA
            </div>

            {/* Sharp Editorial CTAs */}
            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => onStartJoin(selectedPlan)}
                className="w-full py-3.5 px-4 bg-kings-red hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider border-2 border-kings-black hard-btn flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Crown className="w-4 h-4 fill-kings-gold text-kings-gold" />
                  <span>Join Unlimited Club (£25/mo)</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenPass}
                className="w-full py-2.5 px-4 bg-white hover:bg-kings-parchment text-kings-black font-bold text-xs uppercase tracking-wider border-2 border-kings-black flex items-center justify-center gap-2 transition"
              >
                <QrCode className="w-4 h-4 text-kings-red" />
                <span>Existing Member — Open QR Pass</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STOREFRONT PHOTOGRAPH BANNER */}
      <section className="px-4">
        <div className="dark-heritage-card overflow-hidden">
          <div className="relative h-36 border-b border-white/15">
            <img
              src={brand.storefrontUrl}
              alt="85 Queens Road Storefront"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end justify-between p-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-kings-gold block">
                  Walk-Ins Always Welcome
                </span>
                <p className="font-serif font-bold text-sm text-white uppercase">
                  Two Local Hastings Shops
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                ● Open 7 Days
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* THE KINGS UNLIMITED SUBSCRIPTION CLUB (£25/MO VS £250/YR) */}
      <section id="club" className="px-4">
        <div className="gold-framed-card p-5">
          <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-kings-gold block">
                MEMBERSHIP PASS
              </span>
              <h2 className="font-serif text-xl font-bold text-white uppercase tracking-tight">
                The Kings Unlimited Club
              </h2>
            </div>
            <Crown className="w-6 h-6 text-kings-gold" />
          </div>

          <p className="text-xs text-kings-cream/80 leading-relaxed">
            Pay once a month or once a year and get <strong>unlimited haircuts</strong> at both our Queens Road and Silverhill shops. Show your photo-locked QR pass in the chair.
          </p>

          {/* Sharp Segmented Tariff Switcher */}
          <div className="mt-4 grid grid-cols-2 border border-white/25 bg-black">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`py-3 px-3 text-left transition border-r border-white/20 ${
                selectedPlan === 'monthly'
                  ? 'bg-kings-cream text-kings-black'
                  : 'text-kings-cream/65 hover:text-white'
              }`}
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider block">
                Monthly Rolling
              </span>
              <span className="font-serif text-xl font-black block mt-0.5">
                £{brand.subscription.monthlyPrice}
                <span className="text-xs font-sans font-normal">/mo</span>
              </span>
            </button>

            <button
              onClick={() => setSelectedPlan('annual')}
              className={`py-3 px-3 text-left transition relative ${
                selectedPlan === 'annual'
                  ? 'bg-kings-gold text-kings-black'
                  : 'text-kings-cream/65 hover:text-white'
              }`}
            >
              <span className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider">
                <span>Annual VIP</span>
                <span className="bg-kings-black text-kings-gold px-1.5 py-0.5 text-[9px]">
                  2 MTHS FREE
                </span>
              </span>
              <span className="font-serif text-xl font-black block mt-0.5">
                £{brand.subscription.annualPrice}
                <span className="text-xs font-sans font-normal">/yr</span>
              </span>
            </button>
          </div>

          {/* Plan Breakdown Box */}
          <div className="mt-4 bg-black border border-white/15 p-4 space-y-3">
            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-kings-gold block">
                  {selectedPlan === 'annual'
                    ? 'ANNUAL PASS (WORKS OUT AT £20.83/MO)'
                    : 'MONTHLY ROLLING (CANCEL ANYTIME)'}
                </span>
                <span className="font-serif text-2xl font-black text-white">
                  {selectedPlan === 'annual' ? '£250.00 / Year' : '£25.00 / Month'}
                </span>
              </div>
              {selectedPlan === 'annual' && (
                <span className="text-[11px] font-extrabold uppercase px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                  Save £50/yr
                </span>
              )}
            </div>

            <ul className="space-y-2 text-xs text-kings-cream/85">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-kings-gold shrink-0" />
                <span>Valid 7 days a week at <strong>Queens Rd</strong> & <strong>Silverhill</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-kings-gold shrink-0" />
                <span>Instant digital QR member card on your phone</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-kings-gold shrink-0" />
                <span>Photo-locked ID (strictly 1 member per pass)</span>
              </li>
            </ul>

            {/* Quick Cut Frequency Calculator */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold text-kings-cream/70 mb-2">
                <span>How often do you get cut?</span>
                <span className="text-kings-gold">
                  {cutsPerMonth === 1
                    ? 'Once a month'
                    : cutsPerMonth === 2
                    ? 'Every Fortnight'
                    : 'Every Week'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { count: 1, label: 'Monthly' },
                  { count: 2, label: 'Fortnightly' },
                  { count: 4, label: 'Weekly' },
                ].map((item) => (
                  <button
                    key={item.count}
                    onClick={() => setCutsPerMonth(item.count)}
                    className={`py-2 text-xs font-bold uppercase tracking-wider border transition ${
                      cutsPerMonth === item.count
                        ? 'bg-white text-kings-black border-white'
                        : 'bg-transparent border-white/20 text-kings-cream/60'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-2.5 px-3 py-2 bg-white/5 border border-white/15 flex items-center justify-between text-xs">
                <span className="text-kings-cream/75">
                  Walk-in cost: <strong className="line-through">£{yearlyWalkInSpend}/yr</strong>
                </span>
                <span className="font-extrabold text-emerald-400 uppercase">
                  {annualSubSavings > 0
                    ? `Saves £${annualSubSavings}/yr`
                    : 'All Cuts Covered'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onStartJoin(selectedPlan)}
              className="w-full py-3.5 bg-kings-gold hover:bg-amber-400 text-kings-black font-extrabold text-xs uppercase tracking-widest border border-black hard-btn flex items-center justify-center gap-2"
            >
              <span>
                Sign Up — {selectedPlan === 'annual' ? '£250/Year' : '£25/Month'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/*TRADITIONAL BARBERSHOP PRICE BOARD */}
      <section className="px-4">
        <div className="dark-heritage-card p-5">
          <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-kings-red" />
              <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-white">
                Walk-In Tariff
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-kings-gold">
              CASH OR CARD
            </span>
          </div>

          <div className="space-y-3.5">
            {brand.services.map((service) => (
              <div key={service.id} className="flex items-baseline justify-between text-sm">
                <div className="pr-2">
                  <span className="font-bold text-white uppercase tracking-wide text-xs">
                    {service.name}
                  </span>
                  <span className="block text-[11px] text-kings-cream/50">
                    {service.duration} • Included in Club Pass
                  </span>
                </div>
                <div className="flex-1 border-b border-dotted border-white/25 mx-2 mb-1" />
                <div className="text-right shrink-0">
                  <span className="font-serif font-extrabold text-base text-kings-gold">
                    £{service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR 2 HASTINGS SHOPS & OPENING HOURS */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between border-b border-white/15 pb-2">
          <h2 className="font-serif text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
            <MapPin className="w-4 h-4 text-kings-red" />
            Shop Locations & Hours
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-widest text-kings-cream/60">
            NO BOOKING NEEDED
          </span>
        </div>

        <div className="space-y-3">
          {brand.locations.map((shop, index) => (
            <div key={shop.id} className="dark-heritage-card p-4">
              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-kings-red block">
                    BRANCH 0{index + 1} • {shop.badge}
                  </span>
                  <h3 className="font-serif font-bold text-base text-white uppercase mt-0.5">
                    {shop.name}
                  </h3>
                  <p className="text-xs text-kings-cream/75 mt-0.5">
                    {shop.address}, <strong>{shop.postcode}</strong>
                  </p>
                </div>
              </div>

              <div className="py-3 grid grid-cols-2 gap-2 text-xs border-b border-white/10">
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-kings-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-kings-cream/50 block">
                      Mon – Sat
                    </span>
                    <span className="font-bold text-white">{shop.hours.monSat}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-kings-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-kings-cream/50 block">
                      Sunday
                    </span>
                    <span className="font-bold text-white">{shop.hours.sun}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${shop.phone.replace(/\s+/g, '')}`}
                  className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-kings-gold" />
                  <span>{shop.phone}</span>
                </a>
                <a
                  href={shop.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-kings-cream text-kings-black text-xs font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
