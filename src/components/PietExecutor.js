import { LitElement, html, css } from 'lit';


export class PietExecutor extends LitElement {

    firstUpdated() {
        createModule({
            preRun: [
                function(Module) {
                    Module.FS.createPreloadedFile('./assets', 'print_h.png', '/assets/print_h.png', true, false);
                }
            ],
            locateFile: function(path, prefix) {
                return `assets/${path}`;
            },
            arguments: ['assets/print_h.png']
        }).then(mod => {
            console.log('done!');
        });

    }


    render() {
        return html`
            <div><span>I'm the executor.</span></div>
        `
    }
}