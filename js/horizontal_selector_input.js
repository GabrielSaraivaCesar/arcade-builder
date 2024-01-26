class HorizontalSelectorInput extends HTMLElement {
    options = [];
    value = null;

    constructor() {
        super();
    }

    connectedCallback() {
        const options = this.querySelectorAll('option');
        options.forEach(option => {
            this.options.push({value: option.value, label: option.innerText.trim()});
        })

        // Add HTML structure
        this.innerHTML = `
            <div class="horizontal-selector-input">
                <!-- Options will be dynamically added here -->
            </div>
        `;

        // Add options to the selector
        this.addOptions();
        this.selectOption(this.getAttribute('value'))
    }

    addOptions() {
        const container = this.querySelector('.horizontal-selector-input');

        this.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('horizontal-selector-input-option');
            optionElement.setAttribute('data-value', option.value);
            optionElement.textContent = option.label;
            optionElement.onclick = () => {
                this.selectOption(option.value);
                const event = new Event('change');
                this.dispatchEvent(event);
            };

            container.appendChild(optionElement);
        });
    }

    selectOption(optionValue) {
        this.value = optionValue;
        const options = this.querySelectorAll('.horizontal-selector-input-option');

        options.forEach(optionElement => {
            if (optionElement.getAttribute('data-value') === optionValue) {
                optionElement.classList.add('selected');
            } else {
                optionElement.classList.remove('selected');
            }
        });
    }
}

customElements.define('horizontal-selector-input', HorizontalSelectorInput);
