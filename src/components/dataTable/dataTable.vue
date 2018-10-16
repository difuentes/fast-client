<template>
<div class="tableContainer" v-if="show">
    <q-table
      ref="table"
      color="primary"
      :data="data"
      :config="config"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      selection="multiple"
      :selected.sync="selected"
      row-key="_id"
      @rowclick="handleRowClick"
      class="no-shadow"
    >

      <!-- Top actions when table selected -->
        <template slot="top-selection" slot-scope="scope">
            <q-btn v-if="tableActions && tableActions.includes('review')" color="primary" flat @click='handleReview({readOnly:false})'>
                <q-icon name="remove_red_eye" />
                <q-tooltip>{{$t('Review')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="tableActions && tableActions.includes('read-only')" color="primary" flat @click='handleReview({readOnly:true})'>
                <q-icon name="remove_red_eye" />
                <q-tooltip>{{$t('Read Only')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="tableActions && tableActions.includes('edit')" color="primary" flat @click='goToEditView()'>
                <q-icon name="edit" />
                <q-tooltip>{{$t('Edit')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="tableActions && tableActions.includes('report')" color="primary" flat @click='handleReport()'>
                <q-icon name="assignment" />
                <q-tooltip>{{$t('Report')}}</q-tooltip>
            </q-btn>

            <q-btn flat v-if="tableActions && tableActions.includes('delete')" color="grey" @click="handleDelete()">
                <q-icon name="delete" />
                <q-tooltip>{{$t('Delete')}}</q-tooltip>
            </q-btn>
        </template>
      <!-- Top actions when table selected -->

      <!-- Top Searchbox filter -->
      <template slot="top-left" slot-scope="props">
        <q-search hide-underline v-model="filter" />
      </template>
      <!-- Top Searchbox filter -->



    <!-- ROW Click on row action -->

         <q-td slot="body-cell-status" slot-scope="scope">
           <div v-if="scope.row.status === 'offline' && scope.row.draft">
                <q-icon name="description" color="grey" size="20px" />

                <q-tooltip>{{$t('Draft')}}</q-tooltip>
            </div>
            <div v-if="scope.row.status === 'offline' && scope.row.draft">
              <q-icon name="description" color="grey" size="20px"/>

                <q-tooltip>{{$t('Draft')}}</q-tooltip>
            </div>
            <div v-else-if="scope.row.status === 'offline'">
              <q-icon name="description" color="blue" size="20px"/>

                <q-tooltip>{{$t('Offline submission')}}</q-tooltip>
            </div>
            <div v-else-if="isOnlineSubmission(scope.row._id, scope.row._lid)">
              <q-icon name="cloud_done" color="green" size="20px"/>
                <q-tooltip>{{$t('Online Submission')}}</q-tooltip>
            </div>
            <div v-else>
              <q-icon name="cloud_download" color="green" size="20px"/>
                <q-tooltip>{{$t('Synced Submission')}}</q-tooltip>
            </div>
            <i
              class="material-icons"
              style="color: red;font-size: x-large; cursor: pointer;"
              v-if="scope.row.syncError && scope.row.syncError !=='Unauthorized' "
              @click="displayError(scope.row.syncError)"
            >block</i>
            <i class="material-icons" style="color: red;font-size: x-large; cursor: pointer;"
              v-if="scope.row.syncError && scope.row.syncError ==='Unauthorized' "
              @click="displayError(scope.row.syncError)">block</i>
          </q-td>
    <!-- ROW Click on row action -->


      <!-- CELL design for submission status Draft/Online/Submitted -->

        <template slot="col-status" slot-scope="scope">

        </template>
      <!-- CELL design for submission status Draft/Online/Submitted -->


      <!-- Cell design if the submission is deleted -->
        <template slot='col-deleted' slot-scope='scope'>
            <q-chip icon="fa-ban" small color="red" v-if="scope.row.deleted && scope.row.deleted === true">
            </q-chip>

            <q-chip icon="fa-check" small color="green" v-else>
            </q-chip>
        </template>
        <!-- Cell design if the submission is deleted -->

    </q-table>

   <!-- <export-menu render="outside" :actions="menuActions" /> -->
</div>
</template>

<script>
import _get from 'lodash/get';
import _camelCase from 'lodash/camelCase';
// import exportMenu from './export/exportMenu';
import Export from './export/Export';
import Columns from './formatters/Columns';
import { Import, Submission, Auth, OfflinePlugin, Form } from 'fast-fastjs';
import ErrorFormatter from './formatters/error';
import { Base64 } from 'js-base64';
import Formio from 'formiojs/Formio';

export default {
  components: {},
  name: 'datatable',
  props: {
    data: {
      required: true
    },
    form: {
      required: true
    },
    tableActions: {
      required: false,
      type: Array,
      default: () => []
    },
    menuActions: {
      required: false,
      type: Array,
      default: () => []
    },
    fastMode: {
      required: false,
      type: String,
      default: 'false'
    }
  },
  mounted() {
    /*
    this.$eventHub.on('FAST:EXPORT', params => {
      this.exportTo(params);
    });
    this.$eventHub.on('FAST:IMPORT', () => {
      this.importSubmission();
    });
    this.$eventHub.on('FAST:GO:CREATE', () => {
      this.goToCreateView();
    });
    */
  },
  beforeDestroy() {
    /*
    this.$eventHub.off('FAST:EXPORT');
    this.$eventHub.off('FAST:GO:CREATE');
    this.$eventHub.off('FAST:IMPORT');
    this.$eventHub.off('FAST-DATA_SYNCED');
    this.$eventHub.off('FAST-DATA_IMPORTED');
    this.$eventHub.off('FAST:LANGUAGE:CHANGED');
    */
  },
  watch: {
    data() {},
    form() {},
    tableActions() {},
    menuActions() {}
  },
  methods: {
    isOnlineSubmission(_id, _lid) {
      return !_lid && _id.indexOf('_local') < 0;
    },
    async exportTo(params) {
      this.$swal({
        title: 'Exporting...',
        text: this.$t('Wait until the file is ready. This can take a couple minutes...'),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          let data = [];
          data = this.selectedRows.length === 0 ? this.data : this.selectedRows;
          const submissions = await this.getFullSubmissions(data, params.options);
          const date = new Date()
            .toJSON()
            .replace(/-/g, '')
            .replace(/T/g, '_')
            .replace(/:/g, '')
            .slice(0, 15);

          const fileName = `${_camelCase(this.form.data.title)}_${date}`;

          await Export.jsonTo({
            fileName,
            output: params.format,
            options: params.options,
            data: submissions,
            formioForm: this.form.data,
            vm: this
          });
          this.$swal(
            this.$t('Exported!'),
            `${this.$t('The file has been exported. File name:')}<br><strong>${fileName}</strong>`,
            'success'
          );
        }
      });
    },
    handleRowClick(row) {
      this.clickedRow = row;
    },
    async getFullSubmissions(submissions, options) {
      const query = {
        limit: 50000,
        form: this.form.data.path,
        filter: {
          'data.formio.formId': this.form.data.path,
          'data.user_email': Auth.email()
        },
        dataExport: true
      };

      if (options && options.includes('ownerEmail')) {
        query.populate = ['owner'];
      }
      let sub = await Submission.merged().showView(query);

      // Get all Ids in the selection
      const ids = submissions.reduce((acc, s) => {
        if (s._id) {
          acc.push(s._id);
        }
        return acc;
      }, []);

      // Filter the ids
      sub = sub.filter(s => ids.includes(s._id));
      return sub;
    },
    async handleReview({ readOnly }) {
      const rows = this.selectedRows;
      if (rows.length > 1) {
        this.$swal({
          title: this.$t('Review for multiple rows'),
          text: this.$t("You can't review more than one row"),
          type: 'error'
        });
        return;
      }
      const submission = this.selectedRows[0];
      this.$router.push({
        name: 'formio_submission_update',
        query: {
          mode: readOnly ? 'read-only' : 'online-review',
          parent: !readOnly
            ? Base64.encode(
                JSON.stringify({
                  isInternal: true,
                  url: 'alldata',
                  title: this.$t('All Data')
                })
              )
            : this.$route.query.parent
        },
        params: {
          idForm: this.form.data.path,
          idSubmission: submission._id
        }
      });
    },
    async handleOnlineEdit(submission, formId) {
      this.$router.push({
        name: 'formio_submission_update',
        query: {
          mode: 'online',
          parent: this.$route.query.parent
        },
        params: {
          idForm: formId,
          idSubmission: submission._id
        }
      });
    },
    handleReport() {
      const rows = this.selectedRows;

      if (rows.length > 1) {
        this.$swal({
          title: this.$t('Report for multiple rows'),
          text: this.$t("You can't see the report more than one row"),
          type: 'error'
        });
        return;
      }
      const submission = this.selectedRows[0];

      this.$router.push({
        name: 'formio_submission_report',
        params: {
          idForm: this.form.data.path,
          idSubmission: submission._lid || submission._id
        },
        query: {
          parent: this.$route.query.parent
        }
      });
    },
    handleDelete() {
      const rows = this.selectedRows;
      const self = this;
      if (rows.length === 0) {
        this.$swal({
          title: this.$t('No row selected'),
          text: this.$t('You must select at least one row to delete'),
          type: 'error'
        });
        return;
      }
      this.$swal({
        title: this.$t('Are you sure?'),
        text: this.$t("You won't be able to revert this!"),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('Yes, delete it!'),
        cancelButtonText: this.$t('Cancel')
      }).then(async () => {
        Promise.each(rows, async submission => {
          if (submission._id && !submission._id.includes('_local')) {
            await Form.getModel({ path: this.form.data.path })
              .remote()
              .remove(submission._id);
          } else {
            await Submission.local().remove(submission._id);
          }
        })
          .then(async () => {
            this.$emit('refresh');
            self.$swal(
              this.$t('Deleted!'),
              this.$t('Your submission has been deleted.'),
              'success'
            );
          })
          .catch(error => {
            console.log(error);
            this.$swal(this.$t('Error!'), this.$t("Can't delete online submission."), 'error');
          });
      });
    },
    async importSubmission() {
      const file = await this.$swal({
        title: this.$t('Select your JSON file'),
        input: 'file',
        inputAttributes: {
          accept: '.json',
          'aria-label': this.$t('Upload your JSON File')
        }
      });
      if (file) {
        Import.fromJsonFile(file, this);
      }
    },
    displayError(error) {
      const errorString = ErrorFormatter.format(error);
      this.$swal({
        title: error.name,
        type: 'info',
        html: errorString,
        showCloseButton: true,
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    },
    goToCreateView() {
      const formId = _get(this.form, 'data.properties["fast-create-view"]') || this.form.data.path;
      const url = `${this.$FAST_CONFIG.APP_URL}/${formId}`;

      const formSubmission = {
        data: {},
        redirect: 'Update',
        draft: true,
        trigger: 'createLocalDraft'
      };
      const formio = new Formio(url);

      Formio.deregisterPlugin('offline');
      // Register the plugin for offline mode
      Formio.registerPlugin(
        OfflinePlugin.getPlugin({
          formio
        }),
        'offline'
      );

      formio.saveSubmission(formSubmission).then(created => {
        this.$router.push({
          name: 'formio_submission_update',
          params: {
            idForm: formio.formId,
            idSubmission: created._id
          },
          query: {
            parent: this.$route.query.parent
          }
        });
      });
    },
    goToEditView() {
      const rows = this.selectedRows;
      if (rows.length > 1) {
        this.$swal({
          title: this.$t('Edit Multiple Rows'),
          text: this.$t("You can't edit more than one row"),
          type: 'error'
        });
        return;
      }
      const submission = this.selectedRows[0];
      const formId = _get(this.form, 'data.properties["fast-edit-view"]') || this.form.data.path;
      if (submission.status === 'online' && !submission._lid) {
        this.handleOnlineEdit(submission, formId);
        return;
      }
      const submissionId = submission._lid || submission._id;
      this.$router.push({
        name: 'formio_submission_update',
        params: {
          idForm: formId,
          idSubmission: submissionId
        },
        query: {
          parent: this.$route.query.parent
        }
      });
    },
    async editCell(data) {
      const value = await this.$swal({
        // The title must be replced by a compound ID from FORM.io dg property
        title: data.col.label,
        input: 'text',
        inputPlaceholder: `Enter amount for ${data.col.label}`,
        inputValue: data.data,
        showCancelButton: true
      });

      if (value) {
        this.data[data.row.__index][data.col.field] = value;
        /* this.rerender()
        let autoSave = new CustomEvent("autoSaveDraft", {
          detail: {
            data: {
              trigger: 'editGrid'
            },
            text: "Autosave Requested"
          }
        });
        document.dispatchEvent(autoSave);
        */
      }
    }
  },
  computed: {
    columns() {
      return Columns.get({
        form: this.form.data,
        data: this.data,
        fastMode: this.fastMode,
        vm: this
      });
    }
  },
  data() {
    return {
      selected: [],
      serverData: [],
      serverPagination: {
        page: 1,
        rowsNumber: 10
      },
      filter: '',
      loading: false,
      show: true,
      config: {
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        rowHeight: '50px',
        responsive: false,
        pagination: {
          rowsPerPage: 10,
          options: [10, 30, 50, 100, 200]
        },
        messages: {
          noData: this.$t('No data available to show.'),
          noDataAfterFiltering: this.$t('No results. Please refine your search terms.')
        },
        // (optional) Override default labels. Useful for I18n.
        labels: {
          columns: this.$t('Columns'),
          allCols: this.$t('All Columns'),
          rows: this.$t('Rows'),
          selected: {
            singular: this.$t('item selected.'),
            plural: this.$t('items selected.')
          },
          clear: this.$t('Clear Selection'),
          search: this.$t('Search'),
          all: this.$t('All')
        },
        selection: this.fastMode !== 'editGrid' ? 'multiple' : false
      },
      selectedRows: [],
      clickedRow: null,
      visibleColumns: []
    };
  }
};
</script>
<style scope>
.q-table-middle.scroll {
  height: calc(100vh - 153px);
}
</style>
