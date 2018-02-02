// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: true,
    moviesApiUrl: 'https://movb9.loylty.com/V1/Support/',
    crmUrl: 'http://192.168.250.222:9081/crm',
    citiesAPIUrl: 'https://comb9.loylty.com/V1/GetCities',
    rbacUrl: 'https://mgtb9.loylty.com/User/V1/',
    merchandiseUrl: 'https://mgtb9.loylty.com/Merchandise/V1/',
    appName: 'MERCHANDISE',
    hmacCliendId: 'lvbportal',
    hmacClientSecret: 'secret',
    domainName: 'localhost',
    timeOut: 30000,
    crm: {
        itemsPerPage: 10,
    }
};
