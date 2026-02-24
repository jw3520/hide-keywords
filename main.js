document.addEventListener('DOMContentLoaded', () => {
  const rulesContainer = document.getElementById('rules-container');
  const addRuleBtn = document.getElementById('add-rule-btn');
  const clearRulesBtn = document.getElementById('clear-rules-btn');
  const swapRulesBtn = document.getElementById('swap-rules-btn');
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const charCurrent = document.getElementById('char-current');
  const outputCharCount = document.getElementById('output-char-count');
  const clearInputBtn = document.getElementById('clear-input-btn');
  const copyOutputBtn = document.getElementById('copy-output-btn');

  // Initial setup for existing rows
  setupRowListeners();

  // Copy output text
  copyOutputBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputText.value)
      .then(() => {
        // Optional: Provide feedback (like changing the icon or a toast message)
        const originalIcon = copyOutputBtn.innerHTML;
        copyOutputBtn.innerHTML = '<i class="material-icons">check</i>';
        showToast('내용이 복사되었습니다.');
        setTimeout(() => {
          copyOutputBtn.innerHTML = originalIcon;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  });

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger reflow to apply transition
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Add new rule row
  addRuleBtn.addEventListener('click', () => {
    const rowCount = rulesContainer.children.length;
    const newRow = document.createElement('div');
    newRow.classList.add('rule-row');
    newRow.dataset.index = rowCount;
    newRow.innerHTML = `
      <input type="text" class="target-input" placeholder="바꿀 키워드">
      <span class="arrow">→</span>
      <input type="text" class="replacement-input" placeholder="바뀔 키워드">
    `;
    rulesContainer.appendChild(newRow);
    setupRowListeners(newRow);
  });

  // Clear all rules
  clearRulesBtn.addEventListener('click', () => {
    const rows = document.querySelectorAll('.rule-row');
    rows.forEach(row => {
      row.querySelector('.target-input').value = '';
      row.querySelector('.replacement-input').value = '';
    });
    processText();
  });

  // Swap all rules
  swapRulesBtn.addEventListener('click', () => {
    const rows = document.querySelectorAll('.rule-row');
    rows.forEach(row => {
      const targetInput = row.querySelector('.target-input');
      const replacementInput = row.querySelector('.replacement-input');
      const temp = targetInput.value;
      targetInput.value = replacementInput.value;
      replacementInput.value = temp;
    });
    processText();
    showToast('키워드가 스왑되었습니다.');
  });

  // Clear input text
  clearInputBtn.addEventListener('click', () => {
    inputText.value = '';
    processText();
    updateCharCount();
  });

  // Input text processing
  inputText.addEventListener('input', () => {
    updateCharCount();
    processText();
  });

  function updateCharCount() {
    charCurrent.textContent = inputText.value.length;
    outputCharCount.textContent = outputText.value.length;
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
