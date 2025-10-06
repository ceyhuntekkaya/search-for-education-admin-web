import Link from "next/link";

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="row-start-2 items-center sm:items-start">
                <div className="items-center">
                     LIV ENERJİ<hr/>
                    <Link className="btn btn-secondary" href="/login">LOGIN</Link>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
               LİV ENERJİ © 2025
            </footer>
        </div>
    );
}
