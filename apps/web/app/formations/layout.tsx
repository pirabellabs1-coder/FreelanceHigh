import { FormationsHeader } from "@/components/formations/FormationsHeader";
import { FormationsFooter } from "@/components/formations/FormationsFooter";
import { PixelTrackerLoader } from "@/components/formations/PixelTrackerLoader";

export default function FormationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <FormationsHeader />
      <main className="flex-1">{children}</main>
      <FormationsFooter />
      <PixelTrackerLoader />
    </div>
  );
}
