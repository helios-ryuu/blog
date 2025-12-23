"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { Button } from "./ui";

function AppShellContent({ children }: { children: React.ReactNode }) {
    const { isPinned } = useSidebar();
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <div className="flex min-h-dvh h-dvh flex-col overflow-hidden">
            <Header
                noBorder={isHomePage}
                showMobileMenu={!isHomePage}
                banner={{
                    content: <><span className="mr-4">📸 Helios has just posted a new post on Instagram! Check it out!</span><Button className="bg-green-700 border-green-500 text-white hover:bg-green-600 hover:border-green-500" onClick={() => {
                        // Try Instagram app first, fallback to web
                        const instagramUrl = "https://www.instagram.com/helios_innov/";
                        const instagramAppUrl = "instagram://user?username=helios_innov";

                        // Check if on mobile
                        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                        if (isMobile) {
                            window.location.href = instagramAppUrl;
                            // Fallback to web after short delay if app doesn't open
                            setTimeout(() => window.open(instagramUrl, "_blank"), 500);
                        } else {
                            window.open(instagramUrl, "_blank");
                        }
                    }}>Find out more</Button></>,
                    dismissible: true
                }}
            />
            <div className="relative flex flex-1 overflow-hidden">
                {!isHomePage && <Sidebar />}
                {/* Main content - no margin on mobile, margin on desktop when sidebar not pinned */}
                <main className={`flex-1 overflow-auto bg-background transition-[margin,background-color] duration-200 ease-out ml-0 ${!isHomePage && !isPinned ? "md:ml-13" : ""}`}>
                    <div className="min-h-full flex flex-col">
                        <div className="flex-1">{children}</div>
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppShellContent>{children}</AppShellContent>
        </SidebarProvider>
    );
}
