import { useSession, signIn, signOut } from 'next-auth/react';

function AuthContent() {
  const { data: session, status, ...rest } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Welcome!</h1>
        <p>Signed in as {session.user?.email}</p>
        <pre className="text-xs max-w-4xl break-all">
          {JSON.stringify({ ...session, ...rest, status }, null, 2)}
        </pre>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Welcome to the App</h1>
      <p>Please sign in to continue</p>
      <button
        onClick={() => signIn('azure-ad-b2c')}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Sign in with Azure AD B2C
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <AuthContent />
      </main>
    </div>
  );
}
