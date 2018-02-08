// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    moviesApiUrl: 'http://192.168.61.203/LRAS.MovieAPI/Support/',
    crmUrl: 'http://192.168.250.222:9081/crm',
    citiesAPIUrl: 'http://192.168.61.203/LRAS.CommonAPI/GetCities',
    rbacUrl: 'http://192.168.61.203/LRAS.Brix.InternalUserManagementAPI/',
    merchandiseUrl: 'http://192.168.61.203/LRAS.MerchandiseSupportAPI/',
    programAPIUrl: 'http://192.168.61.203/LRAS.CommonAPI/GetAllPrograms',
    appName: 'MERCHANDISE',
    hmacCliendId: 'portalinternal',
    hmacClientSecret: 'secret',
    domainName: 'localhost',
    timeOut: 30000,
    crm: {
        itemsPerPage: 10,
    }
};
