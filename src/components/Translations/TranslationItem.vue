<template>
  <q-item>
    <q-item-main>
      {{label}}
      <q-input inverted v-model="currentValue" type="textarea" :color="color" clearable/>
      <q-btn class="pull-right" v-if="changed" @click.native="change" color="primary">
        <q-icon name="check" v-if="!loading"/>
        <q-spinner v-if="loading"/>
      </q-btn>
      <q-btn class="pull-right" v-if="changed" @click.native="revert" color="grey">
        <q-icon name="fas fa-undo" v-if="!loading"/>
        <q-spinner v-if="loading"/>
      </q-btn>
    </q-item-main>
  </q-item>
</template>

<script>
import { Translation } from 'fast-fastjs';
import to from 'await-to-js';

export default {
  name: 'TranslationItem',
  data() {
    return {
      currentValue: this.value,
      oldValue: this.value,
      loading: false
    };
  },
  props: {
    label: {
      required: true
    },
    value: {},
    language: {}
  },
  watch: {},
  computed: {
    color() {
      if (!this.currentValue || this.currentValue === '') {
        return 'red';
      }
      return 'green';
    },
    changed() {
      if (this.currentValue === this.oldValue) {
        return false;
      }
      return true;
    }
  },
  methods: {
    revert() {
      this.currentValue = this.oldValue;
    },
    async change() {
      this.loading = true;

      // eslint-disable-next-line
      let translation = {};
      translation[this.language] = this.currentValue;
      const [err] = await to(Translation.updateLabel(this.label, translation));
      this.loading = false;
      if (!err) {
        this.oldValue = this.currentValue;
      }
    }
  }
};
</script>
