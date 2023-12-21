import { EditorView, basicSetup } from "codemirror"
import { StreamLanguage } from "@codemirror/language"
import { placeholder } from "@codemirror/view"
import { Compartment } from "@codemirror/state"
import { markdown } from "@codemirror/lang-markdown"
import { html } from "@codemirror/lang-html"
import { oneDark } from '@codemirror/theme-one-dark';
import { asciidoc } from "codemirror-asciidoc"

export class CustomEditorView extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const handleChange = EditorView.updateListener.of((v) => {
            if (v.docChanged) {
                this.dispatchEvent(new CustomEvent('change'));
            }
        })

        // Compartment allows dynamic reconfiguration of an editor.
        // https://codemirror.net/examples/config/#compartments
        let themeCompartment = new Compartment();

        this.editorView = new EditorView({
            extensions: [
                basicSetup,
                this.#language,
                EditorView.lineWrapping,
                placeholder(this.#tooltip),
                handleChange,
                themeCompartment.of(this.#currentTheme)
            ],
            parent: this,
        });

        document.body.addEventListener('toggle-dark-mode', () => {
            let effects = themeCompartment.reconfigure(this.#currentTheme)
            this.editorView.dispatch({
                effects
            })
        });
    }

    get content() {
        return this.editorView.state.doc.toString();
    }

    set content(value) {
        let transaction = this.editorView.state.update({ changes: { from: 0, to: this.editorView.state.doc.length, insert: value } })
        this.editorView.dispatch(transaction)
    }

    get #currentTheme() {
        let theme = EditorView.baseTheme();
        if (document.body.classList.contains('dark')) {
            theme = oneDark;
        }
        return theme;
    }

    get #language() {
        let languageSupport = html;
        if (this.getAttribute('language') === 'markdown') {
            languageSupport = markdown
        }
        if (this.getAttribute('language') === 'asciidoc') {
            languageSupport = () => StreamLanguage.define(asciidoc)
        }
        return languageSupport()
    }

    get #tooltip() {
        let tooltip = 'Start typing HTML here...'
        if (this.getAttribute('language') === 'markdown') {
            tooltip = 'Start typing markdown here...'
        }
        if (this.getAttribute('language') === 'asciidoc') {
            tooltip = 'Start typing Asciidoc here...'
        }
        return tooltip;
    }
}