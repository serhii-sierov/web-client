import { signOutAction } from '@/actions/signOut';
import { Button } from '@/components/ui/button';

const SignOutButton: React.FC<React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>> = ({
  children,
  ...restProps
}) => {
  return (
    <form action={signOutAction}>
      <Button {...restProps} type='submit' variant='outline'>
        {children}
      </Button>
    </form>
  );
};

export default SignOutButton;
