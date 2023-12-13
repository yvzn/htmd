import { EditorView, basicSetup } from "codemirror"
import { placeholder } from "@codemirror/view"
import { markdown } from "@codemirror/lang-markdown"
import { html } from "@codemirror/lang-html"
import { oneDark } from '@codemirror/theme-one-dark';

export class CustomEditorView extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        let language = html;
        let tooltip = 'Start typing HTML here...'
        if (this.getAttribute('language') === 'markdown') {
            language = markdown
            tooltip = 'Start typing markdown here...'
        }

        const handleChange = EditorView.updateListener.of((v) => {
            if (v.docChanged) {
                this.dispatchEvent(new CustomEvent('change'));
            }
        })

        this.editorView = new EditorView({
            extensions: [basicSetup, language(), oneDark, EditorView.lineWrapping, placeholder(tooltip), handleChange],
            parent: this,
        });
    }

    get content() {
        return this.editorView.state.doc.toString();
    }

    set content(value) {
        let transaction = this.editorView.state.update({ changes: { from: 0, to: this.editorView.state.doc.length, insert: value } })
        this.editorView.dispatch(transaction)
    }
}