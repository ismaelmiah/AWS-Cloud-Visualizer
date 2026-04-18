export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-sans text-sm font-medium text-zinc-300">AWS Visualizer</p>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-zinc-500">
            Independent study tool—not affiliated with or endorsed by Amazon Web Services. AWS and AWS
            service names are trademarks of Amazon.com, Inc. or its affiliates.
          </p>
        </div>
        <p className="max-w-xs text-xs text-zinc-600">
          Service icons use SVGs from the MIT-licensed{" "}
          <a
            href="https://www.npmjs.com/package/aws-icons"
            className="text-zinc-500 underline decoration-zinc-700 underline-offset-2 hover:text-zinc-400"
          >
            aws-icons
          </a>{" "}
          package (architecture-style artwork).
        </p>
      </div>
    </footer>
  );
}
