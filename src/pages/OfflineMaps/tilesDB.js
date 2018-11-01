import { Fluent, Model } from 'fast-fastjs';
// import { Base64 } from 'js-base64';
import b64toBlob from 'b64-to-blob';
import Axios from 'axios';

const model = Fluent.extend(Model, {
  properties: {
    name: 'MapTiles',
    remoteConnection: undefined
  }
})();

export default {
  async getItem(key) {
    const dbItem = await model
      .local()
      .where('key', '=', key)
      .first();

    let item = null;

    if (dbItem) {
      let b64 = dbItem.value;
      b64 = b64.split(':');
      const contentType = b64[1].split(';')[0];
      const content = b64[1].split(';')[1].split(',')[1];
      const blob = b64toBlob(content, contentType);
      item = blob;
    }

    console.log(item);

    return item;
  },
  async saveTiles(tileUrls) {
    const promises = [];

    for (let i = 0; i < tileUrls.length; i += 1) {
      promises[i] = this._getTile(tileUrls[i]);
    }

    return Promise.all(promises);
  },
  async clear() {
    // eslint-disable-next-line
    console.log(await model.local().get());

    return model.local().clear();
  },
  async _getTile(tile) {
    return new Promise((resolve, reject) => {
      Axios.get(tile.url, {
        responseType: 'blob'
      })
        .then(async response => {
          resolve(await this._saveTile(tile.key, response.data));
        })
        .catch(error => {
          reject(
            new Error({
              status: error.status,
              statusText: error.statusText
            })
          );
        });
    });
  },
  async _saveTile(k, value) {
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result;
      await this._removeItem(k);

      return model.local().insert({
        key: k,
        value: base64
      });
    };

    reader.readAsDataURL(value);
  },
  async _removeItem(key) {
    const exists = await model
      .local()
      .where('key', '=', key)
      .first();

    if (exists) {
      return model.local().remove(exists._id);
    }

    return false;
  }
};
