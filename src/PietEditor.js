import { LitElement, html, css } from 'lit';

export class PietEditor extends LitElement {

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
        background-color: var(--piet-editor-background-color);
      }

      main {
        flex-grow: 1;
      }
    `;
  }

  static properties = {
    _currentColor: {state: true},
    _showGrid: {state: true},
    _resultImg: {state: true},
  }

  constructor() {
    super();
    this._currentColor = '#FFFFFF';
    this._showGrid = true;
    this._resultImg = null;
  }

  _changeSelectedColor(e) {
    this._currentColor = e.detail.color;
  }

  _toggleGrid(e) {
    this._showGrid = e.detail.showGrid;

    const board = this.renderRoot.querySelector('#board');
    board.showGrid = this._showGrid;
  }

  _generateResult() {
    const board = this.renderRoot.querySelector('#board');

    this._resultImg = board.dataUrl;
  }

  render() {
    return html`
      <main>
        <piet-action-bar @generate="${this._generateResult}"></piet-action-bar>
        <div style="display: flex;">
          <piet-board
            id="board"
            color="${this._currentColor}"
          >
          </piet-board>
          <piet-board-options
            @togglegrid="${this._toggleGrid}"
          >
          </piet-board-options>
        </div>
        <piet-color-picker
          @colorselected="${this._changeSelectedColor}"
        >
        </piet-color-picker>
        ${this._resultImg ? html`<img src="${this._resultImg}" />` : null}
      </main>
    `;
  }
}
