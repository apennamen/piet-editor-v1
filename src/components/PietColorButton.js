import { LitElement, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

export class PietColorButton extends LitElement {

    static properties = {
        label: {},
        color: {},
    };

    constructor() {
        super();
        this.label = 'noop';
        this.color = 'white';
    }

    _dispatchColor() {
        const options = {bubbles: true, composed: true, detail: {color: this.color}};
        const event = new CustomEvent('colorselected', options);
        this.dispatchEvent(event);
    }

    render() {
        const style = { backgroundColor: this.color };
        return html`
            <button style="${styleMap(style)}" @click="${this._dispatchColor}">${this.label}</button>
        `;
    }
}
