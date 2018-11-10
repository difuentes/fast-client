<template>
  <div>
    <div
      class="initials"
    >{{`${userProfile.name} ${userProfile.surname}`.split(" ").map((n)=>n[0]).join("")}}</div>
    <div style="margin-top: 20px;">
      <h3 style="color: #fff;">{{userProfile.name}} {{userProfile.surname}}</h3>
    </div>
    <div style="text-align: center;">
      <QBtn @click.native="toProfile()" class="btn-sm btn-primary-inverted">{{ $t('Edit Profile') }}</QBtn>
    </div>
  </div>
</template>

<script>
import { Auth } from 'fast-fastjs';

export default {
  name: 'ProfileInfo',
  data() {
    return {
      userProfile: {
        name: ''
      }
    };
  },
  asyncData: {
    userProfile: {
      async get() {
        const result = await Auth.user();
        return result;
      },
      transform({ data }) {
        return data;
      }
    }
  }
};
</script>
