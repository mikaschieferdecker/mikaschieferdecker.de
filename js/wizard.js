document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('qualifyForm');
  if (!form) return;

  const steps = [...form.querySelectorAll('.wizard__step')];
  const progressBar = document.getElementById('progressBar');
  const backBtn = document.getElementById('wizBack');
  const nextBtn = document.getElementById('wizNext');
  const submitBtn = document.getElementById('wizSubmit');
  const status = document.getElementById('wizStatus');

  let current = 0;

  function render() {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === current));
    progressBar.style.width = `${((current + 1) / steps.length) * 100}%`;

    const isLast = current === steps.length - 1;
    const hasChoiceCards = steps[current].querySelector('.choice-card');

    backBtn.hidden = current === 0;
    submitBtn.hidden = !isLast;
    nextBtn.hidden = isLast || !!hasChoiceCards;
  }

  function currentStepValid() {
    const inputs = steps[current].querySelectorAll('input[required], textarea[required]');
    for (const input of inputs) {
      if (input.type === 'radio') {
        const group = steps[current].querySelectorAll(`input[name="${input.name}"]`);
        if (![...group].some(r => r.checked)) return false;
      } else if (!input.checkValidity()) {
        input.reportValidity();
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (!currentStepValid()) {
      status.textContent = 'Bitte triff eine Auswahl, bevor du weitergehst.';
      status.className = 'wizard__status is-error';
      return;
    }
    status.textContent = '';
    current = Math.min(current + 1, steps.length - 1);
    render();
  }

  nextBtn.addEventListener('click', goNext);

  backBtn.addEventListener('click', () => {
    current = Math.max(current - 1, 0);
    render();
  });

  form.addEventListener('change', (e) => {
    if (e.target.type === 'radio' && e.target.closest('.choice-card')) {
      setTimeout(() => {
        if (current < steps.length - 1) goNext();
      }, 350);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentStepValid()) return;
    if (form.website.value) return; // Honeypot

    submitBtn.disabled = true;
    status.textContent = 'Wird gesendet …';
    status.className = 'wizard__status';

    try {
      const res = await fetch('contact-handler.php', { method: 'POST', body: new FormData(form) });
      if (!res.ok) throw new Error('Serverfehler');

      status.textContent = 'Danke! Ich melde mich innerhalb von 24 Stunden bei dir.';
      status.className = 'wizard__status is-success';
      form.reset();
      current = 0;
      render();
    } catch (err) {
      status.textContent = 'Es gab ein Problem beim Senden. Bitte versuch es erneut oder schreib mir direkt eine E-Mail.';
      status.className = 'wizard__status is-error';
      submitBtn.disabled = false;
    }
  });

  render();
});
