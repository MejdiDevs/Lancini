import Navbar from '@/components/layout/Navbar';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main className="min-h-[calc(100vh-64px)]">{children}</main>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                <div className="container-custom">
                    © {new Date().getFullYear()} ENET'Com Forum. All rights reserved.
                </div>
            </footer>
        </>
    );
}
