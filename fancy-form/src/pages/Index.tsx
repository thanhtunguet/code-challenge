import { SwapForm } from '@/components/swap/SwapForm';

const Index = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="gradient-text">Token Swap</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Exchange tokens instantly at the best rates
          </p>
        </div>

        {/* Swap Form */}
        <SwapForm />
      </div>
    </main>
  );
};

export default Index;
