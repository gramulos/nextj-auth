import { useRouter } from 'next/router';

export default function Error() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-red-600 mb-4">
          {error || 'An error occurred during authentication'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
