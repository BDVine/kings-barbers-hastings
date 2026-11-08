import React, { useState } from 'react';
import {
  QrCode,
  Calculator,
  Users,
  CheckCircle2,
  AlertTriangle,
  Scissors,
  Banknote,
  CreditCard,
  RotateCcw,
  Lock,
  Unlock,
  Search,
  MapPin,
  Camera,
  Check,
} from 'lucide-react';
import { BrandConfig } from '../config/brand';
import {
  MemberProfile,
  TallyTransaction,
  CheckInRecord,
} from '../data/mockData';

interface BarberAdminViewProps {
  brand: BrandConfig;
  members: MemberProfile[];
  tallies: TallyTransaction[];
  checkIns: CheckInRecord[];
  scannedMember: MemberProfile | null;
  onSelectScannedMember: (member: MemberProfile | null) => void;
  onConfirmMemberCut: (memberId: string, shopId: string) => void;
  onTogglePhotoLock: (memberId: string) => void;
  onToggleMemberStatus: (memberId: string) => void;
  onAddTally: (tx: Omit<TallyTransaction, 'id' | 'timestamp'>) => void;
  onUndoLastTally: (shopId: string) => void;
}

type AdminSubTab = 'tally' | 'scanner' | 'members';

export const BarberAdminView: React.FC<BarberAdminViewProps> = ({
  brand,
  members,
  tallies,
  scannedMember,
  onSelectScannedMember,
  onConfirmMemberCut,
  onTogglePhotoLock,
  onToggleMemberStatus,
  onAddTally,
  onUndoLastTally,
}) => {
  const [subTab, setSubTab] = useState<AdminSubTab>(
    scannedMember ? 'scanner' : 'tally'
  );
  const [activeShopId, setActiveShopId] = useState<string>(
    brand.locations[0].id
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    brand.services[1].id
  );
  const [customPrice, setCustomPrice] = useState<string>('');
  const [justLoggedBanner, setJustLoggedBanner] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cutConfirmedFlash, setCutConfirmedFlash] = useState<boolean>(false);

  React.useEffect(() => {
    if (scannedMember) {
      setSubTab('scanner');
    }
  }, [scannedMember]);

  const activeShop =
    brand.locations.find((s) => s.id === activeShopId) || brand.locations[0];
  const selectedService =
    brand.services.find((s) => s.id === selectedServiceId) || brand.services[0];

  const effectivePrice =
    customPrice.trim() !== '' && !isNaN(Number(customPrice))
      ? Number(customPrice)
      : selectedService.price;

  const shopTallies = tallies.filter((t) => t.shopId === activeShopId);
  const cashTallies = shopTallies.filter((t) => t.paymentType === 'cash');
  const cardTallies = shopTallies.filter((t) => t.paymentType === 'card');

  const totalCashRevenue = cashTallies.reduce((sum, t) => sum + t.amount, 0);
  const totalCardRevenue = cardTallies.reduce((sum, t) => sum + t.amount, 0);
  const totalRevenue = totalCashRevenue + totalCardRevenue;
  const cashPct =
    shopTallies.length > 0
      ? Math.round((cashTallies.length / shopTallies.length) * 100)
      : 50;

  const handleRecordPayment = (paymentType: 'cash' | 'card') => {
    const label =
      customPrice.trim() !== '' ? 'Custom Walk-In' : selectedService.name;
    onAddTally({
      shopId: activeShopId,
      paymentType,
      serviceName: label,
      amount: effectivePrice,
    });
    setJustLoggedBanner(
      `+1 ${paymentType.toUpperCase()} (£${effectivePrice} ${label})`
    );
    setTimeout(() => setJustLoggedBanner(null), 2200);
  };

  const handleConfirmCut = (member: MemberProfile) => {
    onConfirmMemberCut(member.id, activeShopId);
    setCutConfirmedFlash(true);
    setTimeout(() => {
      setCutConfirmedFlash(false);
    }, 1800);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery)
  );

  return (
    <div className="px-4 pt-3 pb-28 space-y-4">
      {/* SHOP BRANCH SELECTOR */}
      <div className="bg-black border border-white/25 p-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-kings-gold pl-1">
          <MapPin className="w-3.5 h-3.5 text-kings-red" />
          <span>Shop Till:</span>
        </div>
        <div className="grid grid-cols-2 border border-white/25 flex-1 max-w-[230px]">
          {brand.locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setActiveShopId(loc.id)}
              className={`py-1.5 px-2 text-[11px] font-extrabold uppercase tracking-wider transition ${
                activeShopId === loc.id
                  ? 'bg-kings-red text-white'
                  : 'bg-black text-kings-cream/60 hover:text-white'
              }`}
            >
              {loc.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* SHARP 3-TAB ADMIN BAR */}
      <div className="grid grid-cols-3 border border-white/25 bg-black">
        <button
          onClick={() => setSubTab('tally')}
          className={`py-2.5 px-2 text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 border-r border-white/20 transition ${
            subTab === 'tally'
              ? 'bg-kings-gold text-kings-black'
              : 'text-kings-cream/70 hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Till Tally</span>
        </button>

        <button
          onClick={() => setSubTab('scanner')}
          className={`py-2.5 px-2 text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 border-r border-white/20 transition ${
            subTab === 'scanner'
              ? 'bg-kings-gold text-kings-black'
              : 'text-kings-cream/70 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR Scan</span>
        </button>

        <button
          onClick={() => setSubTab('members')}
          className={`py-2.5 px-2 text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
            subTab === 'members'
              ? 'bg-kings-gold text-kings-black'
              : 'text-kings-cream/70 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Members ({members.length})</span>
        </button>
      </div>

      {/* =========================================================
          TOOL 1: CASH VS CARD TILL TALLY
      ========================================================= */}
      {subTab === 'tally' && (
        <div className="space-y-4">
          <div className="dark-heritage-card p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-kings-gold">
                01. Select Service Price
              </span>
              <span className="text-xs font-mono font-bold text-white">
                ACTIVE: £{effectivePrice}
              </span>
            </div>

            {/* Crisp Grid of Service Presets */}
            <div className="grid grid-cols-3 gap-2">
              {brand.services.map((srv) => {
                const isSelected =
                  customPrice === '' && selectedServiceId === srv.id;
                return (
                  <button
                    key={srv.id}
                    onClick={() => {
                      setSelectedServiceId(srv.id);
                      setCustomPrice('');
                    }}
                    className={`p-2.5 border text-left transition ${
                      isSelected
                        ? 'bg-kings-cream text-kings-black border-kings-gold'
                        : 'bg-black border-white/20 text-kings-cream hover:border-white/40'
                    }`}
                  >
                    <span className="font-serif text-lg font-black block leading-none">
                      £{srv.price}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-tight line-clamp-1 mt-1 block ${
                        isSelected ? 'text-kings-black/80' : 'text-kings-cream/65'
                      }`}
                    >
                      {srv.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-kings-cream/60 shrink-0">
                Custom £:
              </span>
              <input
                type="number"
                min="1"
                placeholder="Enter custom amount..."
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full px-3 py-1.5 bg-black border border-white/25 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-kings-gold"
              />
              {customPrice && (
                <button
                  onClick={() => setCustomPrice('')}
                  className="text-xs text-kings-red font-extrabold uppercase px-2"
                >
                  Clear
                </button>
              )}
            </div>

            {/* TACTILE CASH & CARD TILL KEYS */}
            <div className="pt-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-kings-gold block mb-2">
                02. Tap Payment Method
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleRecordPayment('cash')}
                  className="py-5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white border-2 border-black hard-btn flex flex-col items-center justify-center"
                >
                  <Banknote className="w-7 h-7 mb-1" />
                  <span className="font-serif text-lg font-black tracking-wider uppercase">
                    +1 CASH
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 mt-0.5">
                    £{effectivePrice} Cash
                  </span>
                </button>

                <button
                  onClick={() => handleRecordPayment('card')}
                  className="py-5 px-3 bg-kings-blue hover:bg-blue-700 text-white border-2 border-black hard-btn flex flex-col items-center justify-center"
                >
                  <CreditCard className="w-7 h-7 mb-1" />
                  <span className="font-serif text-lg font-black tracking-wider uppercase">
                    +1 CARD
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100 mt-0.5">
                    £{effectivePrice} Card
                  </span>
                </button>
              </div>
            </div>

            {justLoggedBanner && (
              <div className="bg-emerald-950 border border-emerald-500 px-3 py-2 text-center text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Recorded: {justLoggedBanner}</span>
              </div>
            )}
          </div>

          {/* DAILY TAKINGS LEDGER */}
          <div className="dark-heritage-card p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-kings-gold block">
                  DAILY TAKINGS • {activeShop.shortName}
                </span>
                <h3 className="font-serif text-xl font-black text-white uppercase">
                  £{totalRevenue}.00{' '}
                  <span className="text-xs font-sans font-normal text-kings-cream/60">
                    ({shopTallies.length} cuts)
                  </span>
                </h3>
              </div>

              <button
                onClick={() => onUndoLastTally(activeShopId)}
                disabled={shopTallies.length === 0}
                className="py-1.5 px-3 bg-black hover:bg-white/5 disabled:opacity-40 border border-white/25 text-[11px] font-extrabold uppercase tracking-wider text-kings-cream flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-kings-red" />
                <span>Undo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-black border border-emerald-500/40 p-3">
                <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  <span>CASH TILL</span>
                  <span>{cashTallies.length} CUTS</span>
                </div>
                <p className="font-serif text-2xl font-black text-white mt-1">
                  £{totalCashRevenue}
                </p>
              </div>

              <div className="bg-black border border-blue-500/40 p-3">
                <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                  <span>CARD MACHINE</span>
                  <span>{cardTallies.length} CUTS</span>
                </div>
                <p className="font-serif text-2xl font-black text-white mt-1">
                  £{totalCardRevenue}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span className="text-emerald-400">Cash {cashPct}%</span>
                <span className="text-blue-400">Card {100 - cashPct}%</span>
              </div>
              <div className="h-2 w-full bg-kings-blue flex border border-black">
                <div
                  className="bg-emerald-500 transition-all duration-300"
                  style={{ width: `${cashPct}%` }}
                />
              </div>
            </div>

            {/* Ledger Rows */}
            <div className="pt-2 border-t border-white/15 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-kings-cream/50 block">
                RECENT TILL ENTRIES
              </span>
              <div className="max-h-36 overflow-y-auto space-y-1">
                {shopTallies.slice(0, 8).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-black border border-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 font-extrabold text-[10px] uppercase ${
                          tx.paymentType === 'cash'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-blue-950 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {tx.paymentType}
                      </span>
                      <span className="font-bold text-white uppercase text-[11px]">
                        {tx.serviceName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-kings-gold">
                        £{tx.amount}
                      </span>
                      <span className="text-[10px] text-kings-cream/45">
                        {tx.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TOOL 2: QR SCANNER & PHOTO VERIFICATION
      ========================================================= */}
      {subTab === 'scanner' && (
        <div className="space-y-4">
          <div className="dark-heritage-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-kings-gold flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                QR Pass Verification
              </span>
              <span className="text-[10px] font-extrabold uppercase text-emerald-400">
                ● Scanner Ready
              </span>
            </div>

            <div className="p-3 bg-black border border-white/20 space-y-2">
              <p className="text-xs text-kings-cream/80">
                <strong>Test Scanner:</strong> Select a member below to preview what pops up when their QR code is scanned:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelectScannedMember(m)}
                    className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider border transition flex items-center gap-1.5 ${
                      scannedMember?.id === m.id
                        ? 'bg-kings-gold text-kings-black border-kings-gold'
                        : 'bg-transparent text-white border-white/20'
                    }`}
                  >
                    <img
                      src={m.photoUrl}
                      alt={m.fullName}
                      className="w-4 h-4 object-cover"
                    />
                    <span>{m.fullName.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {scannedMember && (
            <div
              className={`p-4 border-2 ${
                scannedMember.status === 'active'
                  ? 'bg-[#101C16] border-emerald-500'
                  : 'bg-[#221113] border-red-500'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
                {scannedMember.status === 'active' ? (
                  <span className="px-2.5 py-1 bg-emerald-500 text-kings-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    VALID MEMBER — AUTHORISED
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    PAYMENT OVERDUE — DECLINED
                  </span>
                )}
                <span className="text-xs font-mono text-kings-cream/70">
                  {scannedMember.memberCode}
                </span>
              </div>

              <div className="flex items-center gap-4 bg-black p-3.5 border border-white/15">
                <div className="relative shrink-0">
                  <img
                    src={scannedMember.photoUrl}
                    alt={scannedMember.fullName}
                    className="w-28 h-28 object-cover border-2 border-kings-gold"
                  />
                  <span className="block bg-kings-gold text-kings-black text-[9px] font-extrabold uppercase tracking-wider text-center py-0.5">
                    VERIFY FACE IN CHAIR
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="font-serif text-xl font-black text-white uppercase truncate">
                    {scannedMember.fullName}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-kings-gold">
                    {scannedMember.plan === 'annual'
                      ? 'Annual VIP (£250/yr)'
                      : 'Monthly Club (£25/mo)'}
                  </p>
                  <div className="pt-1 text-xs text-kings-cream/80 space-y-0.5">
                    <p>
                      Last Cut: <strong>{scannedMember.lastCutDate}</strong>
                    </p>
                    <p>
                      Cuts Used: <strong>{scannedMember.totalCutsThisYear}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {scannedMember.status === 'active' && (
                <button
                  onClick={() => handleConfirmCut(scannedMember)}
                  className="mt-4 w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-kings-black font-extrabold text-xs uppercase tracking-widest border-2 border-black hard-btn flex items-center justify-center gap-2"
                >
                  <Scissors className="w-4 h-4" />
                  <span>
                    {cutConfirmedFlash
                      ? '✓ HAIRCUT LOGGED'
                      : `CONFIRM & LOG HAIRCUT (${activeShop.shortName})`}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          TOOL 3: MEMBER DIRECTORY
      ========================================================= */}
      {subTab === 'members' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-kings-cream/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subscriber name, phone or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black border border-white/25 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-kings-gold"
            />
          </div>

          <div className="space-y-2.5">
            {filteredMembers.map((member) => (
              <div key={member.id} className="dark-heritage-card p-3.5 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={member.photoUrl}
                    alt={member.fullName}
                    className="w-12 h-12 object-cover border border-kings-gold"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <h4 className="font-serif font-bold text-sm text-white uppercase truncate">
                        {member.fullName}
                      </h4>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 uppercase border ${
                          member.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                            : 'bg-red-950 text-red-300 border-red-500/50'
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                    <p className="text-xs text-kings-cream/65 mt-0.5">
                      {member.phone} •{' '}
                      <strong className="text-kings-gold">
                        {member.plan === 'annual' ? '£250/yr' : '£25/mo'}
                      </strong>{' '}
                      • {member.totalCutsThisYear} cuts
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/15 text-[11px]">
                  <button
                    onClick={() => onTogglePhotoLock(member.id)}
                    className="py-1.5 px-2.5 bg-black border border-white/25 font-bold uppercase tracking-wider flex items-center gap-1 text-kings-cream"
                  >
                    {member.photoLocked ? (
                      <>
                        <Lock className="w-3 h-3 text-kings-gold" />
                        <span>ID Locked</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 text-amber-400" />
                        <span>Unlocked</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleMemberStatus(member.id)}
                      className="py-1.5 px-2.5 bg-black border border-white/20 text-kings-cream/80 font-bold uppercase tracking-wider"
                    >
                      {member.status === 'active' ? 'Mark Overdue' : 'Mark Paid'}
                    </button>
                    <button
                      onClick={() => {
                        onSelectScannedMember(member);
                        setSubTab('scanner');
                      }}
                      className="py-1.5 px-2.5 bg-kings-gold text-kings-black font-extrabold uppercase tracking-wider"
                    >
                      Check In
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
