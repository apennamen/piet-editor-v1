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

      #editor-container {
        display: flex;
      }

      #executor-container {
        display: flex;
        flex-direction: row;
      }

      #sider {
        margin-left: 1em;
        width: 350px;
      }

      main {
        flex-grow: 1;
      }

      hr {
        border: 0;
        border-top: 1px dashed #1a2b42;
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
    this._resultImg = null;
  }

  _changeSelectedColor(e) {
    const board = this.renderRoot.querySelector('#board');
    board.color = e.detail.color;
  }

  _toggleGrid(e) {
    const board = this.renderRoot.querySelector('#board');
    board.showGrid = e.detail.showGrid;
  }

  _generateResult() {
    const board = this.renderRoot.querySelector('#board');
    this._resultImg = board.dataUrl;
  }

  _executeProgram() {
    const board = this.renderRoot.querySelector('#board');
    this._resultImg = board.dataUrl;

    const executor = this.renderRoot.querySelector('#executor');
    // hack to force execution even if data has not changed.
    executor.data = '';
    executor.data = board.dataUrl;
  }

  _updateCodelSize(e) {
    const board = this.renderRoot.querySelector('#board');
    board.codelSize = +e.detail.codelSize;
  }

  _updateGridWidth(e) {
    const board = this.renderRoot.querySelector('#board');
    board.width = +e.detail.width * board.codelSize;
  }

  _updateGridHeight(e) {
    const board = this.renderRoot.querySelector('#board');
    board.height = +e.detail.height * board.codelSize;
  }

  render() {
    return html`
      <main>
        <h1>Editor</h1>
        <piet-action-bar
          @generate="${this._generateResult}"
          @execute="${this._executeProgram}"
          >
        </piet-action-bar>
        <div id="editor-container">
          <piet-board
            id="board"
          >
          </piet-board>
          <div id="sider">
            <piet-color-picker
              @colorselected="${this._changeSelectedColor}"
            >
            </piet-color-picker>
            <piet-board-options
              @togglegrid="${this._toggleGrid}"
              @updcodelsize="${this._updateCodelSize}"
              @updwidth="${this._updateGridWidth}"
              @updheight="${this._updateGridHeight}"
            >
            </piet-board-options>
          </div>
        </div>
        <hr/>
        <h1>Executor</h1>
        <div id="executor-container">
          ${this._resultImg ? html`<img src="${this._resultImg}" />` : null}
          <piet-executor id="executor"></piet-executor>
        </div>
        
      </main>
    `;
  }
}
