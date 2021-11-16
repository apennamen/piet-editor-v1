import { LitElement, html, css } from 'lit';

export class PietProgramImg extends LitElement {

    static properties = {
        img: {attribute: false},
    }

    constructor() {
        super();
        this.img = '';
    }

    updated(changedProperties) {
        if (changedProperties.has('img') && !!this.img) {
            const options = {bubbles: true, composed: true};
            const event = new CustomEvent('newimage', options);
            this.dispatchEvent(event);
        }
    }

    render() {
        if (!this.img) return null;

        return html`
            <a download="piet.png" href="${this.img}">
                <img src="${this.img}" title="download"/>
            </a>
        `;
    }
}