<template>
  <div class="col-md-4 col-xs-12">
    <QCard>
      <q-item>
        <q-item-side style="margin-right: 10px;">
          <Icon/>
        </q-item-side>
        <q-item-main>
          <q-item-tile label="">
            <h6 class="primary-text">Start Survey</h6>
          </q-item-tile>
          <q-item-tile sublabel>
            <p class="muted-text" style="margin:auto;, line-height: 30px;">Start new trap Survey</p>
          </q-item-tile>
        </q-item-main>
      </q-item>
    </QCard>
  </div>
</template>

<script>
import Icon from './Icon';

export default {
  name: 'Card',
  components: {
    Icon
  }
};
</script>

<style>
</style>
