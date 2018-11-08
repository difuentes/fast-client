<template>
  <QLayoutDrawer side="right" v-model="showRight">
    <QListHeader>{{$t("Search Panel")}}</QListHeader>
    <QList no-border>
      <QItem>
        <QItemSide>
          <QToggle unchecked-icon="calendar_today" checked-icon="pin_drop" v-model="today"/>
        </QItemSide>
        <QItemMain>
          <QItemTile label="">{{$t("Search by date")}}</QItemTile>
          <QItemTile sublabel>
            <QBtn
              v-if="today"
              disabled
              class="btn-sm btn-primary-outline"
              @click.stop="triggerCalendar"
            >Today, {{currentDate}}</QBtn>
            <QBtn
              v-if="!today"
              class="btn-sm btn-primary"
              @click.stop="triggerCalendar"
              label="Select Date"
            />
          </QItemTile>
        </QItemMain>
      </QItem>
      <QItem>
        <QItemSide>
          <QToggle
            v-model="checkByUsers"
            unchecked-icon="fas fa-male"
            checked-icon="fas fa-globe-africa"
          />
        </QItemSide>
        <QItemMain>
          <QItemTile label="">{{$t("Search by users")}}</QItemTile>
          <QItemTile sublabel>
            <QBtn
              v-if="checkByUsers"
              disabled
              class="btn-sm btn-primary-outline"
              @click.stop="triggerCalendar"
            >Other Users Surveys</QBtn>
            <QBtn
              v-if="!checkByUsers"
              disabled
              class="btn-sm btn-primary-outline"
              @click.stop="triggerCalendar"
              label="My Surveys"
            />
          </QItemTile>
        </QItemMain>
      </QItem>
    </QList>
  </QLayoutDrawer>
</template>
<script>
import moment from 'moment';

export default {
  name: 'MapSearch',
  props: {
    show: Boolean
  },
  data() {
    return {
      showRight: this.show,
      today: false,
      checkByUsers: false,
      currentDate: moment().format('MMM Do YYYY')
    };
  },
  watch: {
    show() {
      this.showRight = this.show;
    }
  }
};
</script>
