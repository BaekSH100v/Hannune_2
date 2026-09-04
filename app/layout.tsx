import './globals.css';

export const metadata = {
  title: 'Hannune 제설관제시스템',
  description: '실시간 제설 차량 GPS 원격 모니터링 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased m-0 p-0 overflow-hidden bg-slate-950">
        {children}
      </body>
    </html>
  );
}