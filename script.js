// Configurable email constants
const RECIPIENT_EMAIL = 'analomofficial@gmail.com';
const EMAIL_SUBJECT = 'Eimani Recorder Closed Beta Testing';

(function () {
  'use strict';

  const form = document.getElementById('register-form');
  const nicknameInput = document.getElementById('nickname-input');
  const gmailInput = document.getElementById('gmail-input');
  const subjectInput = document.getElementById('subject-input');
  const defaultMessage = document.getElementById('default-message').textContent.trim();
  const errorEl = document.getElementById('register-error');
  const fallbackBox = document.getElementById('fallback-box');
  const gmailWebLink = document.getElementById('gmail-web-link');
  const copyButtons = document.querySelectorAll('.copy-btn');

  // Strict case-insensitive check for name@gmail.com
  const GMAIL_REGEX = /^[a-z0-9._%+-]+@gmail\.com$/i;

  if (subjectInput) {
    subjectInput.value = EMAIL_SUBJECT;
  }

  function isValidGmail(value) {
    if (!value) return false;
    const trimmed = value.trim();
    if (trimmed.startsWith('.') || trimmed.includes('..') || trimmed.includes('.@')) {
      return false;
    }
    return GMAIL_REGEX.test(trimmed);
  }

  function buildEmailBody(nickname, gmailId) {
    return [
      'Hello Analom Studio,',
      '',
      defaultMessage,
      '',
      'Nickname: ' + nickname,
      'My Gmail ID: ' + gmailId,
      '',
      'Thank you!'
    ].join('\r\n');
  }

  function buildMailtoUrl(nickname, gmailId) {
    const body = buildEmailBody(nickname, gmailId);
    return (
      'mailto:' +
      RECIPIENT_EMAIL +
      '?subject=' +
      encodeURIComponent(EMAIL_SUBJECT) +
      '&body=' +
      encodeURIComponent(body)
    );
  }

  function buildGmailWebUrl(nickname, gmailId) {
    const body = buildEmailBody(nickname, gmailId);
    return (
      'https://mail.google.com/mail/?view=cm&fs=1' +
      '&to=' +
      encodeURIComponent(RECIPIENT_EMAIL) +
      '&su=' +
      encodeURIComponent(EMAIL_SUBJECT) +
      '&body=' +
      encodeURIComponent(body)
    );
  }

  function showError(message, inputToFocus) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    if (inputToFocus) {
      inputToFocus.setAttribute('aria-invalid', 'true');
      inputToFocus.focus();
    }
  }

  function clearError() {
    errorEl.textContent = '';
    errorEl.hidden = true;
    if (nicknameInput) nicknameInput.setAttribute('aria-invalid', 'false');
    if (gmailInput) gmailInput.setAttribute('aria-invalid', 'false');
  }

  function resetRegistrationState() {
    clearError();
    fallbackBox.hidden = true;
    gmailWebLink.removeAttribute('href');
  }

  if (form) {
    form.addEventListener('input', resetRegistrationState);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      resetRegistrationState();
      const nickValue = nicknameInput ? nicknameInput.value.trim() : '';
      const gmailValue = gmailInput ? gmailInput.value.trim() : '';

      if (!nickValue) {
        showError('Please enter your nickname.', nicknameInput);
        return;
      }

      if (!gmailValue) {
        showError('Please enter your Gmail address (for example: yourname@gmail.com).', gmailInput);
        return;
      }

      if (!isValidGmail(gmailValue)) {
        showError('Please enter a valid @gmail.com address (for example: yourname@gmail.com).', gmailInput);
        return;
      }

      const mailtoUrl = buildMailtoUrl(nickValue, gmailValue);
      const webUrl = buildGmailWebUrl(nickValue, gmailValue);

      if (gmailWebLink) gmailWebLink.href = webUrl;
      fallbackBox.hidden = false;

      // Trigger mailto link so mobile phones open the Gmail / Email app chooser
      const tempLink = document.createElement('a');
      tempLink.href = mailtoUrl;
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    });
    document.getElementById('register-btn').disabled = false;
  }

  // Copy template buttons with clipboard fallback
  async function copyTextToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Try the fallback if clipboard access is blocked.
      }
    }
    return fallbackCopyText(text);
  }

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }

  copyButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const targetId = button.getAttribute('data-copy-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const originalLabel = button.getAttribute('data-original-label') || button.textContent.trim();
      button.setAttribute('data-original-label', originalLabel);

      copyTextToClipboard(targetEl.textContent).then(function (copied) {
        button.textContent = copied ? 'Copied!' : 'Select text to copy';
        button.classList.toggle('copied', copied);
        setTimeout(function () {
          button.textContent = originalLabel;
          button.classList.remove('copied');
        }, 2000);
      });
    });
  });

  // Smooth scroll-reveal animations using IntersectionObserver
  const animatedTargets = document.querySelectorAll(
    '.req-card, .step-item, .feature-details, .template-card, .rules-card, .register-card, .callout'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
    );

    animatedTargets.forEach(function (el, index) {
      el.classList.add('reveal-on-scroll');
      el.style.transitionDelay = ((index % 3) * 60) + 'ms';
      revealObserver.observe(el);
    });
  }
})();
