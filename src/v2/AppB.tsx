import { useEffect, useState } from 'react';
import { KINGS_BRAND } from '../config/brand';
import { SubscriptionPlan } from '../data/mockData';
import { useDemoStore } from './useDemoStore';
import { PublicSite } from './PublicSite';
import { SignIn, Join, MemberHome } from './MemberSide';
import { StaffLogin, StaffApp } from './StaffSide';

/**
 * Design B routing (hash-based so it works on any static host):
 *   #/            public website (Sign in / Join in the header)
 *   #/signin      member login
 *   #/join        sign-up flow
 *   #/pass        member's pass (requires member session)
 *   #/staff       staff PIN login → staff app (completely separate from members)
 */
type Route = 'home' | 'signin' | 'join' | 'pass' | 'staff';

const readRoute = (): Route => {
  const h = window.location.hash.replace(/^#\/?/, '');
  return (['signin', 'join', 'pass', 'staff'] as Route[]).includes(h as Route) ? (h as Route) : 'home';
};

export default function AppB() {
  const store = useDemoStore();
  const [route, setRoute] = useState<Route>(readRoute);
  const [plan, setPlan] = useState<SubscriptionPlan>('annual');
  const [memberId, setMemberId] = useState<string | null>(() => sessionStorage.getItem('kingsB_member'));
  const [staffShop, setStaffShop] = useState<string | null>(() => sessionStorage.getItem('kingsB_staff'));
  const [justJoined, setJustJoined] = useState(false);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const go = (r: Route) => {
    window.location.hash = r === 'home' ? '/' : `/${r}`;
  };

  const signInMember = (id: string) => {
    sessionStorage.setItem('kingsB_member', id);
    setMemberId(id);
    go('pass');
  };

  const signOutMember = () => {
    sessionStorage.removeItem('kingsB_member');
    setMemberId(null);
    setJustJoined(false);
    go('home');
  };

  const member = memberId ? store.members.find((m) => m.id === memberId) : undefined;

  switch (route) {
    case 'signin':
      return <SignIn brand={KINGS_BRAND} members={store.members} onBack={() => go('home')} onSignedIn={signInMember} onJoin={() => go('join')} />;

    case 'join':
      return (
        <Join
          brand={KINGS_BRAND}
          initialPlan={plan}
          onBack={() => go('home')}
          onComplete={(m) => {
            store.addMember(m);
            setJustJoined(true);
            signInMember(m.id);
          }}
        />
      );

    case 'pass':
      if (!member) {
        return <SignIn brand={KINGS_BRAND} members={store.members} onBack={() => go('home')} onSignedIn={signInMember} onJoin={() => go('join')} />;
      }
      return (
        <MemberHome
          brand={KINGS_BRAND}
          member={member}
          isNew={justJoined}
          onSignOut={signOutMember}
          onSwitchPlan={() => store.updateMember(member.id, { plan: 'annual', memberCode: member.memberCode.replace('MTH', 'VIP') })}
          onFixPayment={() => store.updateMember(member.id, { status: 'active' })}
        />
      );

    case 'staff':
      if (!staffShop) {
        return (
          <StaffLogin
            brand={KINGS_BRAND}
            onBack={() => go('home')}
            onSuccess={(shopId) => {
              sessionStorage.setItem('kingsB_staff', shopId);
              setStaffShop(shopId);
            }}
          />
        );
      }
      return (
        <StaffApp
          brand={KINGS_BRAND}
          store={store}
          shopId={staffShop}
          onShopChange={(id) => {
            sessionStorage.setItem('kingsB_staff', id);
            setStaffShop(id);
          }}
          onSignOut={() => {
            sessionStorage.removeItem('kingsB_staff');
            setStaffShop(null);
          }}
        />
      );

    default:
      return (
        <PublicSite
          brand={KINGS_BRAND}
          onSignIn={() => (member ? go('pass') : go('signin'))}
          onJoin={(p) => {
            setPlan(p);
            go('join');
          }}
          onStaff={() => go('staff')}
        />
      );
  }
}
