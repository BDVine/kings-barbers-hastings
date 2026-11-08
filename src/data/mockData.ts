export type SubscriptionPlan = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'overdue' | 'cancelled';

export interface MemberProfile {
  id: string;
  memberCode: string;
  fullName: string;
  phone: string;
  email: string;
  photoUrl: string;
  photoLocked: boolean;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  joinedDate: string;
  renewalDate: string;
  totalCutsThisYear: number;
  lastCutDate: string | null;
  lastCutShopId: string | null;
}

export interface CheckInRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberPhoto: string;
  shopId: string;
  timestamp: string;
  serviceNote: string;
}

export interface TallyTransaction {
  id: string;
  shopId: string;
  paymentType: 'cash' | 'card';
  serviceName: string;
  amount: number;
  timestamp: string;
}

export const INITIAL_MEMBERS: MemberProfile[] = [
  {
    id: 'mem-1',
    memberCode: 'KINGS-8821-VIP',
    fullName: 'Benny Thompson',
    phone: '07700 900412',
    email: 'benny@hastings.co.uk',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    photoLocked: true,
    plan: 'annual',
    status: 'active',
    joinedDate: '12 Jan 2026',
    renewalDate: '12 Jan 2027',
    totalCutsThisYear: 18,
    lastCutDate: '14 days ago',
    lastCutShopId: 'queens-road',
  },
  {
    id: 'mem-2',
    memberCode: 'KINGS-3049-MTH',
    fullName: 'Marcus Sullivan',
    phone: '07812 334901',
    email: 'marcus.s@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    photoLocked: true,
    plan: 'monthly',
    status: 'active',
    joinedDate: '04 Jul 2026',
    renewalDate: '04 Dec 2026',
    totalCutsThisYear: 8,
    lastCutDate: 'Today (2 hrs ago)',
    lastCutShopId: 'silverhill',
  },
  {
    id: 'mem-3',
    memberCode: 'KINGS-9914-EXP',
    fullName: 'Liam O’Connor',
    phone: '07944 510293',
    email: 'liam.oc@outlook.com',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    photoLocked: true,
    plan: 'monthly',
    status: 'overdue',
    joinedDate: '19 Mar 2026',
    renewalDate: 'Payment Failed (02 Nov)',
    totalCutsThisYear: 11,
    lastCutDate: '23 days ago',
    lastCutShopId: 'queens-road',
  },
  {
    id: 'mem-4',
    memberCode: 'KINGS-5510-VIP',
    fullName: 'Dan Carter',
    phone: '07511 892011',
    email: 'dancarter@me.com',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    photoLocked: false,
    plan: 'annual',
    status: 'active',
    joinedDate: '01 Oct 2026',
    renewalDate: '01 Oct 2027',
    totalCutsThisYear: 3,
    lastCutDate: '9 days ago',
    lastCutShopId: 'queens-road',
  },
];

export const INITIAL_TALLIES: TallyTransaction[] = [
  { id: 't-1', shopId: 'queens-road', paymentType: 'cash', serviceName: 'Skin Fade & Style', amount: 18, timestamp: '09:20' },
  { id: 't-2', shopId: 'queens-road', paymentType: 'card', serviceName: 'Cut & Beard Sculpt', amount: 23, timestamp: '09:55' },
  { id: 't-3', shopId: 'queens-road', paymentType: 'cash', serviceName: "Gentlemen's Cut", amount: 15, timestamp: '10:30' },
  { id: 't-4', shopId: 'queens-road', paymentType: 'cash', serviceName: 'Skin Fade & Style', amount: 18, timestamp: '11:15' },
  { id: 't-5', shopId: 'queens-road', paymentType: 'card', serviceName: "Gentlemen's Cut", amount: 15, timestamp: '11:50' },
  { id: 't-6', shopId: 'silverhill', paymentType: 'cash', serviceName: "Gentlemen's Cut", amount: 15, timestamp: '09:40' },
  { id: 't-7', shopId: 'silverhill', paymentType: 'card', serviceName: 'Skin Fade & Style', amount: 18, timestamp: '10:25' },
];
