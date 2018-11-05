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

export default {
  name: 'PageBuilder',
  async mounted() {
    const editor = grapesjs.init({
      fromElement: true,
      container: '#gjs',
      plugins: [blocksBasic, navbar],
      pluginsOpts: {
        [blocksBasic]: {
          blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'map']
        }
      }
    });

    editor.Panels.getButton('views', 'open-blocks').set('active', true);
  }
};
</script>
