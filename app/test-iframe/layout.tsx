export const metadata = {
  title: "Signup Modal",
  description: "Customizable signup modal",
};

export default function IframeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-transparent m-0 p-0 min-h-screen">{children}</body>
    </html>
  );
}
