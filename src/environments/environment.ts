// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    moviesApiUrl: 'http://192.168.61.203/LRAS.MovieAPI/Support/',
    apiUrl: 'http://192.168.250.224:8080',
    crmUrl: 'http://192.168.250.222:9081/crm',
    loginUrl: 'http://localhost:4300/',
    usersUrl: 'http://192.168.250.222:8088',
    customersAPIUrl: 'http://192.168.250.232:8310',
    rbacUrl: 'http://192.168.61.203/LRAS.Brix.InternalUserManagementAPI/',
    merchandiseUrl: 'http://192.168.61.202/LRAS.MerchandiseSupportAPI_V1/',
    sellerApiUrl: 'http://192.168.61.202/LRAS.MerchandiseSupportAPI_V1/',
    masterApiUrl: '',
    storeApiUrl: '',
    appName: 'MERCHANDISE',
    hmacCliendId: 'lvbportal',
    hmacClientSecret: 'secret',
    moduleId: '825362de-db45-11e7-960e-00155dc90735',
    domainName: 'localhost',
    timeOut: 30000,
    crm: {
        itemsPerPage: 10,
    }
};
