export const RegEx = {
    Numbers: /^[0-9]/,
    Email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
    phoneNumber: /^[789]\d{9}$/,
    zipCode: /^[1-9][0-9]{5}$/,
    websiteUrl: /^(http|https):+/,
    latLong: /^[+-]?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/,
    starRating: /^[0-5]{0,1}$/,
    onlyNumber: /^\d+$/,
    gstIn: /\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}/
};