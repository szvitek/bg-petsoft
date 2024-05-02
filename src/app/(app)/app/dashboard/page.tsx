import Branding from "@/components/branding";
import H1 from "@/components/h1";
import Stats from "@/components/stats";

type Props = {};
export default function Page({}: Props) {
  return (
    <main>
      <div className="flex justify-between items-center text-white py-8">
        <Branding />
        <Stats />
      </div>
      Dashboard Page
    </main>
  );
}
