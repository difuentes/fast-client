<template>
  <div class="row">
        <div class="col-lg-12 col-md-12  col-sm-12 col-xs-12 responsiveTableContainer">
          <q-card>

            <q-card-title>

              <breadcrum
                v-bind:class="$getDirection()"
                :parent="$route.query.parent"
                :currentPageTitle="formTitle"
              />
           <q-icon slot="right" name="fa-plus-circle" @click="goToCreateView()" color="primary" style="cursor:pointer; padding-right: 20px">

            </q-icon>

              <q-icon slot="right" name="more_vert" color="grey" style="cursor:pointer">
              <q-popover ref="popover">
                <q-list link class="no-border" dense separator no-border>

                  <q-item @click="$refs.popover.close(), createDialog()">
                    <q-item-side icon="fa-download"  />
                    <q-item-main :label="$t('Export')" />
                  </q-item>

                  <q-item @click="$refs.popover.close()">
                    <q-item-side icon="fa-upload"  />
                    <q-item-main :label="$t('Import')" />
                  </q-item>

                </q-list>
              </q-popover>
            </q-icon>
            </q-card-title>
              <q-card-main style="padding: 0px; min-height: 150px" class="relative-position"  >

                <datatable
                  :data="submissions"
                  :form="currentForm"
                  :menuActions="['create', 'export', 'import']"
                  :tableActions="$FAST_CONFIG.HAS_REPORT ? ['read-only','edit', 'delete', 'report'] : ['edit', 'delete', 'read-only']"
                  fastMode="show"
                  v-on:refresh="refreshData"
                  v-if="!noSubmissions"
                />
                <loading :visible="noSubmissions"></loading>
            </q-card-main>
          </q-card>

         </div>

  </div>
</template>

<script>
import loading from 'components/loading';
import datatable from 'components/dataTable/dataTable';
import breadcrum from 'components/breadcrum';
import { Form, Event, Submission, Auth, Utilities } from 'fast-fastjs';
import Columns from 'components/dataTable/tableFormatter/Columns';

export default {
  async created() {
    this.currentForm = await Form.local()
      .where('data.path', '=', this.$route.params.idForm)
      .first();

    await this.refreshData();

    Event.listen({
      name: 'FAST:SUBMISSION:SYNCED',
      callback: this.handleDataSynced
    });
    Event.listen({
      name: 'FAST:DATA:IMPORTED',
      callback: this.handleDataImported
    });

    this.$eventHub.on('FAST:LANGUAGE:CHANGED', async (data) => {
      await this.refreshData();
    });
  },
  beforeDestroy() {
    Event.remove({
      name: 'FAST:SUBMISSION:SYNCED',
      callback: this.handleDataSynced
    });
  },
  computed: {
    formTitle() {
      let title = '';
      if (this.currentForm) {
        title = this.currentForm.data ? this.currentForm.data.title : '';
      }
      return this.$t(title);
    },
    breadcrum() {
      return 'Home';
    },
    noSubmissions() {
      return typeof this.submissions === 'undefined';
    }
  },
  components: {
    breadcrum,
    datatable,
    loading
  },
  data() {
    return {
      currentForm: {},
      submissions: undefined
    };
  },
  methods: {
    async goToCreateView() {
      const date = Utilities.unixDate();
      const formSubmission = {
        data: {},
        draft: true,
        sync: false,
        trigger: 'createLocalDraft',
        user_email: Auth.email(),
        path: this.$route.params.idForm,
        baseUrl: this.$FAST_CONFIG.APP_URL,
        created: date,
        modified: date
      };

      const submission = await Submission.local().insert(formSubmission);
      console.log('fewfwe');
      const route = {
        name: 'formio_submission_update',
        params: {
          idForm: this.$route.params.idForm,
          idSubmission: submission._id
        },
        query: {
          parent: this.$route.query.parent
        }
      };
      this.$router.push(route);
    },
    breadCrumClick() {
      this.$router.push({
        name: 'pageManager',
        params: {
          pageId: JSON.parse(window.atob(this.$route.query.parent)).url
        }
      });
    },
    emitEvent(event, params) {
      this.$eventHub.emit(event, params);
    },
    async createDialog() {
      Event.emit({
        name: 'FAST:EXPORT:OPENMENU',
        data: undefined,
        text: 'Triggering Open Export Menu'
      });
    },
    async handleDataImported() {
      await this.refreshData();
      Loading.hide();
      this.$swal('Imported!', 'Your submission were imported', 'success');
    },
    async handleDataSynced() {
      await this.refreshData();
      Toast.create.positive({ html: 'Your data was uploaded!' });
    },
    async refreshData() {
      let cols = Columns.getTableView(this.currentForm.data).map(
        (o) => `data.${o.path} as ${o.path}`
      );
      let submissions = await Submission.showView({
        path: this.$route.params.idForm,
        columns: cols,
        vm: this
      });

      this.submissions = submissions;
    }
  }
};
</script>
