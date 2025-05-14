
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBackButton }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileLayout title={title} showBackButton={showBackButton}>
        {children}
      </MobileLayout>
    );
  }

  return (
    <DesktopLayout title={title}>
      {children}
    </DesktopLayout>
  );
};

export default Layout;
