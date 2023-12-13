import { Converter } from 'showdown';
import TurndownService from 'turndown';

import { ClipboardUtils } from './clipboard';
import { CustomEditorView } from './custom-editor-view';
import { CustomPreview } from './custom-preview';

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

customElements.define('custom-editor-view', CustomEditorView)
customElements.define('custom-preview', CustomPreview)

document.getElementById('html-link').addEventListener('click', function () {
  if (!editors.html) {
    editors.html = document.createElement('custom-editor-view')
    editors.html.setAttribute('language', 'html')
    editors.html.addEventListener('change', function () { lastModified = 'html' })
    document.getElementById('html').replaceChildren(editors.html);
  }

  if (!lastModified || lastModified === 'html') {
    return;
  }

  const converter = converters[lastModified].to.html
  const originalContent = editors[lastModified].content
  const convertedContent = converter(originalContent)

  editors.html.content = convertedContent
})

document.getElementById('markdown-link').addEventListener('click', function () {
  if (!editors.markdown) {
    editors.markdown = document.createElement('custom-editor-view')
    editors.markdown.setAttribute('language', 'markdown')
    editors.markdown.addEventListener('change', function () { lastModified = 'markdown' })
    document.getElementById('markdown').replaceChildren(editors.markdown);
  }

  if (!lastModified || lastModified === 'markdown') {
    return;
  }

  const converter = converters[lastModified].to.markdown
  const originalContent = editors[lastModified].content
  const convertedContent = converter(originalContent)

  editors.markdown.content = convertedContent
})

document.getElementById('preview-link').addEventListener('click', function () {
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
