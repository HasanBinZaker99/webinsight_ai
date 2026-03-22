import "./globals.css";

export const metadata = {
  title: "Website Analyzer",
  description: "Analyze a website using a simple user prompt",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
