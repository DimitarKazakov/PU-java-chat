import "@/styles/globals.css";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isToday from "dayjs/plugin/isToday";
import minMax from "dayjs/plugin/minMax";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import type { AppProps } from "next/app";

// eslint-disable-next-line @next/next/no-document-import-in-page
import { queryClient } from "../config/queryclient.config";
import { GlobalProvider } from "../hooks/GlobalContext";

dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isToday);
dayjs.extend(minMax);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <CssBaseline />

          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </GlobalProvider>
      </QueryClientProvider>
    </StyledEngineProvider>
  );
}
