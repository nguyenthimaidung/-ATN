export function TawkTo(propertyId, key) {
  if (!window) {
    throw new Error('DOM is unavailable');
  }

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();

  const tawk = document.getElementById('tawkId');
  if (tawk) {
    // Prevent TawkTo to create root script if it already exists
    return window.Tawk_API;
  }

  if (!key) {
    throw new Error('Key not provided. Get key from tawk dashboard - Direct Chat Link');
  }

  const script = document.createElement('script');
  script.id = 'tawkId';
  script.async = true;
  script.src = 'https://embed.tawk.to/' + propertyId + '/' + key;
  script.charset = 'UTF-8';
  script.setAttribute('crossorigin', '*');

  const first_script_tag = document.getElementsByTagName('script')[0];
  if (!first_script_tag || !first_script_tag.parentNode) {
    throw new Error('DOM is unavailable');
  }

  first_script_tag.parentNode.insertBefore(script, first_script_tag);
}

export function hideTawkTo() {
  window.Tawk_API && window.Tawk_API.hideWidget && window.Tawk_API.hideWidget();
}

export function showTawkTo() {
  window.Tawk_API && window.Tawk_API.showWidget && window.Tawk_API.showWidget();
}

function deleteCookie(name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export function endTawkToChat() {
  deleteCookie('ss');
  deleteCookie('tawkUUID');
  deleteCookie('__tawkuuid');
  deleteCookie('TawkConnectionTime');
  window.Tawk_API && window.Tawk_API.endChat && window.Tawk_API.endChat();
}
