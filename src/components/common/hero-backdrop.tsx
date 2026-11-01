export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute -right-32 -top-40 size-[34rem] rounded-full bg-violet-600/25 blur-3xl" />
      <div className="absolute -bottom-48 -left-32 size-[28rem] rounded-full bg-indigo-500/15 blur-3xl" />
    </div>
  )
}
