import { LitElement, html, css } from 'lit';

export class PietTraceImg extends LitElement {
    static properties = {
        trace: {},
    }

    constructor() {
        super();
        this.trace = '';
    }

    render() {
        if (this.trace) return html`<img src="${this.trace}"/>`;

        return html`<span>See trace result here.</span>`;
    }
}