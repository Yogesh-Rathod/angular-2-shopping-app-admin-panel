// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: true,
    moviesApiUrl: 'http://192.168.61.203/LRAS.MovieAPI/Support/',
    crmUrl: 'http://192.168.250.222:9081/crm',
    citiesAPIUrl: 'http://192.168.61.202/LRAS.CommonAPI/V1/GetCities',
    rbacUrl: 'http://192.168.61.203/LRAS.Brix.InternalUserManagementAPI/',
    merchandiseUrl: 'http://192.168.61.203/LRAS.MerchandiseSupportAPI/',
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
