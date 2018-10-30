<template>
  <q-page>
    <formiovue
      :form="form"
      :submission="submission"
      :options="options"
      :language="language"
      v-on:change="onSubmissionChange"
      v-on:submit="onFormSubmit"
      v-on:error="onFormError"
      v-on:prevPage="onPrevPage"
      v-on:nextPage="onNextPage"
      v-if="form && submission && options"
    />
    <q-layout-footer>
      <q-tabs
        color="white"
        textColor="faded"
        animated
        swipeable
        align="center"
        position="bottom"
        v-model="tab"
        v-if="$FAST_CONFIG.TAB_MENU"
      >
        <q-tab
          :icon="getTabIcon(page)"
          slot="title"
          v-for="(page, index) in pages"
          :key="page.title"
          @click="goToPage(index)"
          :ref="'page-'+ index + 1"
          :name="(index + 1).toString()"
          v-bind:class="currentPage === index ? 'activePage' : ''"
          :label="$t(getLabelForPage(page))"
        ></q-tab>
      </q-tabs>
    </q-layout-footer>
  </q-page>
</template>

<script>
import to from 'await-to-js';
import _get from 'lodash/get';
import FormioUtils from 'formiojs/utils';
import {
  Form,
  Auth,
  Submission,
  Event,
  ParallelSurvey,
  Translation,
  OfflinePlugin
} from 'fast-fastjs';
import Breadcrumb from 'components/Breadcrumb';
import Promise from 'bluebird';
import { Form as vForm } from 'vue-formio';
import Formio from 'formiojs/Formio';
import ErrorFormatter from '../../components/dataTable/formatters/error';
import fullLoading from '../../components/fullLoading';

export default {
  components: {
    formiovue: vForm,
    Breadcrumb
    // executor
  },
  async created() {
    Formio.registerPlugin(OfflinePlugin.get(), 'fast');
    Formio.setBaseUrl(this.$FAST_CONFIG.APP_URL);

    /*
    this.$eventHub.$on('FAST:LANGUAGE:CHANGED', this.changeLanguage);

    this.$eventHub.on('formio.nextPage', data => {
      this.currentPage = data.nextPage.page;
      this.tab = (data.nextPage.page + 1).toString();
      this.currentQuestion = -1;
      window.scrollTo(0, 0);
    });

    this.$eventHub.on('formio.prevPage', data => {
      this.currentPage = data.prevPage.page;
      this.tab = (data.prevPage.page + 1).toString();
      this.currentQuestion = -1;
      window.scrollTo(0, 0);
    });
  */
    Event.listen({
      name: 'FAST:SUBMISSION:CLONE',
      callback: this.clone
    });

    Event.listen({
      name: 'FAST:SUBMISSION:SOFTDELETE',
      callback: this.softDelete
    });
    // document.addEventListener('FAST:SUBMISSION:CANCEL', this.cancel);
    Event.listen({
      name: 'FAST:SUBMISSION:CANCEL',
      callback: this.cancel
    });

    Event.listen({
      name: 'FAST:WIZARD:NEXT',
      callback: this.singleNext
    });

    Event.listen({
      name: 'FAST:WIZARD:PREVIOUS',
      callback: this.singlePrevious
    });
  },
  beforeDestroy() {
    Formio.deregisterPlugin('fast');
    // this.$eventHub.$off('FAST:LANGUAGE:CHANGED', this.changeLanguage);
    Event.remove({
      name: 'FAST:FORMIO:RENDERED',
      callback: this.showWizard
    });

    Event.remove({
      name: 'FAST:SUBMISSION:CANCEL',
      callback: this.cancel
    });
    Event.remove({
      name: 'FAST:SUBMISSION:CHANGED',
      callback: this.draftStatusChanged
    });
    Event.remove({
      name: 'FAST:SUBMISSION:CLONE',
      callback: this.clone
    });
    Event.remove({
      name: 'FAST:SUBMISSION:SOFTDELETE',
      callback: this.softDelete
    });

    Event.remove({
      name: 'FAST:WIZARD:PREVIOUS',
      callback: this.singlePrevious
    });

    Event.remove({
      name: 'FAST:WIZARD:NEXT',
      callback: this.singlePrevious
    });
    // this.$eventHub.$off('VALIDATION_ERRORS');
  },
  asyncData: {
    submission: {
      async get() {
        fullLoading.show(this.$t('Getting the submission. This can take a couple seconds...'));

        let resultSubmission;
        if (this.$route.query && this.$route.query.mode) {
          const submissionId =
            this.$route.params.idSubmission === 'own_unique_from'
              ? Auth.user()._id
              : this.$route.params.idSubmission;
          const loadedSubmission = await this.loadSubmission(submissionId);
          resultSubmission = loadedSubmission.data;
        } else if (this.$route.params.idSubmission) {
          const s = await Submission.local()
            .where('_id', '=', this.$route.params.idSubmission)
            .first();
          resultSubmission = s.data;
        } else {
          resultSubmission = undefined;
        }
        return resultSubmission;
      },
      transform(result) {
        fullLoading.hide();
        return { data: result };
      }
    },
    participants: {
      get() {
        return Submission.getParallelParticipants(
          this.$route.params.idForm,
          this.$route.params.idSubmission
        );
      },
      transform(result) {
        return result;
      }
    },
    form: {
      get() {
        if (this.$route.params.path) {
          return Form.local()
            .where('data.path', '=', this.$route.params.path)
            .first();
        }
        return undefined;
      },
      transform(result) {
        return result.data;
      }
    },
    options: {
      async get() {
        const i18n = (await Translation.local().first()).data;
        const readOnly = !!(['online-review', 'read-only'].indexOf(this.editMode) >= 0);
        return { i18n, readOnly };
      },
      transform(result) {
        return result;
      }
    }
  },
  computed: {
    formTitle() {
      return this.form && this.form && this.form.title ? this.$t(this.form.title) : '';
    },
    participantName() {
      let parallelSurvey = null;
      const submission = this.currentSubmission;
      if (submission && submission.data && submission.data.parallelSurvey) {
        try {
          parallelSurvey = JSON.parse(submission.data.parallelSurvey);
        } catch (e) {
          // eslint-disable-next-line
          parallelSurvey = submission.data.parallelSurvey;
        }
        return parallelSurvey.participantName;
      }
      return '';
    },
    _isWizard() {
      return this.isWizard;
    },
    getFormClass() {
      let className = '';
      if (this.showPages && this._isWizard && !this.$FAST_CONFIG.TAB_MENU) {
        className = 'formNavActive';
      }
      if (!this.saved) {
        className = `${className} saving`;
      }
      return className;
    },
    currentSubmission() {
      if (this.submission && this.submission.data) {
        return this.submission.data;
      }
      return {};
    },
    getFormioClass() {
      if (
        this.form &&
        this.form &&
        this.form.properties &&
        this.form.properties.FAST_WIZARD_CUSTOM_NAVIGATION === 'true'
      ) {
        return 'noNavegation';
      }
      return '';
    }
  },
  data() {
    return {
      formUrl: `${this.$FAST_CONFIG.APP_URL}/${this.$route.params.idForm}`,
      people: [
        {
          name: 'P1'
        }
      ],
      formioToken: Auth.user().x_jwt_token,
      saved: true,
      errors: {},
      isWizard: false,
      pages: [],
      currentPage: 0,
      showPages: this.$FAST_CONFIG.NAVIGATION_OPENED,
      currentQuestion: -1,
      displayUp: false,
      displayDown: true,
      parallelSub: [],
      tab: '1',
      customRender: false,
      customRenderType: '',
      customRenderArray: [],
      changeEvent: null,
      activeSubmission: null,
      FormioInstance: new Formio(this.formUrl),
      RenderedFormInstace: null,
      timeoutId: null,
      editMode: this.$route.query.mode,
      parentPage: this.$route.query.FAST_PARENT_PAGE,
      language: localStorage.getItem('defaultLenguage')
        ? localStorage.getItem('defaultLenguage')
        : 'en'
    };
  },
  methods: {
    getTabIcon(page) {
      const label = this.getLabelForPage(page).toLowerCase();
      if (label === 'scouting') return 'fa fa-binoculars';
      if (label === 'traps') return 'fas fa-archive';
      return 'far fa-file';
    },
    onNextPage(event) {
      this.currentPage = event.page;
      this.tab = (event.page + 1).toString();
      this.currentQuestion = -1;
      window.scrollTo(0, 0);
    },
    onPrevPage(event) {
      this.currentPage = event.page;
      this.tab = (event.page + 1).toString();
      this.currentQuestion = -1;
      window.scrollTo(0, 0);
    },
    changeLanguage(language) {
      this.language = language.code;
    },
    getButtonPosition() {
      let position = 'top-right';
      if (this.$getDirection() === 'pull-right') {
        position = 'top-left';
      }
      return position;
    },
    showWizard(event) {
      this.isWizard = !!event.detail.data.formio.wizard;
    },
    onSubmissionChange(event) {
      if (event.changed) {
        // TODO This is one step behind of the User actions Needs to be fixed
        this.pages = event.changed.instance.root.pages;
        this.isWizard = event.changed.instance.root.wizard;
      }
      if (event.data) {
        this.activeSubmission = event.data;
        this.changeEvent = JSON.stringify(event.data);
      }
      if (this.shouldAutoSave()) {
        this.autoSaveTimer();
      }
    },
    async onFormSubmit() {
      const formSubmission = {
        data: this.activeSubmission,
        draft: false,
        redirect: true,
        trigger: 'formioSubmit',
        syncError: false,
        _id: this.$route.params.idSubmission
      };
      const created = await this.save(formSubmission);
      this.$swal('Saved!', 'Your submission has been saved!', 'success');
      await this.redirectIntended({ submission: formSubmission, created });
    },
    onFormError(event) {
      this.$swal({
        type: 'error',
        title: this.$t('Error'),
        html: `${this.$t('You have errors in the submission')}. <br><strong>${this.$t(
          event[0].component.label
        )}</strong>: <br>${this.$t(event[0].message)}`
      }).then(() => {
        const { id } = event[0].component.id;
        // let element = document.querySelector("[name='data[" + key + "]']")
        document.getElementById(id).scrollIntoView();
        // window.scroll(0, -100);
      });
    },
    cancel() {
      if (document.getElementsByClassName('formio-dialog').length > 0) {
        document.getElementsByClassName('formio-dialog-close pull-right')[0].click();
        return;
      }
      if (document.getElementsByClassName('breadCrumbBackToShow').length > 0) {
        document.getElementsByClassName('breadCrumbBackToShow')[0].click();
        return;
      }
      window.history.back();
    },
    async clone() {
      const parent = this.$route.query.parent
        ? this.$route.query.parent
        : btoa(JSON.stringify('null'));
      const clone = this.activeSubmission ? this.activeSubmission : this.currentSubmission;
      this.$router.push({
        name: 'formio_form_submission',
        params: {
          idForm: this.$route.params.idForm,
          clonedSubmission: clone
        },
        query: {
          parent
        }
      });
    },
    async softDelete() {
      await Submission.remote().softDelete({
        id: this.$route.params.idSubmission,
        formPath: this.$route.params.idForm
      });
      this.cancel();
    },
    showReport() {
      this.$router.push({
        name: 'formio_submission_report',
        params: {
          idForm: this.$route.params.idForm,
          idSubmission: this.$route.params.idSubmission
        }
      });
    },
    async reviewSubmission(revision) {
      let err;
      // eslint-disable-next-line
      const submission = this.submission;

      submission.data.deleted = revision !== 'accept';
      submission._id = this.$route.params.idSubmission;
      this.$swal({
        title: 'Saving...',
        text: this.$t('The information is being saved. This can take a couple seconds...'),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          [err] = await to(
            Form.getModel({ path: this.$route.params.idForm })
              .remote()
              .update(submission)
          );

          if (err) {
            this.$swal.close();
            this.$swal(
              this.$t('Save error'),
              this.$t("You don't have access to modify this submission"),
              'error'
            );
            throw new Error('Submission was not saved');
          }
          this.$swal.close();
          this.$router.push({
            name: 'alldata',
            query: {
              form: this.$route.params.idForm
            }
          });
        }
      });
    },
    async save(formSubmission) {
      const id = this.$route.params.idSubmission;
      if (!id) {
        return;
      }
      // Normal URL
      let path = this.$route.params.idForm;

      // Profile Editing
      if (id === 'own_unique_from') {
        path = this.$route.query.form;
        formSubmission._id = Auth.user()._id;
      }

      if (this.editMode === 'online') {
        // eslint-disable-next-line
        return this.onlineSave(formSubmission, path);
      }

      // eslint-disable-next-line
      return Submission.local().update(formSubmission);
    },
    async saveAsDraft() {
      const formSubmission = {
        data: this.activeSubmission,
        redirect: true,
        draft: true,
        syncError: false,
        trigger: 'saveAsLocalDraft',
        _id: this.$route.params.idSubmission
      };

      const created = await this.save(formSubmission);
      this.$swal(
        'Draft Saved!',
        'Your submission has been saved! You can continue editing later',
        'success'
      );

      await this.redirectIntended({ submission: formSubmission, created });
    },
    autoSaveAsDraft() {
      const formSubmission = {
        data: this.activeSubmission,
        redirect: false,
        draft: true,
        syncError: false,
        trigger: 'autoSaveAsDraft',
        _id: this.$route.params.idSubmission
      };
      return this.save(formSubmission);
    },
    async onlineSave(submission, path) {
      return new Promise((resolve, reject) => {
        this.$swal({
          title: this.$t('Saving...'),
          text: this.$t('The information is being saved. This can take a couple seconds...'),
          showCancelButton: false,
          onOpen: async () => {
            this.$swal.showLoading();
            const [error, updated] = await to(
              Form.getModel({ path })
                .remote()
                .update(submission)
            );

            if (error) {
              // eslint-disable-next-line
              console.log(error);
              const errorString = ErrorFormatter.format({
                errors: error,
                vm: this
              });

              this.$swal({
                title: error.name || error,
                type: 'info',
                html: errorString,
                showCloseButton: true,
                showCancelButton: false,
                confirmButtonText: 'OK'
              });
              reject(error);
            }

            this.$swal.close();
            resolve(updated);
          }
        });
      });
    },
    async redirectIntended({ submission }) {
      if (this.$route.params.idSubmission === 'own_unique_from') {
        if (this.$route.params.idForm === 'resetpassword') {
          await Auth.logOut();
          this.$router.push({
            path: '/login'
          });
          return;
        }
        // If we are editting the profile
        this.$router.push({
          path: '/page/user-profile'
        });
      } else if (this.parentPage) {
        this.$router.push({
          name: this.parentPage
        });
      } else if (this.editMode === 'online-review') {
        this.$router.push({
          name: 'reviewers'
        });
      } else if (
        this.editMode === 'online' ||
        this.editMode === 'read-only' ||
        !this.$FAST_CONFIG.OFFLINE_FIRST
      ) {
        this.$router.push({
          name: 'formio_form_show',
          params: { idForm: this.$route.params.idForm },
          query: { parent: this.$route.query.parent }
        });
      } else if (submission.redirect === true) {
        switch (this.$FAST_CONFIG.SAVE_REDIRECT) {
          case 'dashboard':
            this.$router.push({
              name: 'dashboard'
            });
            return;
          case 'collected':
            this.$router.push({
              name: 'formio_form_show',
              params: {
                idForm: this.$route.params.idForm
              }
            });
            return;
          default:
            this.$router.push({
              name: 'dashboard'
            });
            break;
        }
      }
    },
    goToPage(index) {
      if (
        this.pages[index] &&
        this.pages[index].properties &&
        this.pages[index].properties.FAST_CUSTOM_DG
      ) {
        const dataGridName = this.pages[index].properties.FAST_CUSTOM_DG;
        this.customRenderType = 'datagrid';
        const component = FormioUtils.getComponent(this.form.components, dataGridName);

        const keys = component.components.reduce((r, c) => {
          r[c.key] = '';
          return r;
        }, {});

        this.customRenderArray = this.submission.data.data[dataGridName];
        this.customRenderArray = this.customRenderArray ? this.customRenderArray : [];
        // eslint-disable-next-line
        this.customRenderArray.forEach(a => {
          a = { ...keys, ...a };
        });

        this.customRender = true;
        this.currentPage = index;
        this.tab = (index + 1).toString();
        this.currentQuestion = -1;
        window.scrollTo(0, 0);
        return;
      }

      if (
        this.pages[index] &&
        this.pages[index].properties &&
        this.pages[index].properties.FAST_CUSTOM_SCRIPT
      ) {
        /*
        let scriptName = this.pages[index].properties['FAST_CUSTOM_SCRIPT'];
        this.customRenderType = 'script';
        let component = FormioUtils.getComponent(
          this.form.components,
          scriptName
        );
      */
        this.customRender = true;
        this.currentPage = index;
        this.tab = (index + 1).toString();
        this.currentQuestion = -1;
        window.scrollTo(0, 0);
        return;
      }

      this.customRender = false;
      try {
        const pageNumber = (index + 1).toString();
        const page = document.querySelectorAll(`ul.pagination li:nth-of-type(${pageNumber})`)[0];
        page.click();
        this.currentPage = index;
        this.tab = (index + 1).toString();
        this.currentQuestion = -1;
        window.scrollTo(0, 0);
        if (this.$FAST_CONFIG.NAVIGATION_AUTOCLOSE_ON_SELECTION) {
          this.togglePages();
        }
      } catch (e) {
        this.$swal('Complete the required fields');
      }
    },
    singleNext() {
      const button1 = document.querySelectorAll('.btn-wizard-nav-next')[0];
      button1.click();
    },
    singlePrevious() {
      const button1 = document.querySelectorAll('.btn-wizard-nav-previous')[0];
      button1.click();
    },
    clickNext() {
      this.goToPage(0);
      function setDelay() {
        setTimeout(() => {
          const button1 = document.querySelectorAll('.btn-wizard-nav-next')[0];
          button1.click();
        }, 300);
      }
      // eslint-disable-next-line
      for (let i = 1; i <= 30; ++i) {
        setDelay(i);
      }
    },
    togglePages() {
      this.showPages = !this.showPages;
    },
    reloadPage() {
      this.$swal({
        title: 'Are you sure?',
        text: 'You will lost all unsaved Data',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reload it!'
      }).then(async () => {
        window.location.reload(true);
      });
    },
    nextQuestion() {
      const elements = document.getElementsByClassName('form-group');
      this.currentQuestion =
        this.currentQuestion + 1 >= elements.length ? elements.length : this.currentQuestion + 1;
      this.displayDown = !(this.currentQuestion + 1 >= elements.length);
      elements[this.currentQuestion].scrollIntoView(true);
      this.displayUp = true;
    },
    prevQuestion() {
      const elements = document.getElementsByClassName('form-group');
      this.currentQuestion = this.currentQuestion - 1 <= 0 ? 0 : this.currentQuestion - 1;
      elements[this.currentQuestion].scrollIntoView(true);
      this.displayUp = !(this.currentQuestion <= 0);
      this.displayDown = true;
    },
    openRightDrawer() {
      this.$eventHub.$emit('openRightDrawer');
    },
    draftStatusChanged(e) {
      if (e.detail.data.isSubmit) {
        this.$swal(this.$t('Sent!'), this.$t('Your submission has been sent!'), 'success');
      }
      if (e.detail.data === false) {
        this.saved = false;
      } else {
        this.saved = true;
      }
    },
    async addSurvey() {
      const wizard = await ParallelSurvey.createWizard({
        submission: this.currentSubmission,
        vm: this
      });

      this.$swal.setDefaults({
        input: 'text',
        confirmButtonText: `${this.$t('next')}&rarr;`,
        showCancelButton: true,
        progressSteps: wizard.progressSteps
      });

      this.$swal.queue(wizard.steps).then(async result => {
        this.$swal.resetDefaults();

        const surveyData = await ParallelSurvey.createNewSurvey({
          submission: this.currentSubmission,
          vm: this,
          info: result
        });

        const created = await ParallelSurvey.storeNewSurvey({
          vm: this,
          survey: surveyData
        });
        this.$router.push({
          name: 'formio_submission_update',
          params: {
            idForm: this.$route.params.idForm,
            idSubmission: created._id
          }
        });
      });
    },
    async groupConfig() {
      const groupId = _get(
        Submission.local().getParallelSurvey(this.currentSubmission),
        'groupId',
        undefined
      );

      const options = await Submission.local().getGroups(this.$route.params.idForm);
      const customOptions = {};
      options.forEach(option => {
        customOptions[option.groupId] = option.groupName;
      });
      let currentGroup = await Submission.local().getParallelSurvey(this.currentSubmission);
      currentGroup = currentGroup.groupId ? currentGroup.groupId : undefined;
      delete customOptions[currentGroup];

      let steps = [];
      let progressSteps = [];

      if (groupId) {
        progressSteps = ['1'];
        steps = [
          {
            title: this.$t('Change Group'),
            input: 'select',
            inputOptions: customOptions,
            inputPlaceholder: this.$t('Select the destination group'),
            inputValidator: value =>
              new Promise((resolve, reject) => {
                if (value !== '') {
                  resolve();
                } else {
                  const error = new Error(this.$t('You must select a destination group'));
                  reject(error);
                }
              })
          }
        ];
      } else {
        progressSteps = ['1', '2'];
        steps = [
          {
            title: this.$t('Participant Name'),
            text: this.$t('Give the current participant a name'),
            inputValidator: value =>
              new Promise((resolve, reject) => {
                if (value !== '') {
                  resolve();
                } else {
                  const error = new Error(this.$t('The participant name can´t be empty'));
                  reject(error);
                }
              })
          },
          {
            title: 'Select Group',
            input: 'select',
            inputOptions: customOptions,
            inputPlaceholder: this.$t('Select a group to assign'),
            inputValidator: value =>
              new Promise((resolve, reject) => {
                if (value !== '') {
                  resolve();
                } else {
                  const error = new Error(this.$t('You must select a group'));
                  reject(error);
                }
              })
          }
        ];
      }

      this.$swal.setDefaults({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps
      });

      this.$swal.queue(steps).then(async result => {
        this.$swal.resetDefaults();
        await Submission.local().assingToGroup(this.$route.params.idSubmission, result);
        setTimeout(() => {
          window.location.reload(true);
        }, 1500);
      });
    },
    getLabelForPage(page) {
      const label = page.title;
      return label;
    },
    goToSurvey(id) {
      this.$router.push({
        name: 'formio_submission_update',
        params: {
          idForm: this.$route.params.idForm,
          idSubmission: id
        }
      });
    },
    async loadSubmission(_id) {
      this.loading = true;
      let err;
      let submission;
      const formId =
        (this.$route.params.idSubmission === 'own_unique_from' && this.$route.query.form) ||
        this.$route.params.idForm;

      if (_id.indexOf('_local') >= 0) {
        [err, submission] = await to(
          Submission.local()
            .where('_id', '=', _id)
            .first()
        );
      } else {
        [err, submission] = await to(
          Form.getModel({ path: formId })
            .remote()
            .where('_id', '=', _id)
            .first()
        );
      }

      if (err) {
        this.$swal.close();
        this.$swal(
          this.$t('Conexion error'),
          this.$t("We couldn't get the submission from the server"),
          'error'
        );
        throw new Error('Submission was not retreived');
      }

      this.loading = false;
      return submission;
    },
    shouldAutoSave() {
      const draftEnabled = this.$FAST_CONFIG.LOCAL_DRAFT_ENABLED;
      const inDraftModes = ['online', 'online-review', 'read-only'].indexOf(this.editMode) < 0;
      return !!(draftEnabled && inDraftModes);
    },
    autoSaveTimer() {
      this.saved = false;
      // AutoSave functionality
      // If a timer was already started, clear it.
      if (this.timeoutId) clearTimeout(this.timeoutId);

      // Set timer that will save comment when it fires.
      this.timeoutId = setTimeout(async () => {
        await this.autoSaveAsDraft();
        this.saved = true;
      }, 700);
    }
  }
};
</script>
