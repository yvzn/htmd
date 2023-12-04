import { Converter } from 'showdown';
import { ClipboardUtils } from './clipboard';

import './style.css';

for (let el of document.querySelectorAll('nav a')) {
  el.addEventListener('click', function (event) {
    for (let link of document.querySelectorAll('nav a')) {
      link.classList.remove('active');
    }
    event.target.classList.add('active');
  });
}

let htmlDocument = document.getElementById('html-document');
let markdownDocument = document.getElementById('markdown-document');
let lastDocument = htmlDocument;

addEventListener('load', function () {
  document.getElementById('html-link').click();
});

let converter = new Converter();

document.getElementById('html-link').addEventListener('click', function () {
  let markdown = markdownDocument.value;
  if (!markdown) return;
  let html = converter.makeHtml(markdown);
  htmlDocument.value = html;
  lastDocument = 'html-documenet';
});

function convertToMarkdown() {
  let html = htmlDocument.value;
  let markdown = converter.makeMarkdown(html);
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
  let html = converter.makeHtml(markdown);
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
