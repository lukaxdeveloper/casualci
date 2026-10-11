import Script from "next/script";
import { homeMarkup } from "./home-markup";

export default function Home() {
  return <><div dangerouslySetInnerHTML={{ __html: homeMarkup }} /><Script src="/app.js" type="module" strategy="afterInteractive" /></>;
}
