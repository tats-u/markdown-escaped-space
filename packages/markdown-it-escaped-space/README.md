# markdown-it-escaped-space

[![Version](https://img.shields.io/npm/v/markdown-it-escaped-space)](https://npmjs.com/package/markdown-it-escaped-space) ![Node Current](https://img.shields.io/node/v/markdown-it-escaped-space) [![NPM Downloads](https://img.shields.io/npm/dm/markdown-it-escaped-space)](https://npmjs.com/package/markdown-it-escaped-space) [![NPM Last Update](https://img.shields.io/npm/last-update/markdown-it-escaped-space)](https://npmjs.com/package/markdown-it-escaped-space)

A markdown-it extension that allows escaped spaces around emphasis markers and GFM autolinks in CJK (Chinese, Japanese, and Korean) text.

## Problem

CommonMark has limitations when dealing with CJK text:

### Emphasis Markers Adjacent to CJK Punctuation

Emphasis markers like `**` may not be recognized as emphasis marks when they are adjacent to CJK punctuation marks or when soft line breaks exist between CJK characters.

For example, without this extension:

```md
太郎は**「こんにちわ」**といった。

张三说**「你好」**的时候。

김철수는**「안녕하세요」**라고 말했습니다.
```

The emphasis markers here are not recognized as emphasis due to the adjacent punctuation marks.

### GFM Autolinks in CJK Text

GFM's autolink feature also has compatibility issues with CJK text. Without proper handling, GFM autolinks may incorrectly extend into following CJK content or cause unwanted breaks.

For example:

```md
詳しくはhttps://example.comをご覧ください。
```

Renders as:

```html
<p>詳しくは<a href="https://example.comをご覧ください。">https://example.comをご覧ください。</a></p>
```

The autolink incorrectly includes the CJK text after the URL, breaking the intended link.

#### Common Workaround and Its Problems

A common workaround is to add a space after the URL:

```md
詳しくはhttps://example.com をご覧ください。
```

This renders correctly:

```html
<p>詳しくは<a href="https://example.com">https://example.com</a> をご覧ください。</p>
```

However, this workaround has a visual drawback: **the space between the URL and the following CJK text is rendered as a visible space in HTML**, which may look unnatural or create unexpected line breaks in some contexts. This is especially problematic for professional documents where precise spacing is important.

## Solution

This extension allows you to use escaped spaces (backslash-space) to fix both emphasis recognition and autolink delineation in CJK contexts:

```md
太郎は\ **「こんにちわ」**\ といった。

张三说\ **「你好」**\ 的时候。

김철수는\ **「안녕하세요」**\ 라고 말했습니다。

詳しくはhttps://example.com\ をご覧ください。
```

The escaped spaces are "not rendered" in the output but allow proper parsing while maintaining readability in the source.

[This solution is also adopted in reStructuredText](https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html#inline-markup), which is a documentation format used by the Python community.

## Features

### Escaped Space for Emphasis & GFM Autolinks

Escaped spaces around emphasis markers and autolinks help with CJK text processing, ensuring proper recognition even when adjacent to CJK punctuation.

**For Emphasis:**

```md
太郎は\ **「こんにちわ」**\ といった。
```

Renders as:

```html
<p>太郎は<strong>「こんにちわ」</strong>といった。</p>
```

**For Autolinks:**

```md
詳しくはhttps://example.com\ をご覧ください。
```

Renders as:

```html
<p>詳しくは<a href="https://example.com">https://example.com</a>をご覧ください。</p>
```

Note how the escaped space delineates the autolink without introducing a visible space in the output.

### Non-Breaking Space Feature (Generic)

In addition to CJK support, this extension includes a custom feature for general typography: **backslash followed by two spaces** is converted to a non-breaking space (U+00A0).

**Use case:** Preventing line breaks between related words in European languages.

**Example:**

```md
The\  author is John\  Doe.
```

Renders as:

```html
<p>The&nbsp;author is John&nbsp;Doe.</p>
```

This is useful for:
- Keeping titles and names together on a single line
- Preventing separation of abbreviations from units (e.g., "5\  cm")
- Professional typography where specific spacing rules apply

> [!NOTE]
> This feature is experimental and its syntax may be changed to `\ \ ` in the future.

## Specification

See [specification.md](./specification.md) for detailed technical specifications.

## Who should use this extension?

You should use this extension if you:

1. Need to handle Chinese, Japanese, or Korean content with emphasis markers adjacent to CJK punctuation
2. Want better GFM autolink handling in CJK contexts
3. Need non-breaking space support for professional typography
4. Cannot modify source content to add spaces manually
5. Need emphasis to work correctly without relying on HTML tags like `<strong>`
6. Are creating Markdown-related software or services targeting CJK users or requiring precise spacing control

## Usage

This extension is designed to be used in conjunction with your Markdown parser. The behavior is:

- **Escaped space** (`\ `) around emphasis markers and autolinks is not rendered in the output
- They allow emphasis markers to be recognized even when adjacent to CJK punctuation
- They help delineate autolinks in CJK text without introducing visible spaces
- **Backslash + two spaces** (`\  `) is converted to a non-breaking space
- They maintain the original source formatting without visible artifacts

### Examples

#### Escaped Space for Emphasis

**Input:**

```md
太郎は\ **「こんにちわ」**\ といった。
```

**Output:**

```html
<p>太郎は<strong>「こんにちわ」</strong>といった。</p>
```

#### Escaped Space for GFM Autolinks

**Input:**

```md
詳しくはhttps://example.com\ をご覧ください。
```

**Output:**

```html
<p>詳しくは<a href="https://example.com">https://example.com</a>をご覧ください。</p>
```

#### Non-Breaking Space

**Input:**

```md
The\  quick brown fox
```

**Output:**

```html
<p>The&nbsp;quick brown fox</p>
```

## Related Projects

This extension is a port of the `WithEscapedSpace` option from [goldmark](https://github.com/yuin/goldmark)'s CJK extension.

There is another approach to handling CJK text in Markdown without adding extra symbols `\ ` (CJK Friendly Emphasis Extension):

- [markdown-it-cjk-friendly / remark-cjk-friendly](https://github.com/tats-u/markdown-cjk-friendly)
- [goldmark-cjk-friendly](https://github.com/tats-u/goldmark-cjk-friendly)

It is not mutually exclusive with this extension, and you can use both together if needed. Especially, you can use this Escaped Space extension as the fallback for corner cases where the CJK Friendly Emphasis extension does not work.

## Compatibility

This extension does not affect behavior in languages other than CJK for emphasis handling. Content in English, European languages, and other non-CJK text will render identically with or without the escaped space emphasis feature.

The non-breaking space feature is language-agnostic and works universally.

## Bonus: Fix for markdown-it's Full-width Space Trimming Bug

In addition to the escaped space features, this extension fixes a **markdown-it bug** where full-width spaces (U+3000 and other non-ASCII whitespace characters) at the beginning or end of lines are incorrectly trimmed.

### The Issue

markdown-it uses JavaScript's `.trim()` method to remove leading/trailing whitespace from lines. However, `.trim()` removes **all Unicode whitespace characters**, not just ASCII spaces (U+0020) as specified by CommonMark. This causes full-width spaces ( U+3000) and other non-ASCII whitespace to be stripped from the source, which is problematic when:

1. You intentionally use full-width spaces for visual formatting in Japanese, Chinese, or Korean text
2. Third-party extensions rely on full-width spaces at line boundaries for special processing
3. You need to preserve exact spacing in professional documents

**Related issues:**
- https://github.com/markdown-it/markdown-it/issues/1067
- https://github.com/markdown-it/markdown-it/pull/1074

### Example Problem

Without this extension:

```md
　このテキストは全角スペースで始まります。
最後の行は全角スペースで終わります　
```

The full-width spaces would be incorrectly removed by markdown-it's default trimming behavior.

### How This Extension Helps

This extension preserves full-width spaces and other non-ASCII whitespace at line boundaries, allowing you to:

- Maintain visual formatting in CJK documents
- Use full-width spaces for indentation or styling purposes
- Support custom third-party extensions that depend on full-width spaces
- Ensure compliance with CommonMark's specification (which only requires ASCII space trimming)

### Recommendation

If you're using markdown-it with CJK content or need to preserve full-width spaces for any reason, use this extension to avoid losing important formatting information.

## Contributing

Please submit issues and pull requests in English or Japanese.

## License

MIT

## Development

- Install dependencies:

```bash
npm install
```

- Run the unit tests:

```bash
npm run test
```

- Build the library:

```bash
npm run build
```
