import type { Metadata } from 'next';
import AccountPageClient from '@/components/account/AccountPage';

export const metadata: Metadata = {
  title: 'My Account',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AccountPage() {
  return <AccountPageClient />;
}
