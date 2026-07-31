import Navbar from "./Navbar";

// Shared page shell: the slate background + sticky navbar every signed-in
// page wants. New pages wrap their content in this instead of repeating it.
export default function AppLayout({ children, width = "max-w-6xl" }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className={`${width} mx-auto px-4 sm:px-6 py-8 sm:py-10`}>
        {children}
      </main>
    </div>
  );
}
