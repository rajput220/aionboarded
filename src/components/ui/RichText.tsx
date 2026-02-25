export function RichText({ content }: { content: any }) {
    if (!content) return null

    // Payload Lexical rich text is stored as a serialized editor state
    // We need to render the root children
    const root = content?.root?.children || []

    return (
        <div className="prose max-w-none">
            {root.map((node: any, i: number) => (
                <RichTextNode key={i} node={node} />
            ))}
        </div>
    )
}

function RichTextNode({ node }: { node: any }) {
    if (!node) return null

    switch (node.type) {
        case 'paragraph':
            return (
                <p>
                    {node.children?.map((child: any, i: number) => (
                        <RichTextNode key={i} node={child} />
                    ))}
                </p>
            )
        case 'heading': {
            const level = node.tag || 2
            const Tag = (`h${level}`) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
            return (
                <Tag>
                    {node.children?.map((child: any, i: number) => (
                        <RichTextNode key={i} node={child} />
                    ))}
                </Tag>
            )
        }
        case 'list': {
            const Tag = node.listType === 'number' ? 'ol' : 'ul'
            return (
                <Tag>
                    {node.children?.map((child: any, i: number) => (
                        <RichTextNode key={i} node={child} />
                    ))}
                </Tag>
            )
        }
        case 'listitem':
            return (
                <li>
                    {node.children?.map((child: any, i: number) => (
                        <RichTextNode key={i} node={child} />
                    ))}
                </li>
            )
        case 'quote':
            return (
                <blockquote>
                    {node.children?.map((child: any, i: number) => (
                        <RichTextNode key={i} node={child} />
                    ))}
                </blockquote>
            )
        case 'link':
            return (
                <a href={node.fields?.url || '#'} target={node.fields?.newTab ? '_blank' : undefined} rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}>
                    {node.children?.map((child: any, i: number) => (
                        <RichTextNode key={i} node={child} />
                    ))}
                </a>
            )
        case 'text': {
            let text: React.ReactNode = node.text || ''
            if (node.format & 1) text = <strong>{text}</strong>
            if (node.format & 2) text = <em>{text}</em>
            if (node.format & 8) text = <u>{text}</u>
            if (node.format & 16) text = <code>{text}</code>
            if (node.format & 4) text = <s>{text}</s>
            return <>{text}</>
        }
        case 'linebreak':
            return <br />
        case 'upload': {
            const { value } = node
            if (!value) return null
            return (
                <figure>
                    <img
                        src={typeof value === 'string' ? value : value.url}
                        alt={typeof value === 'string' ? '' : value.alt || ''}
                        className="rounded-lg"
                        loading="lazy"
                    />
                    {value.caption && <figcaption>{value.caption}</figcaption>}
                </figure>
            )
        }
        default:
            if (node.children) {
                return (
                    <div>
                        {node.children.map((child: any, i: number) => (
                            <RichTextNode key={i} node={child} />
                        ))}
                    </div>
                )
            }
            return null
    }
}
