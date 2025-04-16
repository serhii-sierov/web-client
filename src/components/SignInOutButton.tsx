import { signOutAction } from '@/actions/signOut';

const SignOutButton: React.FC<React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>> = ({
  children,
  ...restProps
}) => {
  return (
    <form action={signOutAction}>
      <button {...restProps} type='submit'>
        {children}
      </button>
    </form>
  );
};

export default SignOutButton;
