import { LitElement, html, css } from 'lit';

export class PietActionBar extends LitElement {
    _triggerGeneration() {
        const options = {bubbles: true, composed: true};
        const event = new CustomEvent('generate', options);
        this.dispatchEvent(event);
    }
    
    render() {
        return html`
            <div><button @click="${this._triggerGeneration}">Generate</button></div>
        `;
    }
}
