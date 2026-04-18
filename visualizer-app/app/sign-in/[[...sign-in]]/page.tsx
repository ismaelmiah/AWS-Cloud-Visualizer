import { SignIn } from "@clerk/nextjs";

type PageProps = {
  searchParams: Promise<{ redirect_url?: string }>;
};

function safeRedirectPath(raw: string | undefined, fallback: string) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}

export default async function SignInPage({ searchParams }: PageProps) {
  const { redirect_url } = await searchParams;
  const dest = safeRedirectPath(redirect_url, "/preparation");

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-zinc-950 px-4 py-12">
      <SignIn
        forceRedirectUrl={dest}
        appearance={{
          elements: {
            card: "bg-zinc-900 border border-white/10 shadow-xl",
            headerTitle: "text-white",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton: "border-white/10",
            formButtonPrimary: "bg-gradient-to-r from-amber-500 to-orange-600",
          },
        }}
      />
    </div>
  );
}
