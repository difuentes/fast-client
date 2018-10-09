// // import something here
import { Moment, FAST } from 'fast-fastjs';
import setConf from '../helpers/setConf';

// // leave the export, even if you don't use it
// export default async ({ Vue }) => {
//   Moment.setLocales();

//   const test = setConf();

//   const config = await FAST({ Vue, appConfig: test });

// };

// leave the export, even if you don't use it
export default async ({ Vue }) => {
  Moment.setLocales();
  // const appConf = setConf();
  /*eslint-disable */
  console.log(setConf());
  await FAST.start({ Vue, appConf: setConf() });
};
