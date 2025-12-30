"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/layout/Banner";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { Button } from "./ui";
import SnowEffect from "@/components/effects/SnowEffect";

function AppShellContent({ children }: { children: React.ReactNode }) {
    const { isPinned } = useSidebar();
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    const isPostPage = pathname.startsWith("/post/");

    return (
        <div className="flex flex-col min-h-screen md:h-screen md:overflow-hidden">


            <Banner
                content={
                    <>
                        <span className="mr-2">Check out Helios Christmas post on Instagram. Merry Christmas and Happy New Year! 🎄❄️🎅</span>
                        <Button
                            className="bg-green-700 border-green-500 text-white hover:bg-green-600 hover:border-green-500 md:mt-0 mt-1"
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
            <div className="flex-1 flex flex-col md:min-h-0">
                {/* Header - fixed height */}
                <Header noBorder={isHomePage} showMobileMenu={!isHomePage} />

                {/* Content area - sidebar + main */}
                <div className="relative flex-1 flex md:min-h-0">
                    <SnowEffect />
                    {/* Sidebar - hidden on mobile, full height on desktop */}
                    {!isHomePage && <Sidebar />}

                    {/* Main space - scrollable */}
                    <main className={`flex-1 overflow-auto bg-background ${!isHomePage && !isPinned ? "md:ml-13" : ""} ${isPostPage ? "lg:overflow-hidden" : ""}`}>
                        <div className={`${isPostPage ? "h-full" : "min-h-full"} flex flex-col ${!isPostPage ? "pb-[env(safe-area-inset-bottom)]" : ""}`}>
                            <div className="flex-1 min-h-0">{children}</div>
                            {isHomePage && <Footer />}
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
