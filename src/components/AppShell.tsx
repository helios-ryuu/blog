"use client";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

function AppShellContent({ children }: { children: React.ReactNode }) {
    const { isPinned } = useSidebar();

    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <Header />
            <div className="relative flex flex-1 overflow-hidden">
                <Sidebar />
                {/* Main content - no margin on mobile, margin on desktop when sidebar not pinned */}
                <main className={`flex-1 overflow-auto transition-all duration-200 ease-out ml-0 ${isPinned ? "md:ml-0" : "md:ml-14"}`}>
                    {children}
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
