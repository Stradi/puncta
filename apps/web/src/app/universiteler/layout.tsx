export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto mt-16 max-w-6xl">{children}</div>;
}
