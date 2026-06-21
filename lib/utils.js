export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export function formatPrice(price) {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export function calculateDiscount(price, salePrice) {
    if (!salePrice) return 0;
    return Math.round(((price - salePrice) / price) * 100);
}

export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

/**
 * 🖼️ Dynamic Image Resolver
 * Handles local vs production URLs and prefixes relative paths from the backend.
 */
export function resolveImageUrl(src, placeholder = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1200") {
    if (!src || typeof src !== 'string') return placeholder;

    let imageUrl = src;

    // 1. Handle relative paths from backend (e.g., /uploads/...)
    if (imageUrl.startsWith('/uploads/')) {
        let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && baseUrl.includes('localhost')) {
            baseUrl = 'https://store-backend-neon.vercel.app';
        }

        // Clean up base URL (remove trailing slash and /api suffix if present)
        baseUrl = baseUrl.replace(/\/$/, '').replace(/\/api$/, '');

        imageUrl = `${baseUrl}${imageUrl}`;
    }

    // 2. Handle legacy localhost URLs in the production database
    if (process.env.NODE_ENV === 'production' && imageUrl.includes('localhost:5000')) {
        imageUrl = imageUrl.replace(/https?:\/\/localhost:5000/, process.env.NEXT_PUBLIC_API_URL || 'https://store-backend-neon.vercel.app');
    }

    return imageUrl;
}

export function cleanRichText(content) {
    if (!content) return '';

    // 🖋️ Detect and Convert Delta JSON (from Mobile App)
    if (typeof content === 'string' && (content.trim().startsWith('[') || content.trim().startsWith('{'))) {
        try {
            const ops = JSON.parse(content);
            const delta = Array.isArray(ops) ? ops : (ops.ops || []);

            return delta.map(op => {
                if (typeof op.insert === 'string') {
                    let text = op.insert.replace(/\n/g, '<br/>');
                    if (op.attributes) {
                        if (op.attributes.bold) text = `<strong>${text}</strong>`;
                        if (op.attributes.italic) text = `<em>${text}</em>`;
                        if (op.attributes.underline) text = `<u>${text}</u>`;
                        if (op.attributes.link) text = `<a href="${op.attributes.link}" target="_blank" rel="noopener noreferrer" class="underline text-inherit">${text}</a>`;
                    }
                    return text;
                }
                return '';
            }).join('');
        } catch (e) {
            console.error("Storefront RichText Parse Error:", e);
        }
    }

    return content.replace(/&nbsp;/g, ' ').trim();
}

/**
 * 🧹 stripHtml: Removes tags AND decodes entities for plain-text previews
 * Also handles Quill Delta JSON format
 */
export function stripHtml(html) {
    if (!html) return '';

    // 🖋️ Detect and Convert Delta JSON (from Mobile App) first
    if (typeof html === 'string' && (html.trim().startsWith('[') || html.trim().startsWith('{'))) {
        try {
            const ops = JSON.parse(html);
            const delta = Array.isArray(ops) ? ops : (ops.ops || []);

            // Extract just the text content without formatting
            html = delta.map(op => {
                if (typeof op.insert === 'string') {
                    return op.insert.replace(/\n/g, ' ');
                }
                return '';
            }).join('');
        } catch (e) {
            // If JSON parse fails, continue with regular HTML stripping
        }
    }

    // Remove HTML tags
    let text = html.replace(/<[^>]*>?/gm, '');

    // Decode common HTML entities
    const entities = {
        '&nbsp;': ' ',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&rsquo;': "'",
        '&lsquo;': "'",
        '&ldquo;': '"',
        '&rdquo;': '"'
    };

    Object.keys(entities).forEach(entity => {
        text = text.replace(new RegExp(entity, 'g'), entities[entity]);
    });

    return text.trim();
}
