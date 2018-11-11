<template>
  <div class="searchBar">
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
  </div>
</template>
<script>
import moment from 'moment';

export default {
  name: 'SearchBar',
  data() {
    return {
      today: false,
      checkByUsers: false,
      currentDate: moment().format('MMM Do YYYY')
    };
  }
};
</script>
<style scoped>
.searchBar {
  background-clip: border-box;
  background-color: #fff;
  background: #fff;
  border-radius: 0.375rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  bottom: 0;
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  min-width: 0;
  left: 0;
  right: 0;
  position: absolute;
  width: 300px;
  padding: 5px;
  word-wrap: break-word;
  z-index: 3;
}
.q-item-label {
  font-size: 13px;
  font-weight: 400;
  height: 15px;
  letter-spacing: 0.1px;
  line-height: 19.5px;
}
</style>
