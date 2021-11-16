import { LitElement, html, css } from 'lit';

const DEFAULT_CODEL_SIZE = 30;
const DEFAULT_WIDTH = DEFAULT_CODEL_SIZE * 20;
const DEFAULT_HEIGHT = DEFAULT_CODEL_SIZE * 20;
const DEFAULT_COLOR = '#FFFFFF';

const computeCursorPosition = ({ clientX, clientY }, { left, top }) => ({
    x: clientX - left,
    y: clientY - top,
});

export class PietBoard extends LitElement {
    static get styles() {
        return css`    
          canvas {
            border: 1px solid black;
          }
        `;
    }

    static properties = {
        width: {type: Number},
        height: {type: Number},
        codelSize: {type: Number},
        showGrid: {type: Boolean, reflect: true},
        color: {},
        dataUrl: {attribute:false},
    }

    get dataUrl() {
        if (!this.canvas) return '';

        if (this.showGrid) {
            this.hideGrid();
        }
        // We need to create a copy otherwise aliasing creep into PNG
        const canvas = document.createElement("canvas");
        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;

        const context = canvas.getContext('2d');
        const imgData = this.cleanCanvas();
        context.putImageData(imgData, 0, 0);

        const result = canvas.toDataURL("image/png");

        if (this.showGrid) {
            this.paintGrid();
        }
        return result;
    }

    constructor() {
        super();
        this.width = DEFAULT_WIDTH;
        this.height = DEFAULT_HEIGHT;
        this.codelSize = DEFAULT_CODEL_SIZE;
        this.showGrid = true;
        this.color = DEFAULT_COLOR;
    }

    /**
     * Clean pixels of the displayed canvas
     * @returns new imgData with no variations in pixel colors
     */
    cleanCanvas() {
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imgData.data;
        // Prevent aliasing
        for(let i = 0; i <  data.length; i+=4) {
            data[i] = this.normalizeColor(data[i]); // R
            data[i+1] = this.normalizeColor(data[i+1]) // G
            data[i+2] = this.normalizeColor(data[i+2]) // B
            data[i+3] = 255; // A
        }
        return imgData;
    }

    normalizeColor(color) {
        if (color < 100) return 0;
        if (color > 230) return 255;
        return 192;
    }

    initBoard() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.showGrid ? this.paintGrid() : null;
    }

    paintGrid() {
        if (!this.ctx) return;

        this.ctx.fillStyle = 'black';
        for (let x = 0; x < this.width; x += this.codelSize) {
            for (let y = 0; y < this.height; y += this.codelSize) {
                this.ctx.strokeRect(x, y, this.codelSize, this.codelSize);
            }
        }
    }

    hideGrid() {
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        for (let x = 0; x < this.width; x += this.codelSize) {
            for (let y = 0; y < this.height; y += this.codelSize) {
                // We use the pixel at the center of the codel to determine its color
                const centerX = Math.floor(x + this.codelSize / 2);
                const centerY = Math.floor(y + this.codelSize / 2);
                this.ctx.fillStyle = this.getPixelColor({x: centerX, y: centerY}, imgData);
                this.ctx.fillRect(x, y, this.codelSize, this.codelSize);
            }
        }
    }

    handleClick(event) {
        const cursor = computeCursorPosition(event, this.canvas.getBoundingClientRect());

        const { xCodel, yCodel } = this.computeCodelPosition(cursor);

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(xCodel, yCodel, this.codelSize, this.codelSize);

        if (this.showGrid) {
            this.ctx.fillStyle = 'black';
            this.ctx.strokeRect(xCodel, yCodel, this.codelSize, this.codelSize);
        }
    }

    
    computeCodelPosition({ x, y }) {
        return {
            xCodel: Math.floor(x / this.codelSize) * this.codelSize,
            yCodel: Math.floor(y / this.codelSize) * this.codelSize,
        }
    }

    getPixelColor({x, y}, imgData) {
        const index = (y * imgData.width + x) * 4;

        const red = imgData.data[index];
        const green = imgData.data[index+1];
        const blue = imgData.data[index+2];

        return `rgb(${red}, ${green}, ${blue})`;
    }

    willUpdate(changedProperties) {
        if (changedProperties.has('showGrid')) {
            if (this.showGrid) {
                this.paintGrid();
            } else {
                this.hideGrid();
            }
        }

        if (changedProperties.has('codelSize')) {
            const oldCodelSize = +changedProperties.get('codelSize');
            if (!!oldCodelSize) {
                const codelWidth = this.width / oldCodelSize;
                const codelHeight = this.height / oldCodelSize;
                this.width = this.codelSize * codelWidth;
                this.height = this.codelSize * codelHeight;
            }
        }
    }

    updated(changedProperties) {
        if (changedProperties.has('codelSize')
        || changedProperties.has('width')
        || changedProperties.has('height')) {
            this.canvas = this.renderRoot.querySelector('#board');
            this.ctx = this.canvas.getContext('2d');

            this.initBoard();
        }
    }

    render() {
        return html`
            <canvas id="board"
                @mousedown="${this.handleClick}"
                width="${this.width}"
                height="${this.height}"
            >
                Your browser does not support canvas.
            </canvas>
        `;
    }
}
