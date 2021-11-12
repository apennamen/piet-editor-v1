import { LitElement, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';

import { instructionsList, WHITE_INSTR } from '../services/color-instruction-mapper';

export class PietColorPicker extends LitElement {
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
        const style = { backgroundColor: this._selectedInstruction.color.value };
        return html`
            <div style="${styleMap(style)}"><p>${this._selectedInstruction.color.name}</p></div>
            <div>
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
