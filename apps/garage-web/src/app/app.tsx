// import NxWelcome from './nx-welcome';
import '../i18n/config';
import { useTranslation, Trans } from 'react-i18next';

export function App() {
  const { t, i18n } = useTranslation();

  const count = 1;

  const onClickLanguageChange = (e: any) => {
    const language = e.target.value;
    console.log(i18n.language);
    i18n.changeLanguage(language); //change the language
    console.log(i18n.language);
  };

  return (
    <div className="App">
      <p>{t('title', { name: 'John' })}</p>
      <p>{t('description.part1')}</p>
      <p>{t('description.part2')}</p>
      <p>{t('current_date', { date: new Date() })}</p>
      <Trans i18nKey="userMessagesUnread" count={count}>
        {t('userMessagesUnread_one', { count: count })}
      </Trans>

      <select
        className="custom-select"
        style={{ width: 200 }}
        onChange={onClickLanguageChange}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  );
}

export default App;
