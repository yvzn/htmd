import { Converter } from 'showdown';
import TurndownService from 'turndown';
import { EditorView, basicSetup } from "codemirror"
import { placeholder} from "@codemirror/view"
import { markdown } from "@codemirror/lang-markdown"
import { html } from "@codemirror/lang-html"
import { oneDark } from '@codemirror/theme-one-dark';

import { ClipboardUtils } from './clipboard';

import './style.css';

const navigationLinks = document.querySelectorAll('nav a');

for (let el of navigationLinks) {
  el.addEventListener('click', function (event) {
    for (let link of navigationLinks) {
      link.classList.remove('active');
    }
    event.target.classList.add('active');
  });
}

let htmlDocument = '';
let markdownDocument = '';

let markdownToHtmlConverter = new Converter();
let htmlToMarkdownConverter = new TurndownService();

let htmlEditor, markdownEditor;

document.getElementById('html-link').addEventListener('click', function () {
  syncDocumentWithEditor();

  if (markdownDocument) {
    htmlDocument = markdownToHtmlConverter.makeHtml(markdownDocument);
  }

  htmlEditor = new EditorView({
    extensions: [basicSetup, html(), oneDark, EditorView.lineWrapping, placeholder('Start typing HTML here...')],
    parent: document.getElementById('html'),
  })

  let transaction = htmlEditor.state.update({ changes: { from: 0, insert: htmlDocument } })
  htmlEditor.dispatch(transaction);

});


document.getElementById('markdown-link').addEventListener('click', function () {
  syncDocumentWithEditor();

  if (htmlDocument) {
    markdownDocument = htmlToMarkdownConverter.turndown(htmlDocument);
  }

  markdownEditor = new EditorView({
    extensions: [basicSetup, markdown(), oneDark, EditorView.lineWrapping, placeholder('Start typing markdown here...')],
    parent: document.getElementById('markdown'),
  })
  let transaction = markdownEditor.state.update({ changes: { from: 0, insert: markdownDocument } })
  markdownEditor.dispatch(transaction)

});

let previewDocument = document.getElementById('preview').attachShadow({ mode: 'open'});
let previewStyle = document.createElement("style");
previewStyle.textContent = `a { color: gray }`;

document.getElementById('preview-link').addEventListener('click', function () {
  let finalHtml;
  if (htmlEditor) {
    finalHtml = htmlEditor.state.doc.toString();
  } else {
    finalHtml = markdownToHtmlConverter.makeHtml(markdownEditor.state.doc.toString());
  }

  previewDocument.innerHTML = finalHtml;
  previewDocument.appendChild(previewStyle);
});

document.getElementById('image-button').addEventListener('click', function () {
  syncDocumentWithEditor();

  var image = document.getElementById('image-tag');
  var errorMessage = document.getElementById('image-error');
  var textarea = document.getElementById('image-document');

  [image, errorMessage, textarea].map(el => el.style.display = 'none');

  ClipboardUtils.readImage(function (data, error) {
    if (error) {
      console.error(error);
      errorMessage.style.display = 'block';
      errorMessage.innerHTML = error.message;
      return;
    }
    if (data) {
      image.src = data;
      image.style.display = 'block';
      textarea.value = `![Alt text](${data})`;
      textarea.style.display = 'block';
      errorMessage.innerHTML = '';
      return;
    }
    errorMessage.style.display = 'block';
    errorMessage.innerHTML =
      'No image available in the clipboard - copy it manually...';
  });
});

document
  .getElementById('image-document')
  .addEventListener('click', function (event) {
    event.target.select();
  });

function syncDocumentWithEditor() {
  if (htmlEditor) {
    markdownDocument = '';
    htmlDocument = htmlEditor.state.doc.toString();
    htmlEditor.destroy();
    htmlEditor = undefined;
  }

  if (markdownEditor) {
    htmlDocument = '';
    markdownDocument = markdownEditor.state.doc.toString();
    markdownEditor.destroy();
    markdownEditor = undefined;
  }
}