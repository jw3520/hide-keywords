document.addEventListener('DOMContentLoaded', () => {
  const rulesContainer = document.getElementById('rules-container');
  const addRuleBtn = document.getElementById('add-rule-btn');
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const charCurrent = document.getElementById('char-current');

  // Initial setup for existing rows
  setupRowListeners();

  // Add new rule row
  addRuleBtn.addEventListener('click', () => {
    const rowCount = rulesContainer.children.length;
    const newRow = document.createElement('div');
    newRow.classList.add('rule-row');
    newRow.dataset.index = rowCount;
    newRow.innerHTML = `
      <input type="text" class="target-input" placeholder="바꿀 문장 (Target)">
      <span class="arrow">→</span>
      <input type="text" class="replacement-input" placeholder="바뀔 문장 (Replacement)">
    `;
    rulesContainer.appendChild(newRow);
    setupRowListeners(newRow);
    // Trigger update in case we want to support empty rules? No, empty rules do nothing.
  });

  // Input text processing
  inputText.addEventListener('input', () => {
    updateCharCount();
    processText();
  });

  function updateCharCount() {
    const len = inputText.value.length;
    charCurrent.textContent = len;
  }

  function processText() {
    let text = inputText.value;
    const rows = document.querySelectorAll('.rule-row');

    rows.forEach(row => {
      const target = row.querySelector('.target-input').value;
      const replacement = row.querySelector('.replacement-input').value;

      if (target) {
        // Global replace of all occurrences using split/join or replaceAll
        // replaceAll is standard in modern browsers
        text = text.replaceAll(target, replacement);
      }
    });

    outputText.value = text;
  }

  function setupRowListeners(rowElement = null) {
    const targetInputs = rowElement 
      ? [rowElement.querySelector('.target-input')] 
      : document.querySelectorAll('.target-input');

    targetInputs.forEach(input => {
      // Avoid adding double listeners if we re-run specific ones, but here we scope or run once.
      // If passing rowElement, we handle just that one.
      
      input.addEventListener('input', (e) => {
        const row = e.target.closest('.rule-row');
        const index = parseInt(row.dataset.index, 10);
        const replacementInput = row.querySelector('.replacement-input');

        // Auto-fill logic
        // Only if replacement is currently empty to avoid overwriting user edits
        if (replacementInput.value === '') {
           if (index === 0 && e.target.value.trim() !== '') {
             replacementInput.value = 'AAAA';
           } else if (index === 1 && e.target.value.trim() !== '') {
             replacementInput.value = 'BBBB';
           }
        }
        
        // Trigger text processing when rules change
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
