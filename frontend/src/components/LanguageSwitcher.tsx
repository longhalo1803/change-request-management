import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useLanguageStore, selectCurrentLanguage } from '@/store/language.store';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/config';
import type { SupportedLanguage } from '@/lib/i18n/resources';

const languageLabels: Record<SupportedLanguage, string> = {
  en: 'English',
  ja: '日本語',
  vi: 'Tiếng Việt'
};

export const LanguageSwitcher = () => {
  const currentLanguage = useLanguageStore(selectCurrentLanguage);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const handleChange = (value: SupportedLanguage) => {
    setLanguage(value);
  };

  const options = SUPPORTED_LANGUAGES.map((lang) => ({
    value: lang,
    label: languageLabels[lang]
  }));

  return (
    <Select
      value={currentLanguage}
      onChange={handleChange}
      options={options}
      suffixIcon={<GlobalOutlined />}
      style={{ width: 140 }}
    />
  );
};

export default LanguageSwitcher;
