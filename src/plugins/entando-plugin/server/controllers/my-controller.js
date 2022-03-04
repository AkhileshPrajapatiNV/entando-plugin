'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('entando-plugin')
      .service('myService')
      .getWelcomeMessage();
  },
};
