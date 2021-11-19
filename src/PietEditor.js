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

      hr {
        border: 0;
        border-top: 1px dashed #1a2b42;
      }
      
      piet-color-picker {
        display: block;
        width: 350px;
      }

      @media only screen and (max-width: 992px) {
        #editor-container {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
        }

        #executor-container {
          display: flex;
          flex-direction: column;
        }

        #sider {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding-bottom: 1em; 
        }
      }

      @media only screen and (min-width: 992px) {
        #editor-container {
          display: flex;
        }

        #sider {
          margin-right: 1em;
          min-width: 350px;
        }

        #executor-container {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          width: 100%;
        }

        piet-executor {
          grid-column: 1;
        }

        piet-program-img {
          grid-column: 2 / 4;
        }

        piet-trace-img {
          grid-column: 1 / 4;
          padding: auto;
        }
      }
    `;
  }

  static properties = {
    _currentColor: {state: true},
    _showGrid: {state: true},
  }

  constructor() {
    super();
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
    const programImg = this.renderRoot.querySelector('#program-img');
    // hack to force execution even if data has not changed.
    programImg.img = '';
    programImg.img = board.dataUrl;
  }

  _executeProgram() {
    const board = this.renderRoot.querySelector('#board');
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

  _scrollToProgramImg() {
    setTimeout(() => {
      this.renderRoot.querySelector('#program-img')
        .scrollIntoView({ behavior: 'smooth'});
    }, 100);
  }

  _updateTraceImg(e) {
    const traceImg = this.renderRoot.querySelector('#trace-img');
    traceImg.trace = e.detail.traceURL;
  }

  render() {
    return html`
      <main>
        <h1>Editor</h1>
        <piet-action-bar>
            <button @click="${this._generateResult}">Generate</button>
        </piet-action-bar>
        <div id="editor-container">
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
          <piet-board
            id="board"
          >
          </piet-board>
        </div>
        <hr/>
        <h1>Executor</h1>
        <piet-action-bar>
            <button @click="${this._executeProgram}">Execute</button>
        </piet-action-bar>
        <div id="executor-container">
          <piet-executor id="executor" @trace="${this._updateTraceImg}"></piet-executor>
          <piet-program-img id="program-img" img="${this._resultImg}" @newimage="${this._scrollToProgramImg}"></piet-program-img>
          <piet-trace-img id="trace-img"></piet-trace-img>
        </div>
        
      </main>
    `;
  }
}
