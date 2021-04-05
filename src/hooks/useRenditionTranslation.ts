import renditionStringMap from '~/locales/renditionStringMap.json';

export const useRenditionTranslation = (providerTranslation: any) => {
  const t = (str: keyof typeof renditionStringMap) => {
    const result = providerTranslation?.(str);
    if (result == null || result === str) {
      return renditionStringMap[str];
    }
    return result;
  }
  return { t };
}