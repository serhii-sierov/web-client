'use client';

import signInAction from '@/actions/signIn';
import signInGoogleAction from '@/actions/signInGoogle';
import { LoginForm } from '@/src/components/LoginForm';

const LoginPage = () => {
  return (
    <div className='container mx-auto py-12'>
      <div className='p-6 rounded-lg shadow-lg'>
        <LoginForm
          onSubmit={async (values) => {
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('password', values.password);
            await signInAction(formData);
          }}
          onGoogleSignIn={async () => {
            await signInGoogleAction();
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
