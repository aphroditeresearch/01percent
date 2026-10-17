import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="label-caps text-muted">404</p>
      <h1 className="heading-display text-5xl">Page not found</h1>
      <p className="max-w-sm text-muted">
        This page doesn&rsquo;t exist, or isn&rsquo;t part of this membership.
      </p>
      <Link href="/" className="label-caps underline underline-offset-4">
        Go home
      </Link>
    </main>
  );
}
