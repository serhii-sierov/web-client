'use client';

import { signIn } from 'next-auth/react';

interface H extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SignInButton: React.FC<React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>> = ({
  children,
  ...restProps
}) => {
  const signInHandler = async () => {
    const user = await signIn('google');
    console.log({ user });
  };

  return (
    <button {...restProps} onClick={signInHandler}>
      {children}
    </button>
  );
};

export default SignInButton;
