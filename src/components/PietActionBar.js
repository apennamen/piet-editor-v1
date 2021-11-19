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

            ::slotted(button) {
                margin-right: 1em;
            }
        `
    }
    
    render() {
        return html`
            <slot></slot>
        `;
    }
}
