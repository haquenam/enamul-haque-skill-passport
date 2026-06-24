function getCertificateIdFromInput(value) {
  const text = String(value || '').trim();
  try {
    const url = new URL(text);
    return url.searchParams.get('id') || text;
  } catch (error) {
    return text;
  }
}

function hasExpectedCertificateFormat(id) {
  return /^EHSP-CSE1-\d{8}-[A-Z0-9]{6,}$/i.test(id);
}

function getLocalCertificateMatch(id) {
  const cert = JSON.parse(localStorage.getItem('ehsp_cse_module_1_certificate') || 'null');
  const result = JSON.parse(localStorage.getItem('ehsp_cse_module_1_result') || 'null');
  const reg = JSON.parse(localStorage.getItem('ehsp_cse_module_1_registration') || 'null');

  if (cert && cert.certificateId && cert.certificateId.toLowerCase() === id.toLowerCase() && result && result.pass && reg) {
    return {
      certificateId: cert.certificateId,
      learnerName: reg.fullName,
      course: 'CSE For Non CSE Students',
      module: 'Module 1 Computer Science Fundamentals',
      score: result.score,
      total: result.total,
      issueDate: cert.issueDate,
      source: 'current browser'
    };
  }

  return null;
}

function setResult(type, title, message, data) {
  const panel = document.getElementById('resultPanel');
  panel.className = 'result-panel show ' + type;

  let details = '';
  if (data) {
    details = '<div class="detail-grid">' +
      '<div class="detail"><span>Certificate ID</span><strong>' + data.certificateId + '</strong></div>' +
      '<div class="detail"><span>Learner</span><strong>' + data.learnerName + '</strong></div>' +
      '<div class="detail"><span>Course</span><strong>' + data.course + '</strong></div>' +
      '<div class="detail"><span>Module</span><strong>' + data.module + '</strong></div>' +
      '<div class="detail"><span>Score</span><strong>' + data.score + ' out of ' + data.total + '</strong></div>' +
      '<div class="detail"><span>Issue Date</span><strong>' + data.issueDate + '</strong></div>' +
      '</div>';
  }

  panel.innerHTML = '<h2>' + title + '</h2><p>' + message + '</p>' + details;
  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function verifyCertificateId(value) {
  const id = getCertificateIdFromInput(value);

  if (!hasExpectedCertificateFormat(id)) {
    setResult('invalid', 'Invalid certificate ID format', 'The ID does not match the expected Skill Passport certificate format.', null);
    return;
  }

  setResult('warn', 'Checking registry', 'Please wait while the certificate registry is checked.', null);

  if (window.EHSPRegistry) {
    const registryResult = await window.EHSPRegistry.verifyCertificate(id);

    if (registryResult && registryResult.success && registryResult.status === 'found') {
      setResult('valid', 'Certificate verified', 'This certificate was found in the central registry.', {
        certificateId: registryResult.certificateId,
        learnerName: registryResult.learnerName,
        course: registryResult.course,
        module: registryResult.module,
        score: registryResult.score,
        total: registryResult.total,
        issueDate: registryResult.issueDate
      });
      return;
    }

    if (registryResult && registryResult.success && registryResult.status === 'not_found') {
      const localMatch = getLocalCertificateMatch(id);
      if (localMatch) {
        setResult('valid', 'Certificate confirmed locally', 'This certificate was found in the current browser. It has not yet appeared in the central registry.', localMatch);
        return;
      }

      setResult('warn', 'Not found in central registry', 'The certificate ID format is valid, but no matching central registry record was found.', null);
      return;
    }
  }

  const localMatch = getLocalCertificateMatch(id);
  if (localMatch) {
    setResult('valid', 'Certificate confirmed locally', 'This certificate was found in the current browser. Registry checking was not available.', localMatch);
    return;
  }

  setResult('warn', 'Registry unavailable', 'The certificate ID format is valid, but the central registry could not be reached from this browser.', null);
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('checkForm');
  const input = document.getElementById('certificateInput');
  const clearBtn = document.getElementById('clearBtn');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    verifyCertificateId(input.value);
  });

  clearBtn.addEventListener('click', function () {
    input.value = '';
    const panel = document.getElementById('resultPanel');
    panel.className = 'result-panel';
    panel.innerHTML = '';
  });

  const urlId = new URLSearchParams(window.location.search).get('id');
  if (urlId) {
    input.value = urlId;
    verifyCertificateId(urlId);
  }
});
