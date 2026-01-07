import Landing from "@/components/landing/landing";
import Navbar from "@/components/navigation/navbar";

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <Landing />
    </div>
  );
}
