<template>
  <div>
    <div id="gjs"></div>
  </div>
</template>
<script>
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import blocksBasic from 'grapesjs-blocks-basic';
import navbar from 'grapesjs-navbar';
import FluentGrapes from 'fluent-grapesjs';

export default {
  name: 'PageBuilder',
  async mounted() {
    const editor = grapesjs.init({
      fromElement: true,
      container: '#gjs',
      plugins: [blocksBasic, navbar, FluentGrapes],
      pluginsOpts: {
        [blocksBasic]: {
          blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'map']
        },
        [FluentGrapes]: {
          pageId: this.$route.params.id
        }
      },
      storageManager: { type: 'fluent-grapesjs' }
    });

    editor.Panels.getButton('views', 'open-blocks').set('active', true);
  }
};
</script>
