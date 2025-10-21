import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface MerchantLayoutProps {
  children: ReactNode;
}

export default function MerchantLayout({ children }: MerchantLayoutProps) {
  return <>{children}</>;
}
