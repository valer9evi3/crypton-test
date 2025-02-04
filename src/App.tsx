import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';
import { AuthForm } from '@/components/auth-form';
import { Profile } from '@/components/profile';
import { ThemeToggle } from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AuthenticatedApp() {
  const { token } = useAuth();

  console.log({ token });

  return (
    <div className='min-w-full min-h-screen flex items-center justify-center p-4 bg-background'>
      <ThemeToggle />
      {token ? <Profile /> : <AuthForm />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AuthenticatedApp />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
