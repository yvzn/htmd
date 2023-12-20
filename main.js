import { Converter } from 'showdown';
import TurndownService from 'turndown';

import { ClipboardUtils } from './clipboard';
import { CustomEditorView } from './custom-editor-view';
import { CustomPreview } from './custom-preview';

import './style.css';

const navigationTabs = document.querySelectorAll('nav input[name="nav-tab"]');

for (let el of navigationTabs) {
  el.addEventListener('change', function (event) {
    event.target.dispatchEvent(new CustomEvent('switch-tab', { bubbles: true, detail: { sectionId: event.target.value } }))
  });
}

const editors = {
  html: null,
  markdown: null,
}

const converters = {
  html: {
    to: {
      html: x => x,
      markdown: x => new TurndownService().turndown(x)
    }
  },
  markdown: {
    to: {
      html: x => new Converter().makeHtml(x),
      markdown: x => x
    }
  }
}

let lastModified = null
let lastTab = null

customElements.define('custom-editor-view', CustomEditorView)
customElements.define('custom-preview', CustomPreview)

document.addEventListener('switch-tab', function (event) {
  if (lastTab) {
    lastTab.style.display = 'none'
  }
  lastTab = document.getElementById(event.detail.sectionId)
  lastTab.style.display = 'block'

  if (event.detail.sectionId === 'html') {
    showEditor(event.detail.sectionId)
  }
  if (event.detail.sectionId === 'markdown') {
    showEditor(event.detail.sectionId)
  }
  if (event.detail.sectionId === 'preview') {
    showPreview()
  }
})

function showEditor(language) {
  if (!editors[language]) {
    editors[language] = document.createElement('custom-editor-view')
    editors[language].setAttribute('language', language)
    editors[language].addEventListener('change', function () { lastModified = language })
    document.getElementById(language).replaceChildren(editors[language]);
  }

  if (!lastModified || lastModified === language) {
    return;
  }

  const converter = converters[lastModified].to[language]
  const originalContent = editors[lastModified].content
  const convertedContent = converter(originalContent)

  editors[language].content = convertedContent
}

function showPreview() {
  if (!editors.preview) {
    editors.preview = document.createElement('custom-preview')
    document.getElementById('preview').replaceChildren(editors.preview);
  }

  if (!lastModified) {
    return;
  }

  let content = editors[lastModified].content
  if (lastModified !== 'html') {
    const converter = converters[lastModified].to.html
    const originalContent = content
    content = converter(originalContent)
  }

  editors.preview.setAttribute('content', content)
};

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

const darkModeToggle = document.getElementById("dark-mode-toggle");

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  document.body.dispatchEvent(new CustomEvent('toggle-dark-mode'));
}

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  toggleDarkMode();
}

darkModeToggle.addEventListener("click", toggleDarkMode);
