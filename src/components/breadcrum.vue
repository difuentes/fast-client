<template>
      <div class="appBreadcrumb">
       <span
                style="color: white;cursor:pointer"
                @click="$router.push({name: 'dashboard', exact: true})"
                class="appBreadcrumb"
              >
              {{
                $t('Home')
              }}
              </span>

                <span
                style="color: white;cursor:pointer"
                @click="breadCrumClick"
                 class="appBreadcrumb"
                >
                {{ breadCrumTitle }}
                </span>

                <span
                  style="color: white;cursor:pointer"
                   class="appBreadcrumb"
                >
                  {{ ' /' }} <span @click="backToShow" v-if="isSubmission" class="breadCrumbBackToShow">{{isSubmission ? currentPageTitle: ''}}</span>
                </span>
                <span style="color:#b5bbbd">
                {{!isSubmission ? currentPageTitle : '' }} {{isSubmission ? "/" + this.$t('SUBMISSION'): ''}}
                </span>
    </div>
</template>
<script>
import { Base64 } from 'js-base64';

export default {
  name: 'breadcrum',
  props: {
    parent: {
      required: true
    },
    currentPageTitle: {
      required: false
    },
    isSubmission: {
      required: false
    }
  },
  watch: {
    parent() {},
    currentPageTitle() {},
    isSubmission() {}
  },
  computed: {
    breadCrumTitle() {
      const title =
        this.parent && JSON.parse(Base64.decode(this.parent)).title !== undefined
          ? `/ ${JSON.parse(Base64.decode(this.parent)).title}`
          : '';
      return title;
    }
  },
  methods: {
    backToShow() {
      const parent = this.$route.query.parent
        ? this.$route.query.parent
        : btoa(JSON.stringify('null'));
      const to = `/forms/${this.$route.params.path}?parent=${parent}`;
      this.$router.push(to);
    },
    breadCrumClick() {
      const parent = JSON.parse(window.decode(this.parent));

      if (parent.isInternal === true) {
        this.$router.push({
          name: parent.url
        });
        return;
      }
      this.$router.push({
        name: 'pageManager',
        params: { pageId: parent.url }
      });
    }
  }
};
</script>
