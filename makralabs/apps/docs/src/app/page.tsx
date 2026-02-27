import Link from "next/link";
import { loadDocsConfig } from "@/lib/docs/config";
import { DocsHeader } from "@/components/docs/DocsHeader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DocsHomePage() {
  const config = await loadDocsConfig();

  return (
    <>
      <DocsHeader config={config} />
      <main className="mx-auto max-w-[1240px] px-5 py-10">
        <div className="docs-card p-8">
          <div className="max-w-[720px]">
            <div className="text-xs font-semibold uppercase tracking-wide text-black/50">{config.site.product ?? "Makra"}</div>
            <h1 className="mt-3 font-[var(--font-cormorant)] text-5xl font-semibold tracking-tight text-black">
              {config.site.title}
            </h1>
            <p className="mt-4 text-base text-black/70">
              {config.site.description ??
                "Build AI applications with reliable memory, retrieval, and tools — without stuffing your model context with raw noise."}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {config.sections.map((section) => {
              const first = section.pages[0];
              return (
                <Link
                  key={section.id}
                  href={`/${first?.slug ?? ""}`}
                  className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="text-sm font-semibold text-black">{section.title}</div>
                  <div className="mt-2 text-sm text-black/70">{first?.description ?? "Open section"}</div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--makra-primary-green)]">
                    Browse docs <span aria-hidden>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
