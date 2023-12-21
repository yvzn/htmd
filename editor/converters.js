import { Converter } from 'showdown';
import TurndownService from 'turndown';
import asciidoctor from 'asciidoctor';

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

const Asciidoctor = asciidoctor()
function asciidocToHtml(asciidoc) {
    const document = Asciidoctor.convert(asciidoc, { standalone: true })
    const start = document.indexOf('>', document.indexOf('<body'))
    const end = document.indexOf('<div id="footer')
    return document.substring(start + 1, end)
}

function markdownToAsciidoc(markdown) {
    const html = markdownToHtml(markdown);
    return htmlToAsciidoc(html);
}

function asciidocToMarkdown(asciidoc) {
    const html = asciidocToHtml(asciidoc);
    return htmlToMarkdown(html);
}

function noConversionRequied(x) {
    return x;
}