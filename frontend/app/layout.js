
import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: 'Todo App',
  description: 'Simple Todo App with Next.js and Bootstrap',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
