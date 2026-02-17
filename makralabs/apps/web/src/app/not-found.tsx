import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6">
            <div className="max-w-7xl mx-auto text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <Image
                        src="/logo/192x192.png"
                        alt="Makra Labs Logo"
                        width={64}
                        height={64}
                        className="w-16 h-16"
                    />
                    <h1
                        className="text-5xl font-bold tracking-tight"
                        style={{
                            fontFamily: "var(--font-cormorant)",
                            color: "var(--makra-foreground-dark)",
                        }}
                    >
                        Makra Labs
                    </h1>
                </div>
                <p
                    className="text-xl mb-2"
                    style={{
                        color: "var(--makra-foreground-dark-100)",
                    }}
                >
                    Page Not Found
                </p>
                <p
                    className="text-base mb-6"
                    style={{
                        color: "var(--makra-foreground-dark-200)",
                    }}
                >
                    The page you&apos;re looking for doesn&apos;t exist. Go back to
                    {" "}
                    <Link href="/">
                        Home
                    </Link>
                </p>

            </div>
        </section>
    );
}
