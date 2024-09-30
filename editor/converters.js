import { Converter } from 'showdown';
import TurndownService from 'turndown';
import downdoc from 'downdoc';

import { toAsciidoc } from './to-asciidoc';

export const converters = {
    html: {
        to: {
            html: noConversionRequied,
            markdown: htmlToMarkdown,
            asciidoc: htmlToAsciidoc
        }
    },
    markdown: {
        to: {
            html: markdownToHtml,
            markdown: noConversionRequied,
            asciidoc: markdownToAsciidoc
        }
    },
    asciidoc: {
        to: {
            html: asciidocToHtml,
            markdown: asciidocToMarkdown,
            asciidoc: noConversionRequied
        }
    }
}

const converter = new Converter();
function markdownToHtml(markdown) {
    return converter.makeHtml(markdown);
}

const turndownService = new TurndownService();
function htmlToMarkdown(html) {
    return turndownService.turndown(html);
}

function htmlToAsciidoc(html) {
    return toAsciidoc(html)
}

function asciidocToHtml(asciidoc) {
    const markdown = asciidocToMarkdown(asciidoc)
    return markdownToHtml(markdown)
}

function markdownToAsciidoc(markdown) {
    const html = markdownToHtml(markdown);
    return htmlToAsciidoc(html);
}

function asciidocToMarkdown(asciidoc) {
    return downdoc(asciidoc);
}

function noConversionRequied(x) {
    return x;
}