export function registerCustomBlots(Quill) {
    if (!Quill) return;

    const Block = Quill.import('blots/block');

    class StyledQuoteBlot extends Block {
        static create(value) {
            const node = super.create();
            node.setAttribute('class', 'styled-quote-block text-[#1a1a2e] border-l-4 border-[#1a1a2e] pl-6 my-8 font-serif italic text-xl leading-relaxed');

            if (value && typeof value === 'object') {
                Object.keys(value).forEach(key => {
                    node.style[key] = value[key];
                });
                node.setAttribute('data-quote-style', JSON.stringify(value));
            }
            return node;
        }

        static formats(node) {
            if (node.hasAttribute('data-quote-style')) {
                try {
                    return JSON.parse(node.getAttribute('data-quote-style'));
                } catch (e) {
                    return true;
                }
            }
            return true;
        }
    }

    StyledQuoteBlot.blotName = 'styled-quote';
    StyledQuoteBlot.tagName = 'blockquote';
    StyledQuoteBlot.className = 'styled-quote-block';

    Quill.register(StyledQuoteBlot, true);
}
