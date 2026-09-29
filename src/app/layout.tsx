import MyContextProvider from "@/lib/MyContextProvider";
import SessionProviderForNextAuth from "@/nextAuth/SessionProviderForNextAuth";
import ReduxStoreProvider from "@/redux/ReduxStoreProvider";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import AntdConfigProvider from "@/providers/AntdConfigProvider";
import { ViewTransitions } from "next-view-transitions";

export const metadata: Metadata = {
  title: "kaplanosman",
  description: "Description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body suppressHydrationWarning={true}>
          <MyContextProvider>
            <SessionProviderForNextAuth>
              <ReduxStoreProvider>
                <AntdConfigProvider>
                  <Toaster />
                  {children}
                </AntdConfigProvider>
              </ReduxStoreProvider>
            </SessionProviderForNextAuth>
          </MyContextProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
