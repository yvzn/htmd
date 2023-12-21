import { Converter } from 'showdown';
import TurndownService from 'turndown';

export const converters = {
    html: {
        to: {
            html: noConversionRequied,
            markdown: htmlToMarkdown
        }
    },
    markdown: {
        to: {
            html: markdownToHtml,
            markdown: noConversionRequied
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

function noConversionRequied(x) {
    return x;
}