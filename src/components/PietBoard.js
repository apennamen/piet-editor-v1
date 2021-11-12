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
        if (!this.canvas) return null;

        if (this.showGrid) {
            this.hideGrid();
        }
        const result = this.canvas.toDataURL("image/png");
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

    firstUpdated() {
        this.canvas = this.renderRoot.querySelector('#board');
        this.ctx = this.canvas.getContext('2d');

        this.firstPaint();

        this.canvas.addEventListener('mousedown', this.handleClick.bind(this));
        // TODO: handle mousemove event to draw several pixels
        // TODO: handle shift to quickly draw lines
    }

    firstPaint() {
        this.ctx.fillStyle = this.color;
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
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.canvas.removeEventListener('mousedown', this.handleClick.bind(this));
    }

    render() {
        return html`
            <canvas id="board" width="${this.width}" height="${this.height}">
                Your browser does not support canvas.
            </canvas>
        `;
    }
}
