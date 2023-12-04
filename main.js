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


document.getElementById('image-button').addEventListener('click', function () {
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
