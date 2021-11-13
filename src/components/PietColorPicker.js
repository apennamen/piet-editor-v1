import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';

import { instructionsList, WHITE_INSTR } from '../services/color-instruction-mapper';

export class PietColorPicker extends LitElement {

    static get styles() {
        return css`
          #colors {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
          }

          piet-color-button {
              padding-top: 1em;
          }
        `;
    }

    static properties = {
        _selectedInstruction: {state: true},
    }

    constructor() {
        super();
        this._selectedInstruction = WHITE_INSTR;
    }

    _changeSelectedInstruction(instruction) {
        this._selectedInstruction = instruction;
    }

    render() {
        const style = {
            backgroundColor: this._selectedInstruction.color.value,
            padding: '1em',
            border: '1px solid black',
        };
        return html`
            <h2>Color Palette</h2>
            <div style="${styleMap(style)}">
                <span>Selected: ${this._selectedInstruction.color.name}</span>
            </div>
            <div id="colors">
                ${repeat(instructionsList(this._selectedInstruction),
                        (instruction) => instruction.label,
                        (instruction) => html`
                    <piet-color-button
                        label="${instruction.label}"
                        color="${instruction.color.value}"
                        @colorselected="${() => this._changeSelectedInstruction(instruction)}"
                    >
                    </piet-color-button>
                `)}
            </div>
        `;
    }
}
