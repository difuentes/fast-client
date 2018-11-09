<template>
  <q-item>
    <q-item-side right>
      <q-knob
        size="70px"
        v-model="language.completed"
        color="primary"
        line-width="3px"
        :min="0"
        :max="100"
        readonly
      >
        {{language.completed}}
        <q-icon class="on-right" name="fa-percent"/>
      </q-knob>
    </q-item-side>
    <q-item-main :label="language.name"></q-item-main>
  </q-item>
</template>

<script>
/* eslint-disable */
export default {
  name: 'LanguageItem',
  props: {
    language: {
      required: true
    }
  },
  watch: {
    language: data => {}
  }
};
</script>
