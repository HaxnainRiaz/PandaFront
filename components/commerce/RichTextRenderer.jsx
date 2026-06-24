"use client";

import { getApiBaseUrl } from "@/lib/apiConfig";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.bubble.css"; // Bubble theme is cleaner for rendering

const ReactQuill = dynamic(async () => {
    const { default: RQ } = await import("react-quill-new");
    const { registerCustomBlots } = await import("@/lib/quill-custom-blots");
    registerCustomBlots(RQ.Quill);
    return RQ;
}, { ssr: false });

export default function RichTextRenderer({ content, className = "" }) {
    const [value, setValue] = useState("");

    useEffect(() => {
        if (!content) {
            setValue("");
            return;
        }

        // Detect Delta JSON
        if (typeof content === 'string' && (content.trim().startsWith('[') || content.trim().startsWith('{'))) {
            try {
                const parsed = JSON.parse(content);
                let delta = Array.isArray(parsed) ? parsed : (parsed.ops || []);

                // 🌉 Resolve internal image paths in Delta
                const cleanApiUrl = getApiBaseUrl();

                delta = delta.map(op => {
                    if (op.insert && op.insert.image) {
                        let src = op.insert.image;
                        if (src.startsWith('/uploads/')) {
                            return { ...op, insert: { image: `${cleanApiUrl}${src}` } };
                        }
                    }
                    return op;
                });

                const simpleText = delta.map(op => (typeof op.insert === 'string' ? op.insert : '')).join('').trim();

                // If it's a very simple delta (just text), let's just use the text to simplify rendering
                if (delta.length <= 5 && !delta.some(op => op.insert && typeof op.insert !== 'string')) {
                    setValue(simpleText);
                } else {
                    setValue({ ops: delta });
                }
            } catch (e) {
                console.error("Delta Parse Error:", e);
                setValue(content);
            }
        } else if (typeof content === 'string' && content.trim().startsWith('[') && content.includes('"insert"')) {
            try {
                const parsed = JSON.parse(content);
                setValue({ ops: parsed });
            } catch (e) {
                setValue(content);
            }
        } else {
            // Handle raw HTML and resolve images there too
            const cleanApiUrl = getApiBaseUrl();
            let processedHtml = typeof content === 'string'
                ? content.replace(/src="\/uploads\//g, `src="${cleanApiUrl}/uploads/`)
                : content;
            setValue(processedHtml);
        }
    }, [content]);


    if (!value) return null;

    // 🌟 If value is a simple string (no HTML tags and not a Delta object), render it plainly
    if (typeof value === 'string' && !value.includes('<') && !value.includes('>')) {
        return <div className={className}>{value}</div>;
    }

    return (
        <div className={`rich-text-content ${className}`}>
            <ReactQuill
                value={value}
                readOnly={true}
                theme="bubble"
                modules={{ toolbar: false }}
            />
            <style jsx global>{`
                .rich-text-content .ql-container.ql-bubble {
                    border: none;
                    font-size: inherit;
                    font-family: inherit;
                    color: inherit;
                    line-height: inherit;
                }
                .rich-text-content .ql-editor {
                    padding: 0;
                    overflow: visible;
                }
                .rich-text-content .ql-editor p {
                    margin-bottom: 1.5rem;
                }
                .rich-text-content .ql-editor blockquote.styled-quote-block {
                    margin: 2.5rem 0;
                    padding: 2rem;
                    border-radius: 1.5rem;
                    border-left-width: 8px;
                }
            `}</style>
        </div>
    );
}
