document.addEventListener('DOMContentLoaded', () => {
  const rulesContainer = document.getElementById('rules-container');
  const addRuleBtn = document.getElementById('add-rule-btn');
  const clearRulesBtn = document.getElementById('clear-rules-btn');
  const swapRulesBtn = document.getElementById('swap-rules-btn');
  const inputText = document.getElementById('input-text');
  const outputTextView = document.getElementById('output-text-view');
  const charCurrent = document.getElementById('char-current');
  const outputCharCurrent = document.getElementById('output-char-current');
  const inputCharContainer = document.getElementById('input-char-container');
  const outputCharContainer = document.getElementById('output-char-container');
  const clearInputBtn = document.getElementById('clear-input-btn');
  const copyOutputBtn = document.getElementById('copy-output-btn');
  const toggleRulesBtn = document.getElementById('toggle-rules-btn');
  const rulesWrapper = document.getElementById('rules-wrapper');

  // Rules Toggle Logic
  toggleRulesBtn.addEventListener('click', () => {
    const isCollapsed = rulesWrapper.classList.toggle('collapsed');
    toggleRulesBtn.textContent = isCollapsed ? '규칙 보기' : '규칙 숨기기';
  });

  // Initial setup for existing rows
  setupRowListeners();

  // Copy output text (Strip HTML by using innerText)
  copyOutputBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputTextView.innerText)
      .then(() => {
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
    const inputLen = inputText.value.length;
    const outputLen = outputTextView.innerText.length;
    const limit = 10000;

    charCurrent.textContent = inputLen.toLocaleString();
    outputCharCurrent.textContent = outputLen.toLocaleString();

    // Input styling
    if (inputLen > limit) {
      inputCharContainer.classList.add('limit-exceeded');
      inputText.classList.add('limit-exceeded');
    } else {
      inputCharContainer.classList.remove('limit-exceeded');
      inputText.classList.remove('limit-exceeded');
    }

    // Output styling
    if (outputLen > limit) {
      outputCharContainer.classList.add('limit-exceeded');
      outputTextView.classList.add('limit-exceeded');
    } else {
      outputCharContainer.classList.remove('limit-exceeded');
      outputTextView.classList.remove('limit-exceeded');
    }
  }

  function processText() {
    let rawText = inputText.value;
    const rows = document.querySelectorAll('.rule-row');
    
    // To prevent nested span issues, we escape HTML and then replace
    let processedHtml = escapeHtml(rawText);

    rows.forEach((row, index) => {
      const target = row.querySelector('.target-input').value;
      const replacement = row.querySelector('.replacement-input').value;
      const colorClass = `hl-${index % 6}`;

      if (target) {
        const escapedTarget = escapeRegExp(escapeHtml(target));
        const regex = new RegExp(escapedTarget, 'g');
        const highlightedReplacement = `<span class="${colorClass}">${escapeHtml(replacement)}</span>`;
        processedHtml = processedHtml.replace(regex, highlightedReplacement);
      }
    });

    outputTextView.innerHTML = processedHtml;
    updateCharCount();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
