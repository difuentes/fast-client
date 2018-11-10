<template>
  <div>
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="col-lg-6 col-md-8 col-sm-8 col-xs-8 pull-right">
        <q-search v-model="filter" :placeholder="$t('Filter results...')"/>
      </div>
    </div>
    <div v-for="(chunk, index) in _cards" v-bind:key="index" class="col-lg-12">
      <div
        class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12"
        v-for="card in chunk"
        v-bind:key="card.title"
        style="margin:auto;"
        v-if="card.shouldDisplay || typeof(card.shouldDisplay) === 'undefined'"
      >
        <q-card color="white" class="text-black cardRibbon">
          <q-card-title>
            <q-item>
              <q-item-side
                :icon="!card.customIcon && card.icon ? card.icon : null"
                :avatar="card.customIcon && card.icon ? card.icon : null"
              />
              <q-item-main>
                <q-item-tile label="">{{$t(card.title)}}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-card-separator style="background:lightgrey;"/>
            <span slot="subtitle" class="pull-left text-grey" style="padding-top:10px;">
              {{$t(card.subtitle)}}
              <br>
              <q-btn
                color="primary"
                style="margin-top:10px; margin-left: 15px!important;"
                @click="applyAction(action)"
                v-if="action.target && (action.shouldDisplay|| typeof(action.shouldDisplay) === 'undefined')"
                v-for="action in card.actions"
                v-bind:key="action.text"
              >{{$t(action.text)}}</q-btn>
            </span>
          </q-card-title>
        </q-card>
      </div>
    </div>
  </div>
</template>
<style scoped>
.q-if.row.no-wrap.items-center.relative-position.q-input.q-search.text-primary {
  border-bottom: 1px solid grey;
}
</style>

<script>
import _chunk from 'lodash/chunk';
import { Auth } from 'fast-fastjs';

export default {
  name: 'ActionCards',
  props: ['page'],
  data() {
    return {
      filter: ''
    };
  },
  watch: {
    page() {
      this.$forceUpdate();
    }
  },
  computed: {
    _cards() {
      const page = JSON.parse(this.page);
      let cards = page && page.cards ? page.cards : [];
      cards = cards.filter(c => c.title.toLowerCase().indexOf(this.filter.toLowerCase()) > -1);

      return _chunk(cards, 3);
    }
  },
  methods: {
    applyAction(action) {
      const parent = action.parent && action.parent !== '' ? action.parent : 'null';

      if (action.internal) {
        let formPath = 'user/profile';
        let form = 'user';

        if (Auth.hasRole('Administrator')) {
          formPath = 'admin/profile';
          form = 'admin';
        }
        if (action.internalUrl === 'userProfile') {
          const path = `/forms/${formPath}/submission/own_unique_from/update?mode=online&form=${form}&parent=${btoa(
            JSON.stringify(parent)
          )}`;
          this.$router.push(path);
          return;
        }

        if (action.internalUrl === 'changePassword') {
          const path = `/forms/resetpassword/submission/own_unique_from/update?mode=online&form=${form}&parent=${btoa(
            JSON.stringify(parent)
          )}`;
          this.$router.push(path);
          return;
        }

        const to = {
          name: action.internalUrl,
          query: {
            parent: action.parent
              ? btoa(JSON.stringify(action.parent))
              : btoa(JSON.stringify('null'))
          }
        };
        this.$router.push(to);
        return;
      }

      if (action.formPath) {
        const path =
          action.view === 'list'
            ? `/forms/${action.formPath}?parent=${btoa(JSON.stringify(parent))}`
            : `/forms/${action.formPath}/submission?parent=${btoa(JSON.stringify(parent))}`;

        const to = {
          path
        };
        this.$router.push(to);
      } else if (action.page) {
        const to = {
          name: 'pageManager',
          params: { path: action.page.url },
          query: {
            parent: action.parent
              ? btoa(JSON.stringify(action.parent))
              : btoa(JSON.stringify('null'))
          }
        };
        this.$router.push(to);
      }
    }
  }
};
</script>
