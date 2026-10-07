/** Sayfanın window'a koyduğu ve testlerin page.evaluate içinde okuduğu globaller. */
type Dictionary = { [key: string]: Dictionary | string | unknown[] };

declare global {
  interface Window {
    I18N: { tr: Dictionary; en: Dictionary };
    /** "Siteyi kır" testi: transform alan öğelerin sınıfları */
    __broken: Set<string>;
    Analytics: { track(name: string): void; events(): string[]; enabled: boolean };
  }
}

export {};
