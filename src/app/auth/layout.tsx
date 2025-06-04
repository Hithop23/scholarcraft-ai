export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout can be minimal, or include specific branding for auth pages
  return <main>{children}</main>;
}
