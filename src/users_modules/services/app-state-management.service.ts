import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie';
import { isUndefined } from 'util';

@Injectable()
export class AppStateManagementService {

    constructor(
        private cookieService: CookieService
    ) { }

    private appStateManagementLSObservables = {};
    private appStateManagementCKObservables = {};

    // LOCAL STORAGE

    private getValueFromLocalStorage(key: string): Promise<string> {
        return new Promise(
            (resolve, reject) => {
                try {
                    resolve(localStorage.getItem(key));
                } catch (reason) {
                    reject(reason);
                }
            }
        );
    }

    private setValueToLocalStorage(key: string, value: string): Promise<string> {
        return new Promise(
            (resolve, reject) => {
                try {
                    localStorage.setItem(key, value);
                    if (localStorage.getItem(key) === value) {
                        resolve(value);
                    }
                } catch (reason) {
                    reject(reason);
                }
            }
        );
    }

    updateAppStateLS(key: string, value: string): Promise<string> {
        return this.setValueToLocalStorage(key, value);
    }

    retrieveAppStateLS(key: string): Promise<string> {
        return this.getValueFromLocalStorage(key);
    }

    retrieveAppStateLS$(key: string): Observable<string> {
        if (this.appStateManagementLSObservables[key]) {
            return this.appStateManagementLSObservables[key];

        } else {
            const observable = new Observable(
                subscriber => {
                    let value;
                    setInterval(
                        () => {
                            try {
                                this.getValueFromLocalStorage(key)
                                    .then(
                                        valueRetrieved => {
                                            if (value !== valueRetrieved) {
                                                subscriber.next(valueRetrieved);
                                                value = valueRetrieved;
                                            }
                                        }
                                        // }
                                    )
                                    .catch(
                                        reason => subscriber.error(reason)
                                    );
                            } catch (reason) {
                                subscriber.error(reason);
                            }
                        },
                        500
                    );
                }
            );

            this.appStateManagementLSObservables[key] = observable;
            return observable;
        }
    }

    clearAppStateLS(): Promise<boolean> {
        return new Promise(
            (resolve, reject) => {
                try {

                    localStorage.clear();
                    setTimeout(
                        () => {
                            if (Object.keys(localStorage).length === 0) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        },
                        1000);
                } catch (reason) {
                    reject(reason);
                }
            }
        );
    }

    clearAppStateLSSingle(key) {
        localStorage.removeItem(key);
    }


    // COOKIES

    private getValueFromCookie(key: string): Promise<string> {
        return new Promise(
            (resolve, reject) => {
                try {
                    const currentValue = this.cookieService.get(key) ? this.cookieService.get(key) : null;
                    resolve(currentValue);
                } catch (reason) {
                    reject(reject);
                }
            }
        );
    }

    private setValueToCookie(key: string, value: string): Promise<string> {
        return new Promise(
            (resolve, reject) => {
                try {
                    this.cookieService.put(key, value);
                    if (this.cookieService.get(key) === value) {
                        resolve(value);
                    }
                } catch (reason) {
                    reject(reason);
                }
            }
        );
    }

    updateAppStateCK(key: string, value: string): Promise<string> {
        return this.setValueToCookie(key, value);
    }

    retrieveAppStateCK(key: string): Promise<string> {
        return this.getValueFromCookie(key);
    }

    retrieveAppStateCK$(key: string): Observable<string> {
        if (this.appStateManagementCKObservables[key]) {
            return this.appStateManagementCKObservables[key];

        } else {
            const observable = new Observable(
                subscriber => {
                    let value;
                    setInterval(
                        () => {
                            try {
                                this.getValueFromCookie(key)
                                    .then(
                                        valueRetrieved => {
                                            // collapse all undefined to null in case of cookies

                                            valueRetrieved = isUndefined(valueRetrieved) ? null : valueRetrieved;

                                            if (value !== valueRetrieved) {
                                                subscriber.next(valueRetrieved);
                                                value = valueRetrieved;
                                            }
                                        }
                                        // }
                                    )
                                    .catch(
                                        reason => subscriber.error(reason)
                                    );
                            } catch (reason) {
                                subscriber.error(reason);
                            }
                        },
                        500
                    );
                }
            );

            this.appStateManagementCKObservables[key] = observable;
            return observable;
        }
    }

    clearAppStateCK(): Promise<boolean> {
        return new Promise(
            (resolve, reject) => {
                try {
                    this.cookieService.removeAll();

                    setTimeout(
                        () => {
                            if (Object.keys(this.cookieService.getAll()).length === 0) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        },
                        1000);
                } catch (reason) {
                    reject(reason);
                }
            }
        );
    }


}
