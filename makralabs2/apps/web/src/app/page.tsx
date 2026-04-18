"use client";

import { useEffect, useSyncExternalStore, useRef, useState } from "react";
import { EditorView, minimalSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { highlightActiveLineGutter, lineNumbers } from "@codemirror/view";
import { FiCopy, FiCheck } from "react-icons/fi";
import Script from "next/script";
import {
    organizationSchema,
    websiteSchema,
    productSchema,
} from "@/lib/structured-data";
import dynamic from "next/dynamic";

// Import BarHorizontal dynamically to avoid SSR issues (since it may use window)
const BarHorizontal = dynamic(
    () =>
        import("@/components/charts/BarHorizontal").then((mod) => mod.default),
    { ssr: false },
);

const subscribe = () => () => {};

const codeString = `from makra import Makra

makra = Makra(api_key="makra-api-key")

# retrieve exactly what data you're looking need
repos_data = await makra.extract(
    urls=["https://www.github.com/ritsource"],
    schema={
        "repositories": [
            {
                "link": "link to the repo",
                "language": "primary language used",
                "stars": "number of stars",
                "forks": "number of forks"
            }
        ]
    },
)
`;

const chartData = [
    {
        primaryLabel: "Makra",
        secondaryLabel: "1.2k",
        value: 1224,
        bgColor: "#99d98c",
    },
    {
        primaryLabel: "RAG",
        secondaryLabel: "2.1k",
        value: 2145,
        bgColor: "#F9F6C4",
    },
    {
        primaryLabel: "Page-index",
        secondaryLabel: "2.2k",
        value: 2224,
        bgColor: "#90caf9",
    },
    {
        primaryLabel: "Long-context LLMs",
        secondaryLabel: "5.1k",
        value: 5164,
        bgColor: "#ffbc85",
    },
];

export default function Home() {
    const editorRef = useRef<HTMLDivElement>(null);
    const isClient = useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );
    const email = isClient ? ["ping", "makralabs.org"].join("@") : null;
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!editorRef.current) return;

        const state = EditorState.create({
            doc: codeString,
            extensions: [
                minimalSetup,
                lineNumbers(),
                highlightActiveLineGutter(),
                python(),
                oneDark,
                EditorView.editable.of(false),
                EditorView.theme({
                    "&": {
                        backgroundColor: "transparent !important",
                        maxHeight: "600px",
                        maxWidth: "600px",
                    },
                    ".cm-scroller": {
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.875rem",
                        overflow: "auto",
                    },
                    ".cm-gutters": {
                        backgroundColor: "transparent",
                        border: "none",
                    },
                }),
            ],
        });

        const view = new EditorView({
            state,
            parent: editorRef.current,
        });

        return () => {
            view.destroy();
        };
    }, []);

    const handleCopy = async () => {
        if (!email) return;
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Structured Data for SEO */}
            <Script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <Script
                id="website-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema),
                }}
            />
            <Script
                id="product-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productSchema),
                }}
            />

            <section
                id="about"
                className="home-hero-section relative min-h-screen flex items-center justify-center bg-white py-12 lg:py-0"
            >
                <div className="home-hero-layout makra-page-width flex w-full flex-col items-start justify-center gap-8 lg:flex-row lg:items-stretch xl:gap-20">
                    {/* Left Half - Production Pitch */}
                    <div className="home-hero-copy flex flex-col justify-center order-2 lg:order-1">
                        {/* Eyebrow */}
                        <div className="flex items-center gap-3 mb-0 pb-0">
                            <span
                                className="h-px w-8 inline-block"
                                style={{
                                    background: "var(--makra-primary-green)",
                                }}
                            />
                            <span
                                className="text-xs font-semibold uppercase"
                                style={{
                                    color: "var(--makra-primary-green)",
                                    letterSpacing: "0.2em",
                                }}
                            >
                                Makra
                            </span>
                        </div>

                        <h1
                            className="home-hero-headline font-bold tracking-tight text-gray-600"
                        >
                            <span className="home-hero-headline__line">
                                The Web, Memoized
                            </span>
                            <span
                                className="home-hero-headline__line"
                                style={{ color: "var(--makra-primary-green)" }}
                            >
                                For Your AI Agents
                            </span>
                            {/* <span
                                style={{
                                    color: "var(--makra-primary-greens)",
                                    fontSize: 21,
                                    paddingLeft: 1,
                                }}
                            >
                                A&nbsp;Framework&nbsp;for&nbsp;building&nbsp;
                                <span
                                    className="hover:underline cursor-pointer"
                                    style={{
                                        color: "var(--makra-primary-green)",
                                    }}
                                >
                                    Internet&nbsp;Native&nbsp;AI&nbsp;Agents
                                </span>{" "}
                            </span> */}
                            {/*<span
                                style={{
                                    color: "var(--makra-primary-greens)",
                                    fontSize: 23.5,
                                }}
                            >
                                AI Agents, that are truely <span style={{ color: "var(--makra-primary-greens)" }}>Internet Native</span>
                            </span>*/}
                        </h1>

                        <p
                            className="leading-relaxed py-2 pt-4"
                            style={{
                                fontSize: "0.95rem",
                                color: "var(--makra-foreground-dark-200)",
                                maxWidth: "31rem",
                                marginTop: "5px",
                                // border: "1px solid red",
                            }}
                        >
                            We serve the web as <strong>structured-data</strong>,
                            at a the cost of running an embeddings model.
                        </p>
                        <p
                            id="contact"
                            className="leading-relaxed py-2"
                            style={{
                                fontSize: "0.95rem",
                                color: "var(--makra-foreground-dark-200)",
                                maxWidth: "28rem",
                            }}
                        >
                            We handle the context, so your agents can{" "}
                            <strong>focus on the data</strong>.
                        </p>
                        <p
                            className="leading-relaxed py-2"
                            style={{
                                fontSize: "0.95rem",
                                color: "var(--makra-foreground-dark-200)",
                                maxWidth: "28rem",
                            }}
                        >
                            <span>
                                Drop a message to <strong>try out the beta</strong>:{" "}
                            </span>
                            {email && (
                                <span className="inline-flex items-center gap-1.5">
                                    <a
                                        href={`mailto:${email}`}
                                        className="font-medium old-school-link"
                                        style={{
                                            color: "var(--makra-primary-green)",
                                        }}
                                    >
                                        {email}
                                    </a>
                                    <button
                                        onClick={handleCopy}
                                        className="p-1 rounded cursor-pointer"
                                        style={{
                                            color: copied
                                                ? "var(--makra-primary-green)"
                                                : "var(--makra-foreground-dark-200)",
                                            transition: "color 0.2s",
                                        }}
                                        title={
                                            copied ? "Copied!" : "Copy email"
                                        }
                                    >
                                        {copied ? (
                                            <FiCheck size={14} />
                                        ) : (
                                            <FiCopy size={14} />
                                        )}
                                    </button>
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Right Half - Chart replaces SVG diagram */}
                    <div className="home-hero-chart flex items-center justify-start lg:justify-center mb-8 lg:mb-0 order-1 lg:order-2">
                        <div className="home-hero-chart__inner flex h-auto w-full max-w-[720px] items-center justify-center">
                            <BarHorizontal
                                data={chartData}
                                title="Comparing How You Retrieve Data"
                                xAxisLabel="avg. input tokens consumed (our initial benchmarks)"
                                yAxisLabel=""
                                width={900}
                                height={550}
                                hideValueLabels
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
