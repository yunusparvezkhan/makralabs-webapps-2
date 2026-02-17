"use client";

import { useEffect, useSyncExternalStore, useRef, useState } from "react";
import { EditorView, minimalSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { highlightActiveLineGutter, lineNumbers } from "@codemirror/view";
import { FiCopy, FiCheck } from "react-icons/fi";
import Image from "next/image";
import Script from "next/script";
import {
    organizationSchema,
    websiteSchema,
    productSchema,
} from "@/lib/structured-data";

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

export default function Home() {
    const editorRef = useRef<HTMLDivElement>(null);
    const isClient = useSyncExternalStore(subscribe, () => true, () => false);
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

            <section className="relative min-h-screen flex items-center justify-center px-4 lg:px-6 py-12 lg:py-0">
                <div className="max-w-[90%] lg:max-w-[80%] w-full flex flex-col lg:flex-row items-start lg:items-stretch justify-center gap-8 lg:gap-50">
                    {/* Left Half - Production Pitch */}
                    <div className="flex flex-col justify-center order-2 lg:order-1">
                        {/* Eyebrow */}
                        <div className="flex items-center gap-3 mb-6 pb-2">
                            <span
                                className="h-px w-8 inline-block"
                                style={{ background: "var(--makra-primary-green)" }}
                            />
                            <span
                                className="text-xs font-semibold uppercase"
                                style={{
                                    color: "var(--makra-primary-green)",
                                    letterSpacing: "0.2em",
                                }}
                            >
                                For AI Developers
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1
                            className="font-bold tracking-tight text-gray-600"
                            style={{
                                fontSize: "3.25rem",
                                lineHeight: 1.08,
                                // color: "var(--makra-foreground-dark)",
                            }}
                        >
                            Save Your Tokens
                            <br />
                            <span style={{ color: "var(--makra-primary-green)" }}>
                                Using Makra
                            </span>
                        </h1>

                        {/*{/* Pain Point + Value Prop */}
                        {/*<div className="mt-6" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                            <p
                                className="font-medium"
                                style={{
                                    fontSize: "1.2rem",
                                    color: "var(--makra-foreground-dark-100)",
                                }}
                            >
                                
                            </p>
                            <p
                                style={{
                                    fontSize: "1.05rem",
                                    color: "var(--makra-foreground-dark-200)",
                                }}
                            >
                                Get the same quality results spending fewer tokens.
                            </p>
                        </div>*/}

                        {/* Accent Divider */}
                        {/*<div
                            className="mt-6 mb-6"
                            style={{
                                width: "3rem",
                                height: "2px",
                                background: "var(--makra-primary-green)",
                                opacity: 0.4,
                            }}
                        />*/}

                        {/* Description */}
                        <p
                            className="leading-relaxed py-2 pt-4"
                            style={{
                                fontSize: "0.95rem",
                                color: "var(--makra-foreground-dark-200)",
                                maxWidth: "28rem",
                            }}
                        >
                            Why dump raw HTML into the context window, when you
                            can get the same quality results with <strong>retrieval</strong>?
                        </p>
                        <p
                            className="leading-relaxed py-2"
                            style={{
                                fontSize: "0.95rem",
                                color: "var(--makra-foreground-dark-200)",
                                maxWidth: "28rem",
                            }}
                        >
                            Makra is a memory layer between the web and your AI
                            agents. We handle the context, so your agents can
                            focus on the data.
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
                                Drop a message to try out the beta: {""}
                            </span>
                            {email && (
                                <span className="inline-flex items-center gap-1.5">
                                    <a
                                        href={`mailto:${email}`}
                                        className="font-medium old-school-link"
                                        style={{ color: "var(--makra-primary-green)" }}
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
                                        title={copied ? "Copied!" : "Copy email"}
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

                    {/* Right Half - Code Block */}
                    {/*<div className="flex-1 flex items-center justify-center">
                        <div
                            className="rounded-lg p-6 shadow-lg"
                            style={{
                                backgroundColor: "var(--makra-background-dark-200)",
                                maxWidth: "600px",
                                maxHeight: "600px",
                                overflow: "hidden",
                            }}
                        >
                            <div ref={editorRef} />
                        </div>
                    </div>*/}

                    {/* Right Half - Diagram */}
                    <div className="flex items-center justify-start lg:justify-center mb-8 lg:mb-0 order-1 lg:order-2">
                        <div
                            style={{
                                overflow: "hidden",
                            }}
                        >
                            <Image
                                src="/images/where-makra-fits.drawio.svg"
                                alt="Where Makra fits in the workflow"
                                width={600}
                                height={400}
                                className="w-[200px] h-auto lg:w-auto lg:h-[400px]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/*<section className="relative min-h-screen flex items-center justify-center px-6 border border-red-500">
                <div className="h-full w-full flex flex-col items-center justify-center">
                    <p>Home Page Section 2</p>
                </div>
            </section>
            <section className="relative min-h-screen flex items-center justify-center px-6 border border-red-500">
                <div className="h-full w-full flex flex-col items-center justify-center">
                    <p>Home Page Section 3</p>
                </div>
            </section>*/}
        </>
    );
}
