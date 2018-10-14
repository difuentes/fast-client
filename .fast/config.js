import translations from './translations';
import Configuration from './offline/Configuration.json';
import Roles from './offline/Roles.json';
import lastUpdated from './offline/lastUpdated.json';
import Translations from './offline/Translations.json';
import Pages from './offline/Pages.json';
import Forms from './offline/Forms.json';

export default {
  type: 'remote',
  appConfigId: process.env.FAST_CONFIG_ID || undefined,
  appConfigUrl: `${process.env.FAST_CONFIG_URL}configuration/submission/}` || undefined,
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
