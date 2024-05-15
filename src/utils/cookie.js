export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

export function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

export function doesCookieExist(cookieName) {
  var cookies = document.cookie.split('; ');

  for (var i = 0; i < cookies.length; i++) {
    var cookieParts = cookies[i].split('=');
    var currentCookieName = cookieParts[0].trim();
    if (currentCookieName === cookieName) {
      return true;
    }
  }
  return false;
}