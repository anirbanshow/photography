export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="page-transition" aria-hidden="true" />
    </>
  );
}
