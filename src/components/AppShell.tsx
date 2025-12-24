"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/layout/Banner";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { Button } from "./ui";

function AppShellContent({ children }: { children: React.ReactNode }) {
    const { isPinned } = useSidebar();
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <div className="flex flex-col h-max md:h-screen overflow-hidden">
            {/* Banner - outside display container */}
            <Banner
                content={
                    <>
                        <span className="mr-2">📸 Helios has just posted a new post on Instagram! Check it out!</span>
                        <Button
                            className="bg-green-700 border-green-500 text-white hover:bg-green-600 hover:border-green-500"
                            onClick={() => {
                                const instagramUrl = "https://www.instagram.com/helios_innov/";
                                const instagramAppUrl = "instagram://user?username=helios_innov";
                                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                                if (isMobile) {
                                    window.location.href = instagramAppUrl;
                                    setTimeout(() => window.open(instagramUrl, "_blank"), 500);
                                } else {
                                    window.open(instagramUrl, "_blank");
                                }
                            }}
                        >
                            Find out more
                        </Button>
                    </>
                }
                dismissible
            />

            {/* Display container - contains header, sidebar, main */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Header - fixed height */}
                <Header noBorder={isHomePage} showMobileMenu={!isHomePage} />

                {/* Content area - sidebar + main */}
                <div className="relative flex-1 flex min-h-0">
                    {/* Sidebar - hidden on mobile, full height on desktop */}
                    {!isHomePage && <Sidebar />}

                    {/* Main space - scrollable */}
                    <main className={`flex-1 overflow-auto bg-background ${!isHomePage && !isPinned ? "md:ml-13" : ""}`}>
                        <div className="min-h-full flex flex-col pb-[env(safe-area-inset-bottom)]">
                            <div className="flex-1">{children}</div>
                            <Footer />
                        </div>
                    </main>
                </div>
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
