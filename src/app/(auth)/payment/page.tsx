'use client';
import { createCheckoutSession } from '@/actions/actions';
import H1 from '@/components/h1';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransition] = useTransition();
  const { update, status, data: session } = useSession();
  const router = useRouter();

  // ? maybe a useEffect would be better to redirect the user after successful payment

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>

      {searchParams.success && (
        <Button
          onClick={async () => {
            await update();
            router.push('/app/dashboard');
          }}
          disabled={status === 'loading' || session?.user.hasAccess}
        >
          Access PetSoft
        </Button>
      )}

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession();
            });
          }}
        >
          Buy lifetime access for £299
        </Button>
      )}

      {searchParams.success && (
        <p className="text-sm text-green-500">
          Payment successful! You now have lifetime access to PetSoft.
        </p>
      )}
      {searchParams.canceled && (
        <p className="text-sm text-red-500">
          Payment canceled! You can try again.
        </p>
      )}
    </main>
  );
}
