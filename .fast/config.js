import translations from './translations';
import Configuration from './offline/Configuration.json';
import Roles from './offline/Roles.json';
import lastUpdated from './offline/lastUpdated.json';
import Translations from './offline/Translations.json';
import Pages from './offline/Pages.json';
import Forms from './offline/Forms.json';

export default {
  type: 'remote',
  appConfigId: '5bb3bc95dd43110ab3e4cc72',
  appConfigUrl: 'https://ydvahgxgqliaeuf.form.io/configuration/submission/',
  i18n: translations,
  offlineStart: true,
  offlineFiles: {
    Configuration,
    Roles,
    lastUpdated,
    Translations,
    Pages,
    Forms
  }
};
