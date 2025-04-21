'use client';

import { useForm } from 'react-hook-form';

import { Button } from '@/src/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
}

export const LoginForm = ({ onSubmit, onGoogleSignIn }: LoginFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4'>
      <div className='w-full max-w-md rounded-lg shadow-lg p-8 space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
          <p className='text-sm text-muted-foreground'>Enter your credentials to access your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Enter your email'
                        className='w-full px-3 py-2 transition-colors border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Enter your password'
                        className='w-full px-3 py-2 transition-colors border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex flex-col gap-3'>
              <Button
                variant='secondary'
                type='submit'
                className='w-full py-2.5 font-medium transition-colors duration-150'
              >
                Sign In
              </Button>
              <div className='relative py-2'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-border' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
                </div>
              </div>
              <Button
                type='button'
                variant='outline'
                className='w-full py-2.5 font-medium border transition-all duration-150 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 flex items-center justify-center gap-2'
                onClick={() => onGoogleSignIn()}
              >
                <Image
                  src='/icons/google.svg'
                  alt='Google'
                  width={20}
                  height={20}
                  className='h-5 w-5 transition-transform group-hover:scale-110'
                />
                Sign In with Google
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
