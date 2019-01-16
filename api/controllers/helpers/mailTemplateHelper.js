'use strict';

/**
 * 
 * @param {*} sec_code 
 */
var securityCode = function (sec_code) {

    const footer = getFooter();

    const subject = 'Código de seguridad para restablecer contraseña';
    const html =
        `
        Ha solicitado un nuevo código de seguridad, debido a que olvidó su contraseña.
        <br>
        El código es: <b>${sec_code}</b>
        ` + footer.html;
    const text =
        `
        Ha solicitado un nuevo código de seguridad, debido a que olvidó su contraseña.
        \r\n
        El código es: ${sec_code}
        ` + footer.html;

    return {
        subject: subject,
        html: html.trim(),
        text: text.trim()
    }
}


/**
 * Return footer
 */
function getFooter() {
    const html =
        `
        <br/><br/>
        CinemaReel
        `;
    const text =
        `
        \r\n\r\n
        CinemaReel
        `;
    return {
        html: html,
        text: text
    }
}

module.exports = {
    securityCode: securityCode
}
