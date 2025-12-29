"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/layout/Banner";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { Button } from "./ui";
import Snowfall from "react-snowfall";

function AppShellContent({ children }: { children: React.ReactNode }) {
    const { isPinned } = useSidebar();
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <div className="flex flex-col min-h-screen md:h-screen md:overflow-hidden">
            {/* Banner - outside display container */}
            {/* <Banner
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
            /> */}

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
                    <div
                        className="absolute inset-0 pointer-events-none z-50 transition-all duration-300"
                        style={{
                            top: 'env(safe-area-inset-top)',
                            bottom: 'env(safe-area-inset-bottom)',
                            maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
                        }}
                    >
                        <Snowfall
                            color="white"
                            snowflakeCount={30}
                            speed={[1.5, 2.5]}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </div>
                    {/* Sidebar - hidden on mobile, full height on desktop */}
                    {!isHomePage && <Sidebar />}

                    {/* Main space - scrollable */}
                    <main className={`flex-1 md:overflow-auto bg-background ${!isHomePage && !isPinned ? "md:ml-13" : ""}`}>
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
