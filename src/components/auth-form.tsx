import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { login, register } from '@/lib/auth';
import { useAuth } from '@/contexts/auth-context';

const loginSchema = z.object({
  email: z.string().email({ message: 'Неверный формат email' }),
  password: z
    .string()
    .min(6, { message: 'Пароль должен содержать больше 6 символов' })
    .max(20, { message: 'Пароль должен содержать меньше 20 символов' }),
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: z
      .string()
      .min(6, { message: 'Пароль должен содержать больше 6 символов' })
      .max(20, { message: 'Пароль должен содержать меньше 20 символов' }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
      });
    }
  });

const formVariants = {
  enter: {
    x: 300,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -300,
    opacity: 0,
  },
};

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { setAuth } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    mode: 'onChange',
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    form.reset();
  }, [form, isLogin]);

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      if (isLogin) {
        return login({ email: data.email, password: data.password });
      }
      return register({ email: data.email, password: data.password });
    },
    onSuccess: (response) => {
      setAuth(response.token, response.user);
      toast({
        title: 'Готово!',
        description: isLogin ? 'С возвращением!' : 'Аккаунт создан',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(data: z.infer<typeof registerSchema>) {
    mutation.mutate(data);
  }

  return (
    <div className='w-full max-w-md space-y-6 p-8 bg-card rounded-xl shadow-lg border border-border relative overflow-hidden'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={isLogin ? 'login' : 'register'}
          variants={formVariants}
          initial='enter'
          animate='center'
          exit='exit'
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          <div className='space-y-2 text-center'>
            <h1 className='text-3xl font-bold tracking-tight'>
              {isLogin ? 'Войти' : 'Создать аккаунт'}
            </h1>
            <p className='text-muted-foreground'>
              {isLogin
                ? 'Введите свои учетные данные для доступа к вашей учетной записи'
                : 'Введите свои данные для создания учетной записи'}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='user@example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='••••••' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isLogin && (
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Подтвердите пароль</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='••••••'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type='submit'
                className='w-full'
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {isLogin ? 'Войти в систему' : 'Зарегистрироваться'}
              </Button>
            </form>
          </Form>

          <div className='text-center'>
            <Button
              variant='link'
              onClick={() => setIsLogin(!isLogin)}
              className='text-sm'
            >
              {isLogin
                ? 'Нет аккаунта? Зарегистрироваться'
                : 'Есть аккаунт? Войти'}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
