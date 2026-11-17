(() => {
  'use strict';

  // ── Element Selectors ──────────────────────────────────────────────
  const form = document.getElementById('applicationForm');
  if (!form) return;

  const steps = [...form.querySelectorAll('.form-step')];
  const count = document.getElementById('stepCount');
  const bar = document.getElementById('progressBar');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const errorBox = document.getElementById('formError');
  const successBox = document.getElementById('formSuccess');
  const successSummary = document.getElementById('successSummary');

  let currentStep = 0;

  // ── Multi-Step Form Navigation ────────────────────────────────────
  function showStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));

    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStep);
    });

    if (count) {
      count.textContent = `${String(currentStep + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
    }

    if (bar) {
      const percentage = ((currentStep + 1) / steps.length) * 100;
      bar.style.width = `${percentage}%`;
    }

    if (prevBtn) prevBtn.disabled = currentStep === 0;
    if (nextBtn) nextBtn.hidden = currentStep === steps.length - 1;
    if (submitBtn) submitBtn.hidden = currentStep !== steps.length - 1;
    if (errorBox) errorBox.textContent = '';
  }

  function validateCurrentStep() {
    const activeStep = steps[currentStep];
    const inputs = [...activeStep.querySelectorAll('input, select')];

    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        if (errorBox) {
          errorBox.textContent = 'Please complete all required fields correctly to proceed with your candidacy.';
        }
        return false;
      }
    }

    if (errorBox) errorBox.textContent = '';
    return true;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateCurrentStep()) {
        showStep(currentStep + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showStep(currentStep - 1);
    });
  }

  // ── Form Submission (Executive Lead Capture) ──────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const formData = new FormData(form);
    const firstName = formData.get('firstName') || 'Executive';
    const lastName = formData.get('lastName') || '';
    const jobTitle = formData.get('jobTitle') || 'Leader';
    const org = formData.get('organization') || 'your organization';
    const country = formData.get('gccCountry') || 'the GCC';
    const domain = formData.get('researchDomain') || 'Executive Business Administration';

    if (successSummary) {
      successSummary.innerHTML = `
        Thank you, <strong>${firstName} ${lastName}</strong> (${jobTitle} at ${org}).<br>
        Your doctoral candidacy enquiry for the <strong>Doctorate in Business Administration (DBA)</strong> representing <strong>${country}</strong> has been received.<br><br>
        Our Senior Doctoral Admissions Committee will reach out to you within 24 hours to coordinate your confidential advisory session regarding the <strong>${domain}</strong> research cluster and provide the complete DBA curriculum syllabus.
      `;
    }

    form.hidden = true;
    if (successBox) successBox.hidden = false;
  });

  // ── Hero Visual Mini-Phases Click Interactivity ───────────────────
  const heroMiniPhases = document.querySelectorAll('.mini-phase');
  heroMiniPhases.forEach((phase, index) => {
    phase.addEventListener('click', () => {
      heroMiniPhases.forEach(p => p.classList.remove('active'));
      phase.classList.add('active');

      const archSection = document.getElementById('architecture');
      if (archSection) {
        archSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initialize first step
  showStep(0);

})();
