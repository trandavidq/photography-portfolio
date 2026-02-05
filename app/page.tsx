import Navigation from './components/Navigation';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-black">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                Photography Portfolio
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Capturing moments from around the world. Explore my collection of
                galleries showcasing landscapes, urban photography, and travel
                experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Galleries Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-12">
              Galleries
            </h2>

            {/* Placeholder for galleries */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                      <span className="text-sm">Gallery {i}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                    Gallery Title
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                    Location, 2025
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
