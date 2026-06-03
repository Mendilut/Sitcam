import { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="grow w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-6 md:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;