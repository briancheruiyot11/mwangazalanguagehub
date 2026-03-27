import "../app/globals.css";

export const metadata = {
  title: "Kenyan Language LMS",
  description: "Learning platform for Kenyan languages",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}