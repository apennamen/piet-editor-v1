import { LitElement, html, css } from 'lit';

export class PietBoardOptions extends LitElement {

    static get styles() {
        return css`
          :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-left: 2em;
          }
        `;
      }
    firstUpdated() {
        this.renderRoot.querySelector('#show-grid').checked = true;
    }

    _toggleGrid(e) {
        const options = {bubbles: true, composed: true, detail: {showGrid: e.target.checked}};
        const event = new CustomEvent('togglegrid', options);
        this.dispatchEvent(event);
    }

    _updateWidth() {
        const widhtInput = this.renderRoot.querySelector('#grid-width-input');

        const options = {bubbles: true, composed: true, detail: {width: widhtInput.value}};
        const event = new CustomEvent('updwidth', options);
        this.dispatchEvent(event);
    }

    _updateHeight() {
        const heightInput = this.renderRoot.querySelector('#grid-height-input');

        const options = {bubbles: true, composed: true, detail: {height: heightInput.value}};
        const event = new CustomEvent('updheight', options);
        this.dispatchEvent(event);
    }

    _updateCodelSize() {
        const codelSize = this.renderRoot.querySelector('#codel-size');

        const options = {bubbles: true, composed: true, detail: {codelSize: codelSize.value}};
        const event = new CustomEvent('updcodelsize', options);
        this.dispatchEvent(event);
    }

    render() {
        return html`
            <div>
                <input id="show-grid" type="checkbox" @change="${this._toggleGrid}"/>
                <label for="show-grid">Show Grid</label>
            </div>
            <br>
            <p>
               <strong>WARNING</strong><br> Following params reinit grid
            </p>
            <label for="grid-width-input">Grid Width (codel)</label>
            <div>
                <input id="grid-width-input" type="number" value="20"/>
                <button @click="${this._updateWidth}">Ok</button>
            </div>
            <br>
            
            <label for="grid-height-input">Grid Height (codel)</label>
            <div>
                <input id="grid-height-input" type="number" value="20"/>
                <button @click="${this._updateHeight}">Ok</button>
            </div>
            <br>
            <label for="codel-size">Codel Size (px)</label>
            <div>
                <input id="codel-size" type="number" min="5" value="30"/>
                <button @click="${this._updateCodelSize}">Ok</button>
            </div>
        `;
    }
}
