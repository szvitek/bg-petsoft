import Image from 'next/image';
import preview from '../../../public/petsoft-preview.png';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-[#5dc9a8] min-h-screen flex flex-col xl:flex-row items-center justify-center gap-10">
      <Image src={preview} alt="Preview of PetSoft" />
      <div>
        <Logo />
        <h1 className="text-5xl font-semibold my-6 max-w-[500px]">
          Manage your <span className="font-extrabold">pet daycare</span> with
          ease
        </h1>
        <p className="text-2xl font-medium max-w-[600px]">
          Use PetSoft to easily keep track of your pets under your daycare. Get
          lifetime access for $299.
        </p>
        <div className="mt-10 space-x-3">
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
