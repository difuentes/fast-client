<template>
  <QCard>
    <QCardTitle>
      <div class="row flex-vertical-align">
        <div class="col-xs-2">
          <Icon/>
        </div>
        <div style="margin-left: 20px;" class="col-xs-9">
          <h6 class="primary-text">Start Survey</h6>
          <p
            class="muted-text"
            style="margin:auto;, line-height: 30px;"
          >Make click on this button to start survey</p>
        </div>
      </div>
    </QCardTitle>
  </QCard>
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
