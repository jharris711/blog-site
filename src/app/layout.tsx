import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'J. Harris Web Dev',
  description: 'Blogs about tech and web development',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='antialiased dark:bg-gray-900 dark:text-gray-100'>
          <div className='flex flex-col min-h-screen mb-auto'>
            <Header />
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
