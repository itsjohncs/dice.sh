import type {Metadata} from "next";
import {Source_Code_Pro} from "next/font/google";
import "./globals.css";

const font = Source_Code_Pro({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "dice.sh",
    description: "Roll dice in the terminal!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={font.className}>{children}</body>
        </html>
    );
}
