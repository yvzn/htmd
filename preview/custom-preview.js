export class CustomPreview extends HTMLElement {
    constructor() {
        super()

        const shadowRoot = this.attachShadow({ mode: 'open' });

        let style = document.createElement("style");
        style.textContent = `a { color: gray }`;
        shadowRoot.appendChild(style);

        this.previewContent = document.createElement('div');
        shadowRoot.appendChild(this.previewContent);
    }

    static get observedAttributes() {
        return ["content"];
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        if (name !== "content") return;

        this.previewContent.innerHTML = newValue
    }
}