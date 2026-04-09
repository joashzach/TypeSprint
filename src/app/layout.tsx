import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TypeSprint | Clean Protocol',
  description: 'Precision typing environment with strict accuracy requirements.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
