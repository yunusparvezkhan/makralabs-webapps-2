import Link from "next/link";
import { getSectionFirstPage, loadDocsConfig } from "@/lib/docs/config";
import { DocsHeader } from "@/components/docs/DocsHeader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DocsHomePage() {
  const config = await loadDocsConfig();

  return (
    <>
      <DocsHeader config={config} />
      <main className="mx-auto max-w-[1240px] px-5 py-10">
        <div className="max-w-[780px]">
          <div className="text-xs font-semibold uppercase tracking-wide text-black/50">{config.site.product ?? "Makra"}</div>
          <h1 className="mt-3 font-[var(--font-cormorant)] text-5xl font-semibold tracking-tight text-black">{config.site.title}</h1>
          <p className="mt-4 text-base text-black/70">
            {config.site.description ??
              "Build AI applications with reliable memory, retrieval, and tools — without stuffing your model context with raw noise."}
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {config.sections.map((section) => {
              const first = getSectionFirstPage(section);
              return (
                <Link key={section.id} href={`/${first?.slug ?? ""}`} className="rounded-md px-1 py-1 text-sm">
                  <span className="font-semibold text-black">{section.title}</span>
                  <span className="ml-2 text-black/60">{first?.description ?? "Open section"}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
