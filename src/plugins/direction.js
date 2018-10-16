import { Event } from 'fast-fastjs';

// leave the export, even if you don't use it
export default ({ Vue }) => {
  Vue.prototype.$toggleLeftDrawer = () => {
    Event.emit({ name: 'FAST:LEFTDRAWER:TOGGLE', data: {}, text: 'Left Drawer toggled' });
  };
};
