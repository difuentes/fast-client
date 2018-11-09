<template>
  <div>
    <!-- <q-layout-header >
      <q-toolbar color="black" >
         <q-btn
          dense
          flat
          @click="$toggleLeftDrawer"
          aria-label="Menu"
          color="white"
          size="lg"
          style="margin-right:15px;"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          <Breadcrumb />
          <span slot="subtitle">

          </span>
        </q-toolbar-title>

        <q-btn
          dense
          flat
          aria-label="Options"
          color="white"
          size="lg"
        >
          <q-icon name="more_vert" />
          <q-popover ref="popover">
                  <q-list link class="no-border" dense separator no-border>

                    <q-item @click="$refs.popover.close(), createDialog()">
                      <q-item-side icon="fas fa-download"  />
                      <q-item-main :label="$t('Export')" />
                    </q-item>

                    <q-item @click="$refs.popover.close()">
                      <q-item-side icon="fas fa-upload"  />
                      <q-item-main :label="$t('Import')" />
                    </q-item>

                  </q-list>
                </q-popover>
        </q-btn>

      </q-toolbar>
    </q-layout-header>-->
    <q-card>
      <q-card-main style="padding: 0px; min-height: 150px" class="relative-position">
        <datatable
          :data="submissions"
          :form="currentForm"
          :menuActions="['create', 'export', 'import']"
          :tableActions="$FAST_CONFIG.HAS_REPORT ? ['read-only','edit', 'delete', 'report'] : ['edit', 'delete', 'read-only']"
          fastMode="show"
          v-on:refresh="refreshData"
          v-if="!noSubmissions"
        />
      </q-card-main>
    </q-card>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 60]"
      style="margin-right: 18px !important;"
    >
      <q-fab icon="add" direction="up" color="black">
        <q-fab-action
          color="grey-1"
          textColor="grey-7"
          icon="fab fa-wpforms"
          @click.native="goToCreateView({dataCollected: {scouting: true, traps: true}})"
        />
        <q-fab-action
          color="grey-1"
          textColor="grey-7"
          icon="fa fa-binoculars"
          @click.native="goToCreateView({dataCollected: {scouting: true, traps: false}})"
        />
        <q-fab-action
          color="grey-1"
          textColor="grey-7"
          icon="fas fa-archive"
          @click.native="goToCreateView({dataCollected: {scouting: false, traps: true}})"
        />
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script>
import datatable from 'components/dataTable/dataTable';
import { Form, Event, Submission, Auth, Utilities } from 'fast-fastjs';
// import Columns from 'components/dataTable/formatters/Columns';

export default {
  async created() {
    this.currentForm = await Form.local()
      .where('data.path', '=', this.$route.params.path)
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

    // this.$eventHub.on('FAST:LANGUAGE:CHANGED', async () => this.refreshData());
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
    datatable
  },
  data() {
    return {
      currentForm: {},
      submissions: undefined
    };
  },
  methods: {
    async goToCreateView(data) {
      const date = Utilities.unixDate();
      const formSubmission = {
        data: data || {},
        draft: true,
        sync: false,
        trigger: 'createLocalDraft',
        user_email: Auth.email(),
        path: this.$route.params.path,
        baseUrl: this.$FAST_CONFIG.APP_URL,
        created: date,
        modified: date
      };
      const submission = await Submission({ path: 'Scoutingtraps' })
        .local()
        .insert(formSubmission);
      const route = {
        name: 'formio_submission_update',
        params: {
          path: this.$route.params.path,
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
      // Loading.hide();
      this.$swal('Imported!', 'Your submission were imported', 'success');
    },
    async handleDataSynced() {
      await this.refreshData();
      // Toast.create.positive({ html: 'Your data was uploaded!' });
    },
    async refreshData() {
      // const cols = Columns.getTableView(this.currentForm.data).map(
      //   o => `data.${o.path} as ${o.path}`
      // );
      const { path } = this.$route.params;
      const submissions = await Submission({ path }).showView({ limit: 5000, owner: Auth.email() });
      this.submissions = submissions;
    }
  }
};
</script>
