import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SignIn() {
  const router = useRouter();
  const { callbackUrl } = router.query;

  useEffect(() => {
    signIn('azure-ad-b2c', {
      callbackUrl: typeof callbackUrl === 'string' ? callbackUrl : '/',
    });
  }, [callbackUrl]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Signing in...</h1>
        <p>Please wait while we redirect you to the login page.</p>
      </div>
    </div>
  );
}
