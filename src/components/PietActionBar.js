import { LitElement, html, css } from 'lit';

export class PietActionBar extends LitElement {
    
    static get styles() {
        return css`
            :host {
                min-height: 2em;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
            }

            button {
                margin-right: 1em;
            }
        `
    }

    _triggerGeneration() {
        const options = {bubbles: true, composed: true};
        const event = new CustomEvent('generate', options);
        this.dispatchEvent(event);
    }

    _triggerExecution() {
        const options = {bubbles: true, composed: true};
        const event = new CustomEvent('execute', options);
        this.dispatchEvent(event);
    }
    
    render() {
        return html`
            <button @click="${this._triggerGeneration}">Generate</button>
            <button @click="${this._triggerExecution}">Execute</button>
        `;
    }
}
