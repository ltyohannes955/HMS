import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-hms-blue-900 via-background to-hms-teal-700 p-8">
            <div className="animate-fade-in text-center space-y-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
                    🏥 Hospital Management System
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-foreground">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-hms-blue-500 to-hms-teal-500 bg-clip-text text-transparent">
                        HMS
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    A modern, scalable hospital management platform built with Next.js,
                    NestJS, and PostgreSQL.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                        href="/dashboard"
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/auth/login"
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </main>
    );
}
