import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <ClerkProvider appearance={clerkStyles} {...pageProps}>
            <Component {...pageProps} />
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);

const clerkStyles = {
    elements: {
        rootBox: "mb-2 inline-block",
        avatarBox: "w-16 h-16",
    }
}
