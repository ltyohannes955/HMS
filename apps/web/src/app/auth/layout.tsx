import React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            {/* Left side - Visual/Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-hms-blue-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-hms-blue-700/50 to-hms-teal-900/80 z-10" />

                {/* Abstract background pattern */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-hms-blue-400 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-hms-teal-400 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse delay-700" />
                </div>

                <div className="relative z-20 flex flex-col items-center justify-center w-full p-12 text-white">
                    <div className="max-w-md text-center space-y-6">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-4 shadow-2xl mx-auto">
                            <span className="text-3xl">🏥</span>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight">Modern Healthcare Management</h2>
                        <p className="text-xl text-blue-100/80 leading-relaxed">
                            Streamlining hospital operations with cutting-edge technology and intuitive interfaces.
                        </p>
                    </div>
                </div>

                {/* Glassy Stats or Info at the bottom */}
                <div className="absolute bottom-12 left-12 right-12 z-20">
                    <div className="glass p-6 rounded-2xl flex justify-between items-center">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-10 w-10 rounded-full border-2 border-white/20 bg-blue-400 flex items-center justify-center text-[10px] overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-white/90">
                            Trusted by 10,000+ medical professionals
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Forms */}
            <main className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative overflow-hidden bg-background">
                <div className="w-full max-w-sm space-y-8 animate-fade-in relative z-10">
                    {children}
                </div>

                {/* Decorative elements for mobile/tablet */}
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[60px] lg:hidden" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-hms-teal-500/5 rounded-full blur-[50px] lg:hidden" />
            </main>
        </div>
    );
}
