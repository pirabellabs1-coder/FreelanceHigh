import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const SUPPORTED_LOCALES = ["fr", "en"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function isSupported(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;
  const locale: SupportedLocale =
    cookieLocale && isSupported(cookieLocale) ? cookieLocale : "fr";

  const messages = (await import(`../messages/${locale}.json`)).default;
  const fallbackMessages = locale !== "fr"
    ? (await import(`../messages/fr.json`)).default
    : undefined;

  return {
    locale,
    messages: fallbackMessages ? { ...fallbackMessages, ...messages } : messages,
  };
});
