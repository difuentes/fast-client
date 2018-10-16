<template>
    <div class="container-fluid col-lg-offset-1 col-lg-10" v-bind:key="$route.path" style="padding-bottom:50px" >

    <hr style="border-top: 1px solid lightgray;">

    <actioncards style="margin-top:50px" :page="forms" v-bind:key="$route.path"></actioncards>

  </div>
</template>

<script>
import actioncards from '../../../components/actionCards';
import { Form, Auth, Submission } from 'fast-fastjs';
import moment from 'moment';

export default {
  name: 'CollectedData',
  components: {
    actioncards
  },
  asyncData: {
    forms: {
      async get() {
        const action = this.$route.name === 'CollectedData' ? 'list' : 'create';
        const result = await Form.cardFormattedForms(action);

        if (result.cards.length === 1) {
          this.redirectTo(result.cards[0].actions[0]);
        }
        return result;
      },
      transform(result) {
        return JSON.stringify(result);
      }
    }
  },
  methods: {
    redirectTo(action) {
      if (action.path) {
        const name = action.view === 'list' ? 'formio_form_show' : 'formio_form_submission';
        if (name === 'formio_form_submission') {
          this.goToCreateView(action.path);
        } else {
          const to = {
            name,
            params: { path: action.path }
          };
          this.$router.push(to);
        }
      }
    },
    // TODO Function is duplicated on the SHOW view, we must
    // refactor this
    async goToCreateView(formPath) {
      const date = moment().unix();
      const formSubmission = {
        data: {},
        draft: true,
        sync: false,
        trigger: 'createLocalDraft',
        user_email: Auth.email(),
        path: formPath,
        baseUrl: this.$FAST_CONFIG.APP_URL,
        created: date,
        modified: date
      };

      const submission = await Submission.local().insert(formSubmission);

      const route = {
        name: 'formio_submission_update',
        params: {
          idForm: formPath,
          idSubmission: submission._id
        },
        query: {
          parent: this.$route.query.parent
        }
      };
      this.$router.push(route);
    }
  },
  data() {
    return {
      pageName: this.$route.name === 'CollectedData' ? 'Collected Data' : 'New Survey'
    };
  }
};
</script>
