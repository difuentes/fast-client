<template>
  <div>
    {{numberOfLanguages}}
    <span style="color:grey">{{$t('Supported Languages')}}</span>
    <q-input
      v-model.lazy="languageSearch"
      type="text"
      :stack-label="$t('NAME FILTER')"
      :placeholder="$t('search...')"
      :after="[{  icon: 'fa-search'}]"
      clearable
    />
    <q-list separator no-border link="">
      <language-item
        :language="language"
        v-for="(language, code) in filteredLanguages"
        :key="code"
        @click.native="$emit('selected', {language})"
      />
    </q-list>
  </div>
</template>

<script>
/* eslint-disable */
import LanguageItem from './LanguageItem';
import { Utilities } from 'fast-fastjs';
export default {
  name: 'LanguageSelector',
  components: {
    LanguageItem
  },
  data() {
    return {
      languageSearch: ''
    };
  },
  props: {
    languages: {
      required: true
    }
  },
  watch: {
    languages: data => {}
  },
  computed: {
    numberOfLanguages() {
      return Utilities.get(() => Object.keys(this.languages).length - 1, 0);
    },
    filteredLanguages() {
      let languages = {};
      Object.keys(this.languages).forEach(code => {
        const name = this.languages[code].name;
        if (name.toLowerCase().indexOf(this.languageSearch) > -1 && code !== 'label') {
          languages[code] = this.languages[code];
        }
      });
      return languages;
    }
  }
};
</script>
<style>
input.col.q-input-target.text-left {
  border-bottom: #00000021 1px solid;
}
</style>