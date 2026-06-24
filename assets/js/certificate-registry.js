window.EHSP_CERTIFICATE_REGISTRY_URL = 'https://script.google.com/macros/s/AKfycbwY0kcdkuyGV_HoxNj5j3heS40zGAHnYIWHHpw2_oHlaS8mXzelZlcgbEaMCsfMsdHeMg/exec';

window.EHSPRegistry = {
  jsonp: function(params) {
    return new Promise(function(resolve, reject) {
      if (!window.EHSP_CERTIFICATE_REGISTRY_URL) {
        resolve({ success: false, status: 'missing_registry_url' });
        return;
      }

      const callbackName = 'ehspRegistryCallback_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      const url = new URL(window.EHSP_CERTIFICATE_REGISTRY_URL);

      Object.keys(params || {}).forEach(function(key) {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.set(key, String(params[key]));
        }
      });

      url.searchParams.set('callback', callbackName);
      url.searchParams.set('cache', Date.now());

      const script = document.createElement('script');
      const timeout = setTimeout(function() {
        cleanup();
        resolve({ success: false, status: 'registry_timeout' });
      }, 12000);

      function cleanup() {
        clearTimeout(timeout);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        try {
          delete window[callbackName];
        } catch (error) {
          window[callbackName] = undefined;
        }
      }

      window[callbackName] = function(response) {
        cleanup();
        resolve(response);
      };

      script.onerror = function() {
        cleanup();
        reject(new Error('Registry script request failed'));
      };

      script.src = url.toString();
      document.body.appendChild(script);
    });
  },

  registerCertificate: async function(payload) {
    try {
      return await window.EHSPRegistry.jsonp({
        action: 'register',
        certificateId: payload.certificateId,
        learnerName: payload.learnerName,
        email: payload.email,
        course: payload.course,
        module: payload.module,
        score: payload.score,
        total: payload.total,
        passStatus: payload.passStatus,
        issueDate: payload.issueDate,
        submittedAt: payload.submittedAt,
        registrationRef: payload.registrationRef,
        shareUrl: payload.shareUrl,
        status: payload.status,
        notes: payload.notes
      });
    } catch (error) {
      return {
        success: false,
        status: 'submit_failed',
        error: error.message
      };
    }
  },

  verifyCertificate: async function(certificateId) {
    try {
      return await window.EHSPRegistry.jsonp({
        action: 'verify',
        id: certificateId
      });
    } catch (error) {
      return {
        success: false,
        status: 'registry_unavailable',
        error: error.message
      };
    }
  }
};
