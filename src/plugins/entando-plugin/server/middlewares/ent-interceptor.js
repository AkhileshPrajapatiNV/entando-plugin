jwt_decode = require("jwt-decode");
axios = require("axios");

/**
 * `ent-interceptor` middleware.
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In ent-interceptor middleware.');
    console.log("END POINT:::", ctx.request.url);
    await next();
    const entandoKcToken = ctx.request.header.enttoken;
    if (entandoKcToken) {
      let decoded = jwt_decode(entandoKcToken);
      // console.log('decoded token :', decoded);
      if (decoded) {
        //Validate the Keycloak token here
        //varify certificate using some jwt lib
        if (!ctx.request.header.authorization) {
          const loginData = {
            email: "akhilesh.prajapati@newvisionsoftware.in",
            password: "Admin@123"
          }
          const { data } = await axios.post(`http://localhost:1337/admin/login`, loginData);
          console.log(data);
        }
      }
    }
  };
};
