import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata = {
  title: 'AttributionIQ - Omnichannel Intelligence Engine',
  description: 'Enterprise Multi-Touch Attribution & Marketing Database Analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#E8F5EE] selection:text-[#0D5C3A]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
