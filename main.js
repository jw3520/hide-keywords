document.addEventListener('DOMContentLoaded', () => {
  const rulesContainer = document.getElementById('rules-container');
  const addRuleBtn = document.getElementById('add-rule-btn');
  const clearRulesBtn = document.getElementById('clear-rules-btn');
  const swapRulesBtn = document.getElementById('swap-rules-btn');
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const charCurrent = document.getElementById('char-current');
  const outputCharCurrent = document.getElementById('output-char-current');
  const inputCharContainer = document.getElementById('input-char-container');
  const outputCharContainer = document.getElementById('output-char-container');
  const clearInputBtn = document.getElementById('clear-input-btn');
  const copyOutputBtn = document.getElementById('copy-output-btn');

  // ... (existing code)

  function updateCharCount() {
    const inputLen = inputText.value.length;
    const outputLen = outputText.value.length;
    const limit = 10000;

    charCurrent.textContent = inputLen.toLocaleString();
    outputCharCurrent.textContent = outputLen.toLocaleString();

    // Input limit styling
    if (inputLen > limit) {
      inputCharContainer.classList.add('limit-exceeded');
    } else {
      inputCharContainer.classList.remove('limit-exceeded');
    }

    // Output limit styling
    if (outputLen > limit) {
      outputCharContainer.classList.add('limit-exceeded');
    } else {
      outputCharContainer.classList.remove('limit-exceeded');
    }
  }

  function processText() {
    let text = inputText.value;
    const rows = document.querySelectorAll('.rule-row');

    rows.forEach(row => {
      const target = row.querySelector('.target-input').value;
      const replacement = row.querySelector('.replacement-input').value;

      if (target) {
        text = text.replaceAll(target, replacement);
      }
    });

    outputText.value = text;
    updateCharCount();
  }

  function setupRowListeners(rowElement = null) {
    const targetInputs = rowElement
      ? [rowElement.querySelector('.target-input')]
      : document.querySelectorAll('.target-input');

    targetInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const row = e.target.closest('.rule-row');
        const index = parseInt(row.dataset.index, 10);
        const replacementInput = row.querySelector('.replacement-input');

        if (e.target.value.trim() !== '' && replacementInput.value === '') {
          const char = String.fromCharCode(65 + index); // A, B, C...
          replacementInput.value = char.repeat(4);
        }

        processText();
      });
    });

    const replacementInputs = rowElement
      ? [rowElement.querySelector('.replacement-input')]
      : document.querySelectorAll('.replacement-input');

    replacementInputs.forEach(input => {
      input.addEventListener('input', processText);
    });
  }
});
