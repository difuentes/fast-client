import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker';
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css';

// leave the export, even if you don't use it
export default ({ Vue }) => {
  // see docs for available options
  const datepickerOptions = {};

  // make sure we can use it in our components
  Vue.use(AirbnbStyleDatepicker, datepickerOptions);
};
