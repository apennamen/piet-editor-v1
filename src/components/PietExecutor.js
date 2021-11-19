import { LitElement, html, css } from 'lit';

/**
 * Converts Base64 URL to TypedArray of bytes reprensenting the PNG file
 */
const dataUrlToTypedArray = (dataUrl) => {
    const arr = dataUrl.split(',');
    const bytesString = window.atob(arr[1]);

    const result = new Uint8Array(bytesString.length);

    for (let i = 0; i < bytesString.length; i++) {
        result[i] = bytesString.charCodeAt(i);
    }

    return result;
}

export class PietExecutor extends LitElement {

    static properties = {
        data: {attribute:false},
        _trace: {state: true},
    }

    constructor() {
        super();
        this.data = '';
        this._trace = '';
    }

    updated(changedProperties) {
        if (changedProperties.has('data') && this.data) {
            const IMG = dataUrlToTypedArray(this.data);
            const FILE_PATH = '/pietprogram.png';

            // npiet() comes from npiet.js import in index.html
            npiet({
                preRun: [
                    function({ FS }) {
                        const stream = FS.open(FILE_PATH, 'w+');
                        FS.write(stream, IMG, 0, IMG.length);
                        FS.close(stream);
                    }
                ],
                locateFile: function(path, prefix) {
                    return `assets/${path}`;
                },
                arguments: ['-e', '50', '-q', '-tpic', '-cs', '30', FILE_PATH]
            }).then(mod => {
                    const { FS } = mod;
                    const traceFile = FS.readFile('npiet-trace.png', {encoding: 'binary'});
                    const blob = new Blob([traceFile], {'type': 'image/png'});
                    this._trace = URL.createObjectURL(blob); 
            });
        }
    }


    render() {
        return html`
            <div>
                ${
                    !this._trace ?
                        html`<span>See trace result here.</span>` :
                        html`<img src="${this._trace}"/>`
                }
            </div>
        `
    }
}