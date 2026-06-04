module.exports = {

    validateUser : async (params) => {

    const usernameRegex =
    /^[a-zA-Z0-9_]{3,20}$/;

    const fullNameRegex =
    /^[A-Za-z ]{3,50}$/;

    // const emailRegex =
    // /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if(!usernameRegex.test(params.username))
        throw new Error('Invalid username');

    if(!fullNameRegex.test(params.fullname))
        throw new Error('Invalid full name');

    // if(!emailRegex.test(email))
        // throw new Error('Invalid email');

    if(!passwordRegex.test(params.password))
        throw new Error('Weak password');

    return true;
}
};
