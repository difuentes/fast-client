<template>
  <div>
    <q-card
      flat
      class="col-xl-10 col-lg-10 col-md-12 col-sm-12 col-lg-offset-1 col-md-offset-1 col-xl-offset-1"
      style="position:inherit !important;"
    >
      <div>
        <q-stepper contractable ref="stepper">
          <!-- Step: -->
          <q-step default title="Language Selection" subtitle="Select the language">
            <language-selector :languages="translationStatus" v-on:selected="handleSelected"/>
          </q-step>
          <!-- Step: -->
          <q-step title="Translations" subtitle="Translate the labels">
            <translations-list
              :language="selectedLanguange"
              :labels="labelsArray"
              :translations="translationsArray"
            />
          </q-step>
        </q-stepper>
      </div>
    </q-card>
  </div>
</template>
<script>
import LanguageSelector from 'components/LanguageSelector';
import TranslationsList from 'components/Translations/TranslationsList';
import { Translation, Form, FAST } from 'fast-fastjs';
import Promise from 'bluebird';
import _forEach from 'lodash/forEach';

export default {
  components: {
    TranslationsList,
    LanguageSelector
  },
  data() {
    return {
      selectedLanguange: '',
      translations: null,
      supportedLanguages: null,
      untranslatedArray: []
    };
  },
  async created() {
    await this.syncApp();
    this.formNameFilters = await Form.local().get();
    this.supportedLanguages = await Translation.supportedLanguages();

    this.translations = await Form.FormLabels(this.selection, this.$appConf.i18n);

    Object.keys(this.translations).forEach(label => {
      if (this.getCurrentTranslations(label) === -1) {
        this.untranslatedArray.push(label);
      }
    });
    if (this.untranslatedArray.length > 0) {
      this.createTranslations();
    }
  },
  computed: {
    labelsArray() {
      const { translations } = this;
      const tArray = [];
      if (translations) {
        Object.keys(translations).forEach(label => {
          tArray.push(label);
        });
      }
      return tArray;
    },
    translationStatus() {
      const { translations } = this;
      // let languages = _get(this.supportedLanguages, 'length', []);
      // Object.keys(this.groupedTranslations)
      if (translations) {
        const totalTranslations = Object.keys(this.translations).length;
        // Calculate total translations per language
        // TODO: refactor this
        const result = Object.keys(translations).reduce((acc, label) => {
          Object.keys(translations[label].translations).forEach(code => {
            // eslint-disable-next-line
            if (acc[code] && acc[code] !== '') {
              // eslint-disable-next-line
              acc[code] = acc[code] + 1;
            } else {
              // eslint-disable-next-line
              if (acc[code] !== '') {
                acc[code] = 1;
              }
            }
          });
          return acc;
        }, {});
        // TODO: se puede cambiar por un map
        // eslint-disable-next-line
        Object.keys(result).forEach(code => {
          result[code] = {
            completed: parseFloat(Math.floor((result[code] / totalTranslations) * 100)),
            name: this.getLanguageName(code),
            code
          };
        });
        return result;
      }
      return null;
    },
    translationsArray() {
      if (this.selectedLanguange === '') {
        return [];
      }
      // eslint-disable-next-line
      let translations = [];
      Object.keys(this.translations).forEach(label => {
        const data = this.translations[label];
        const value = data.translations[this.selectedLanguange] || '';
        translations[label] = value;
      });
      return translations;
    }
  },
  methods: {
    handleSelected(e) {
      this.selectedLanguange = e.language.code;
      this.$refs.stepper.next();
      window.scrollTo(0, 0);
    },
    getLanguageName(code) {
      if (!this.supportedLanguages) return null;
      const languange = this.supportedLanguages.filter(lang => lang.code === code);
      if (languange.length >= 1) return languange[0].label;
      return this.$t('Total');
    },
    getCurrentTranslations(label) {
      const { translations } = this.translations[label];
      const total = Object.keys(translations).reduce((acc, code) => {
        if (translations[code] && translations[code] !== '') {
          acc = acc + 1;
        }
        return acc;
      }, 0);
      return total - 1;
    },
    createTranslations() {
      let totalTranslations = this.untranslatedArray.length;
      if (totalTranslations > 0) {
        this.$swal({
          title: this.$t('Creating') + ' ' + totalTranslations + ' ' + this.$t('translations...'),
          text: this.$t(
            'Wait until the translations are created. This can take a couple minutes...'
          ),
          showCancelButton: false,
          onOpen: () => {
            this.$swal.showLoading();

            return Promise.each(this.untranslatedArray, async (translation, index) => {
              if (typeof translation !== 'undefined' && translation !== '') {
                await Translation.createTranslation(translation);
                this.progress = Math.floor(index / totalTranslations);
                console.log(
                  'Total',
                  totalTranslations,
                  'Current',
                  index,
                  'Por',
                  (index / totalTranslations) * 100
                );
                this.$swal.title = this.progress;
              }
            })
              .then(async result => {
                this.$swal.close();
                Toast.create.positive({
                  html: this.$t('TRANSLATIONS CREATED')
                });
              })
              .catch(async e => {
                this.$swal.close();
                console.log(e);
                Toast.create.negative({
                  html: this.$t('TRANSLATIONS FAILED')
                });
              });
          },
          allowOutsideClick: false
        });
      } else {
        Toast.create.positive({
          html: this.$t('NO TRANSLATIONS TO CREATE')
        });
      }
    },
    async addLanguage() {
      let options = Translation.getIsoLanguages();
      let customOptions = {};
      _forEach(options, option => {
        customOptions[option.code] = option.label;
      });

      const language = await this.$swal({
        title: this.$t('Select the language'),
        input: 'select',
        inputOptions: customOptions,
        inputPlaceholder: this.$t('Select a language'),
        showCancelButton: true,
        inputValidator: value => {
          return new Promise(resolve => {
            if (value === '') {
              resolve(this.$t('You need to select a language'));
            }
            resolve();
          });
        }
      });

      if (language) {
        this.$swal(this.$t('New language created: ') + customOptions[language]);
        this.translations.columns.push(language);
        _forEach(this.translations.labels, label => {
          label.push(undefined);
        });
        this.$eventHub.emit('Translation:languageAdded', {
          language: customOptions[language]
        });
      }
    },
    async syncApp() {
      return new Promise((resolve, reject) => {
        this.$swal({
          title: this.$t('Updating...'),
          text: this.$t('Wait until the App is Updated. This can take a couple minutes...'),
          showCancelButton: false,
          onOpen: async () => {
            this.$swal.showLoading();
            await FAST.sync({
              appConf: this.$appConf
            });
            this.$swal.close();
            resolve();
          }
        });
      });
    }
  }
};
</script>
