window.EHSP_CERTIFICATE_REGISTRY_URL = 'https://script.google.com/macros/s/AKfycbwY0kcdkuyGV_HoxNj5j3heS40zGAHnYIWHHpw2_oHlaS8mXzelZlcgbEaMCsfMsdHeMg/exec';

window.EHSPRegistry = {
  registerCertificate: async function(payload) {
    if (!window.EHSP_CERTIFICATE_REGISTRY_URL) {
      return { success: false, status: 'missing_registry_url' };
    }

    try {
      await fetch(window.EHSP_CERTIFICATE_REGISTRY_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        status: 'submitted'
      };
    } catch (error) {
      return {
        success: false,
        status: 'submit_failed',
        error: error.message
      };
    }
  },

  verifyCertificate: async function(certificateId) {
    if (!window.EHSP_CERTIFICATE_REGISTRY_URL) {
      return { success: false, status: 'missing_registry_url' };
    }

    const url = window.EHSP_CERTIFICATE_REGISTRY_URL + '?id=' + encodeURIComponent(certificateId) + '&cache=' + Date.now();

    try {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store'
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        status: 'registry_unavailable',
        error: error.message
      };
    }
  }
};
