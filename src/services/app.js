import md5 from 'js-md5';
import base64 from 'base-64';

// TODO TEST!
export const checkPassword = (checkPassword,password) => {
    const salt = password.substr(0,password.length-32),
        genPassword = password.substr(-32),
        genCPassword = md5(salt + checkPassword)

    return genPassword === genCPassword;
}

export const getAuth = (login,password) => base64.encode(`${login}:${password}`)
