<template>
  <div>
    <div class="row">
      <div class="col-sm-8">
        <q-input
          v-model.lazy="translationSearch"
          type="text"
          :stack-label="$t('TRANSLATION FILTER')"
          :placeholder="$t('Search...')"
          :after="[{  icon: 'fa-search'}]"
          clearable
        />
      </div>
      <div class="col-sm-4">
        <q-toggle
          style="text-transform: uppercase;"
          v-model="untranslated"
          :label="$t('not translated')"
        />
      </div>
    </div>
    <q-pagination
      v-model="currentPage"
      :max="totalPages"
      :max-pages="4"
      direction-links
      boundary-links
    />
    {{_labels.length}} {{$t('Translations')}}
    <q-list no-border>
      <translation-item
        v-for="label in paginatedLabels"
        :key="label"
        :label="label"
        :value="translations[label] ? translations[label] : ''"
        :language="language"
      />
    </q-list>
    <q-pagination
      class="pull-right"
      v-model="currentPage"
      :max="totalPages"
      :max-pages="4"
      direction-links
      boundary-links
    />
  </div>
</template>

<script>
import TranslationItem from './TranslationItem';

export default {
  name: 'TranslationsList',
  components: {
    TranslationItem
  },
  data() {
    return {
      untranslated: false,
      translationSearch: '',
      itemsPerPage: 10,
      currentPage: 1
    };
  },
  props: {
    labels: {
      required: true
    },
    translations: {
      required: true
    },
    language: {
      required: true
    }
  },
  watch: {
    // eslint-disable-next-line
    labels: () => {},
    // eslint-disable-next-line
    translations: () => {}
  },
  computed: {
    _labels() {
      // eslint-disable-next-line
      this.currentPage = 1;
      let filteredTranslations = [];
      const search = this.translationSearch.toLowerCase();
      // eslint-disable-next-line
      filteredTranslations = this.labels.filter(l => {
        const label = l.toLowerCase();
        if (!label.includes(search)) return null;
        if (!this.untranslated) return l;
        if (this.translations[l] === '') return l;
      });

      return filteredTranslations;
    },
    paginatedLabels() {
      return this.paginate(this._labels, this.itemsPerPage, this.currentPage);
    },
    totalPages() {
      return Math.ceil(this._labels.length / this.itemsPerPage);
    }
  },
  methods: {
    paginate(array, pageSize, pageNumber) {
      const newArray = [...array];
      // eslint-disable-next-line
      --pageNumber;
      return newArray.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
    }
  }
};
</script>
