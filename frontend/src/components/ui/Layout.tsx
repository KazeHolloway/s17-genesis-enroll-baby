export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-login min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-xl min-h-225 backdrop-blur-sm flex flex-col justify-center items-center gap-8 p-8 md:p-12 rounded-2xl shadow-xl border border-primary/10">
        {children}
      </div>
    </section>
  );
}
