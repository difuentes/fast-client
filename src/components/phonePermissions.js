const phonePermissions = (() => {
  function check(requestedElement) {
    if (
      typeof cordova !== 'undefined' &&
      cordova &&
      cordova.plugins &&
      cordova.plugins.permissions
    ) {
      // eslint-disable-next-line
      const permissions = cordova.plugins.permissions;
      // Check for Camara access
      permissions.checkPermission(
        permissions[requestedElement],
        status => {
          if (status.hasPermission) {
            // console.log(requestedElement + ' is ready');
          } else {
            console.warn(`${requestedElement} is not allowed, requesting access`);
            permissions.requestPermission(
              permissions[requestedElement],
              stat => {
                if (!stat.hasPermission) {
                  console.warn(`${requestedElement} Access was not granted!`);
                }
              },
              null
            );
          }
        },
        null
      );
    }
  }

  function get() {
    check('ACCESS_COARSE_LOCATION');
    // check('CAMARA');
  }
  return Object.freeze({
    get
  });
})();
export default phonePermissions;
