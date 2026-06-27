import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import { getUser } from '@/actions/auth';

export const metadata: Metadata = {
  title: 'EduPortal',
  description: 'Teacher and Student Portal',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <html lang="en">
      <body>
        <Navigation userRole={user?.role} userName={user?.name} />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
