jwt_decode = require("jwt-decode");
axios = require("axios");

const Keycloak = require("keycloak-verify").default;
require("regenerator-runtime");

/**
* `ent-interceptor` middleware.
*/
module.exports = (config, { strapi }) => {
  const kcConfigObj = {
    realm: 'entando',
    authServerUrl: 'http://192.168.43.3.nip.io'
  }

  return async (ctx, next) => {
    // strapi.log.info('In ent-interceptor middleware.');
    // console.log("END POINT:::", ctx.request.url);
    // console.log("ctx.response:::", ctx.response);
    await next();

    // const entandoKcToken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJoOHVDQjJFbTUxeDdJS0lqSlItM252SW5UeUk3b215SnU4QXMta0RESi1NIn0.eyJleHAiOjE2NDY4OTQyOTQsImlhdCI6MTY0Njg5Mzk5NCwiYXV0aF90aW1lIjoxNjQ2ODkxNDA1LCJqdGkiOiIyYTNhZGYwZC01YjVlLTRlNzMtYjAyOC0yMTM2MDQzYTZhNzAiLCJpc3MiOiJodHRwOi8vMTkyLjE2OC40My4zLm5pcC5pby9hdXRoL3JlYWxtcy9lbnRhbmRvIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjMxYTdjYmVhLWVhNGMtNDEwMS05MzdlLTc2NzRjMTZhMTcxNSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVudGFuZG8td2ViIiwibm9uY2UiOiIzYjZiZmI5MC01MGNiLTQ1Y2YtODNmOC05YzQyYmU0ODNkYTciLCJzZXNzaW9uX3N0YXRlIjoiM2U0YzZjMzAtMGRlMy00ZjcyLWI3YWItYjM0YWJlNGI3ZmQwIiwiYWNyIjoiMCIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vMTkyLjE2OC40My4zLm5pcC5pbyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIn0.YcrsKezF1WHrmFz9jRZ9Ho6149oI12iM9UsDnkBRAFUCh_2oB6vsIFrD260pGWA2Pohc2aKRzyZduCuG8X6izr6Au3nRUJ_Tc-3AnATav4MpJgm56MnnzO6jcMEV9jxVsoIod4jbdujczf-o5_Ng0nifO6d0m6QE9vRCfgTwgKI2caPyFp14M24K4Sthg3XOaGwsErE9SwmFxAJNzfukA6bbR3FUgM0VkWbTrKHnHoMCqpdLKsYA6Y7xvkl58juJ31_4n4JJDsG1ic8s-e3y9eicbttRWp7gIcdHAC8dbHxrMx8RQ_ctSJMX4Tf3pFd4vH6r6E0Z_U79BvjiGYuVIg";
    const entandoKcToken = ctx.request.header.entkctoken;

    if (entandoKcToken && !ctx.request.url.includes('/admin/login')) {
      //Decode the kc token
      let decoded = jwt_decode(entandoKcToken);
      // console.log('Decoded kc token: ', decoded);

      if (decoded) {
        let kcSuccessResponse = null;
        let kcErrorResponse = null;
        //  ------Validate the Keycloak token here, verify certificate using some jwt lib
        const config = { realm: kcConfigObj.realm, authServerUrl: kcConfigObj.authServerUrl };
        const keycloak = Keycloak(config);
        await keycloak.verifyOnline(entandoKcToken)
          .then(user => {
            kcSuccessResponse = user;
          }).catch(e => {
            kcErrorResponse = e;
          });

        if (kcSuccessResponse) {
          
          //Compare decoded and verified token details
          if (decoded.preferred_username === kcSuccessResponse.userName
            && decoded.email_verified === kcSuccessResponse.emailVerified
            && decoded.sub === kcSuccessResponse.id) {
            console.log(kcSuccessResponse.userName, " === keycloak token verified");
            //call login api
          if (!ctx.request.header.authorization || ctx.request.header.authorization === 'null' || ctx.request.header.authorization ===  'undefined') {
              console.log("ctx.request.header.authorization not available ");
              const loginData = {
                email: "kamlesh.bobde@newvisionsoftware.in",
                password: "Admin@123"
              }
              const { data } = await axios.post(`http://localhost:1337/admin/login`, loginData);
              if (ctx.response.body && ctx.response.body.error && ctx.response.body.error.details) {
                ctx.response.body.error.details = { ...ctx.response.body.error.details, "strapiToken": "Bearer " + data.data.token }
              }
            }
          }
        } else if (kcErrorResponse) {
          if (kcErrorResponse.response && kcErrorResponse.response.status === 401 && kcErrorResponse.response.statusText === 'Unauthorized') {
            console.log(kcErrorResponse.response.status, " === kc token status ==== ", kcErrorResponse.response.statusText);
          }
        }
        //  -------------------------
      }
    }
  };
};