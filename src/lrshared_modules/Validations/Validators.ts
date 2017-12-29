export const validators = {
    alphaNumeric: '^[a-zA-Z0-9-_]*$',
    name: "^[a-zA-Z '-]+$",
    mobileNo: '^[789][0-9]{9}$',
    email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$',
    number: '^[0-9]+$',
    usernameOrEmail: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$|^[a-zA-Z0-9.-_]*$',
    password: /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*([^\w\s]|[_]))\S{10,}$/
};
