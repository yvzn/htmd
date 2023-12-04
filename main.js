import { Converter } from 'showdown';
import TurndownService from 'turndown';
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

let htmlDocument = document.getElementById('html-document');
let markdownDocument = document.getElementById('markdown-document');
let lastDocument = htmlDocument;


let markdownToHtmlConverter = new Converter();
let htmlToMarkdownConverter = new TurndownService();

document.getElementById('html-link').addEventListener('click', function () {
  let markdown = markdownDocument.value;
  if (!markdown) return;
  let html = markdownToHtmlConverter.makeHtml(markdown);
  htmlDocument.value = html;
  lastDocument = 'html-documenet';
});

function convertToMarkdown() {
  let html = htmlDocument.value;
  let markdown = htmlToMarkdownConverter.turndown(html);
  markdownDocument.value = markdown;
}

document.getElementById('markdown-link').addEventListener('click', function () {
  convertToMarkdown();
  lastDocument = markdownDocument;
});

document.getElementById('preview-link').addEventListener('click', function () {
  if (lastDocument === htmlDocument) {
    convertToMarkdown();
  }
  let markdown = markdownDocument.value;
  if (!markdown) return;
  let html = markdownToHtmlConverter.makeHtml(markdown);
  document.getElementById('preview').innerHTML = html;
});

function pasteImageTo(imageElement, textareaElement) {
  ClipboardUtils.readImage(function (data, error) {
    if (error) {
      console.error(error);
      textareaElement.value = error.message;
      return;
    }
    if (data) {
      imageElement.src = data;
      textareaElement.value = `![Alt text](${data})`;
      return;
    }
    textareaElement.value =
      'Image bitmap is not avaialble - copy it to clipboard.';
  });
}

document.getElementById('image-button').addEventListener('click', function () {
  var image = document.getElementById('image-tag');
  image.style.display = 'block';
  var textarea = document.getElementById('image-document');
  textarea.style.display = 'block';
  pasteImageTo(image, textarea);
});

document
  .getElementById('image-document')
  .addEventListener('click', function (event) {
    event.target.select();
  });
