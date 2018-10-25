import translations from './translations';
import Configuration from './offline/Configuration.json';
import Roles from './offline/Roles.json';
import lastUpdated from './offline/lastUpdate.json';
import Translations from './offline/Translations.json';
import Pages from './offline/Pages.json';
import Forms from './offline/Forms.json';

export default {
  type: 'remote',
  fluentFormioBaseUrl: process.env.FLUENT_FORMIO_BASEURL,
  appConfigId: process.env.FAST_CONFIG_ID,
  appConfigUrl: `${process.env.FAST_CONFIG_URL}/configuration/submission`,
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

// FAST_CONFIG_URL=https://yditvahgxgqliaeuf.form.io/
// FAST_CONFIG_ID=5bb3bc95dd43110ab3e4cc72
//
