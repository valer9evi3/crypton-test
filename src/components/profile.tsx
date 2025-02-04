import { LogOut, Mail, KeyRound } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth-context';
import { getProfile } from '@/lib/auth';

export function Profile() {
  const { token, logout } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(token!),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <Skeleton className='h-12 w-12 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[200px]' />
              <Skeleton className='h-4 w-[150px]' />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-2xl font-bold'>Профиль</CardTitle>
        <Button variant='ghost' size='icon' onClick={logout}>
          <LogOut className='h-5 w-5' />
        </Button>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Alert>
          <Mail />
          <AlertTitle>Ваш e-mail</AlertTitle>
          <AlertDescription>{user.email}</AlertDescription>
        </Alert>
        <Alert>
          <KeyRound />
          <AlertTitle>Ваш ID</AlertTitle>
          <AlertDescription>{user.id}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
