// // import jwt_decode from 'jwt-decode';

// const window = {
//     entando: {
//         keycloak: {
//             authenticated: true,
//             token: 'dumy_token_klkl_dlsfsfdfs-skjslkdjslklekr9sdklfelrwe98sldkflskdf'
//         }
//     }
// }


// export default function validate(req) {
//     console.log("calling validate --------------");
//         if (window && window.entando && window.entando.keycloak && window.entando.keycloak.authenticated && window.entando.keycloak.token) {
//             console.log('KC token available');
//             const token = window.entando.keycloak.token;
//             console.log('KC token: ', token);
//             const decoded = jwt_decode(token);
//             console.log('decoded token :', decoded);
//             if (decoded) {

//                 const loginData = {
//                     email: "akhilesh.prajapati@newvisionsoftware.in",
//                     password: "Admin@123"
//                 }

//                 const { status, data: { data } } = await postLoginAdmin(loginData);

//                 if (status === 200) {
//                     console.log("Login result:", data);
//                     if (localStorage.getItem('strapiToken')) {
//                         localStorage.removeItem('strapiToken');
//                     }
//                     localStorage.setItem('strapiToken', data.token);
//                 } else {
//                     console.log("Decoded token does not have keycloak token");
//                 }
//             }
//         }
// };


