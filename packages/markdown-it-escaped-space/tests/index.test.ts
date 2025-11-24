import MarkdownIt from "markdown-it";
import { describe, expect, it } from "vitest";
import markdownItEscapedSpace from "../src/index.js";

const md = new MarkdownIt({ linkify: true });
md.use(markdownItEscapedSpace);

function md2Html(input: string): string {
  return md.render(input);
}

describe("escaped space", () => {
  it("Handle escaped space", () => {
    expect(md2Html("a\\ **()**\\ a")).toBe("<p>a<strong>()</strong>a</p>\n");
    expect(md2Html("𩸽\\ **「」**\\ 𩸽")).toBe(
      "<p>𩸽<strong>「」</strong>𩸽</p>\n",
    );
  });

  it("Handle escaped space nbsp", () => {
    expect(md2Html("100\\  km")).toBe("<p>100\u00A0km</p>\n");
    expect(md2Html("a\\   b")).toBe("<p>a\u00A0 b</p>\n");
    expect(md2Html("a\\  \\ b")).toBe("<p>a\u00A0b</p>\n");
  });

  it("Can be combined with linkify in CJK context", () => {
    expect(md2Html("詳しくはhttps://example.com\\ をご覧ください")).toBe(
      '<p>詳しくは<a href="https://example.com">https://example.com</a>をご覧ください</p>\n',
    );
  });

  it("Handle trailing escaped space", () => {
    expect(md2Html("a\\\nb")).toBe("<p>a<br>\nb</p>\n");
    expect(md2Html("a\\ \nb")).toBe("<p>a\nb</p>\n");
    expect(md2Html("a\\  \nb")).toBe("<p>a\u00A0\nb</p>\n");
    expect(md2Html("a\\   \nb")).toBe("<p>a\u00A0\nb</p>\n");
    expect(md2Html("a\\    \nb")).toBe("<p>a\u00A0<br>\nb</p>\n");
    expect(md2Html("a\\     \nb")).toBe("<p>a\u00A0<br>\nb</p>\n");
    expect(md2Html("a\\\n\n")).toBe("<p>a\\</p>\n");
    expect(md2Html("a\\ \n\n")).toBe("<p>a</p>\n");
    expect(md2Html("a\\  \n\n")).toBe("<p>a\u00A0</p>\n");
    expect(md2Html("a\\   \n\n")).toBe("<p>a\u00A0</p>\n");
    expect(md2Html("a\\    \n\n")).toBe("<p>a\u00A0</p>\n");
    expect(md2Html("a\\     \n\n")).toBe("<p>a\u00A0</p>\n");
  });
});
