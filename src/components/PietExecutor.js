import { LitElement, html, css } from 'lit';
import npiet from '../npiet/npiet-min-es6';

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

/**
 * Converts typedArray representing a PNG file to a Base64 URL
 */
const typedArrayToDataUrl = (typedArray) => {
    const blob = new Blob([typedArray], {'type': 'image/png'});
    return URL.createObjectURL(blob);
}

const readFile = (FS, path) => {
    const stream = FS.open(path, 'r');
    const { size } = FS.stat(path);
    const buffer = new Uint8Array(size);

    FS.read(stream, buffer, 0, size, 0);
    FS.close(stream);

    return buffer;
}

const writeFile = (FS, path) => {
    
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

            npiet({
                preRun: [
                    function({ FS }) {
                        const stream = FS.open(FILE_PATH, 'w+');
                        FS.write(stream, IMG, 0, IMG.length);
                        FS.close(stream);
                    }
                ],
                arguments: ['-e', '50', '-q', '-tpic', '-cs', '30', FILE_PATH]
            }).then(mod => {
                    const { FS } = mod;
                    const tracePNG = readFile(FS, 'npiet-trace.png');
                    const traceURL = typedArrayToDataUrl(tracePNG);

                    const options = {bubbles: true, composed: true, detail: {traceURL}};
                    const event = new CustomEvent('trace', options);
                    this.dispatchEvent(event);
            });
        }
    }


    render() {
        return html`
            <div>
                <p>Parameters !</p>
            </div>
        `
    }
}