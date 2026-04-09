export function GridBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(6,182,212,.2),transparent_32%),radial-gradient(circle_at_86%_14%,rgba(59,130,246,.18),transparent_28%),radial-gradient(circle_at_70%_78%,rgba(16,185,129,.12),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]" />
    </>
  );
}
