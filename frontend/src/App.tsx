import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserProfile } from './lib/api';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { CustomerPortalView } from './components/CustomerPortalView';
import { RewardsCatalog } from './components/RewardsCatalog';
import { CouponWallet } from './components/CouponWallet';
import { TransactionHistory } from './components/TransactionHistory';
import { QRModal } from './components/QRModal';
import { POSScannerModal } from './components/POSScannerModal';
import { BirthdayModal } from './components/BirthdayModal';
import { TierBenefitsModal } from './components/TierBenefitsModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { BottomNav } from './components/BottomNav';
import type { UserProfile } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 2,
    },
  },
});

function LoyaltyAppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('lh_user_id') || 'usr_admin_001';
  });
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isPOSModalOpen, setIsPOSModalOpen] = useState<boolean>(false);
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState<boolean>(false);
  const [isTierModalOpen, setIsTierModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const { data: user } = useUserProfile(currentUserId);

  const handleSelectUser = (selectedUser: UserProfile) => {
    setCurrentUserId(selectedUser.id);
    localStorage.setItem('lh_user_id', selectedUser.id);
    if (selectedUser.role === 'Admin') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('customer_app');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-gray-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Web Sidebar Navigation (Desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenPOSModal={() => setIsPOSModalOpen(true)}
      />

      {/* Main SaaS Dashboard Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Top Navbar */}
        <TopNavbar
          user={user}
          activeTab={activeTab}
          onOpenPOSModal={() => setIsPOSModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Dynamic Content Views */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {(activeTab === 'dashboard' || activeTab === 'crm' || activeTab === 'admin') && <AdminDashboard />}
          {activeTab === 'customer_app' && (
            <CustomerPortalView
              user={user}
              onOpenQRModal={() => setIsQRModalOpen(true)}
              onOpenBirthdayModal={() => setIsBirthdayModalOpen(true)}
              onOpenTierModal={() => setIsTierModalOpen(true)}
            />
          )}
          {activeTab === 'rewards' && <RewardsCatalog user={user} />}
          {activeTab === 'coupons' && <CouponWallet userId={user?.id} />}
          {activeTab === 'history' && <TransactionHistory userId={user?.id} />}
        </main>
      </div>

      {/* Interactive Modals */}
      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
      <POSScannerModal isOpen={isPOSModalOpen} onClose={() => setIsPOSModalOpen(false)} />
      <BirthdayModal isOpen={isBirthdayModalOpen} onClose={() => setIsBirthdayModalOpen(false)} />
      <TierBenefitsModal
        isOpen={isTierModalOpen}
        onClose={() => setIsTierModalOpen(false)}
        currentTier={user?.tier}
        lifetimePoints={user?.lifetimePoints}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectUser={handleSelectUser}
        currentUser={user}
      />

      {/* Bottom Navigation for Mobile / Tablet Viewports */}
      <div className="lg:hidden">
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={user?.role === 'Admin'}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoyaltyAppContent />
    </QueryClientProvider>
  );
}
