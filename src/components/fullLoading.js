import { Loading, QSpinnerPuff } from 'quasar';

export default (() => {
  const show = message => {
    Loading.show({
      spinner: QSpinnerPuff,
      message,
      messageColor: 'grey-6',
      spinnerSize: 150, // in pixels
      spinnerColor: 'green',
      customClass: 'bg-white'
    });
  };
  const hide = () => {
    Loading.hide();
  };
  return Object.freeze({ show, hide });
})();
