import type MarkdownIt from "markdown-it";
import { isSpace } from "markdown-it/lib/common/utils.mjs";
import type { RuleBlock } from "markdown-it/lib/parser_block.mjs";
import type { RuleInline } from "markdown-it/lib/parser_inline.mjs";

const ESCAPED: (0 | 1 | 2)[] = [];

for (let i = 0; i < 256; i++) {
  ESCAPED.push(0);
}

"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~- ".split("").forEach((ch) => {
  ESCAPED[ch.charCodeAt(0)] = 1;
});

function trimMinimalSpacesWithoutTrailingEscapedSpace(str: string): string {
  let start = 0;
  for (; start < str.length; start++) {
    if (!isSpaceLike(str.charCodeAt(start))) {
      break;
    }
  }
  let end = str.length - 1;
  for (; end >= start; end--) {
    if (!isSpaceLike(str.charCodeAt(end))) {
      break;
    }
  }
  // We need to handle escaped spaces at the end of the block here:
  const mayBeEspacedSpace = str.slice(end, end + 3);
  if (mayBeEspacedSpace.startsWith("\\ ")) {
    end++; // Save the space after the backslash
    if (mayBeEspacedSpace[2] === " ") {
      end++; // Save the next space if exists, too
    }
  }

  return str.slice(start, end + 1);

  function isSpaceLike(c: number): boolean {
    return c === 0x20 || c === 0x09 || c === 0x0a || c === 0x0d;
  }
}

const paragraphWithTrailingEscapedSpaceSupport: RuleBlock = (
  state,
  startLine,
  endLine,
) => {
  const terminatorRules = state.md.block.ruler.getRules("paragraph");
  const oldParentType = state.parentType;
  let nextLine = startLine + 1;
  state.parentType = "paragraph";

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) {
      continue;
    }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) {
      continue;
    }

    // Some tags can terminate paragraph without empty line.
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
  }

  const content = trimMinimalSpacesWithoutTrailingEscapedSpace(
    state.getLines(startLine, nextLine, state.blkIndent, false),
  );

  state.line = nextLine;

  const token_o = state.push("paragraph_open", "p", 1);
  token_o.map = [startLine, state.line];

  const token_i = state.push("inline", "", 0);
  token_i.content = content;
  token_i.map = [startLine, state.line];
  token_i.children = [];

  state.push("paragraph_close", "p", -1);

  state.parentType = oldParentType;

  return true;
};

const escapeWithEscapedSpace: RuleInline = (state, silent) => {
  let pos = state.pos;
  const max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x5c /* \ */) return false;
  pos++;

  // '\' at the end of the inline block
  if (pos >= max) return false;

  let ch1 = state.src.charCodeAt(pos);

  if (ch1 === 0x0a) {
    if (!silent) {
      state.push("hardbreak", "br", 0);
    }

    pos++;
    // skip leading whitespaces from next line
    while (pos < max) {
      ch1 = state.src.charCodeAt(pos);
      if (!isSpace(ch1)) break;
      pos++;
    }

    state.pos = pos;
    return true;
  }

  let escapedStr = state.src[pos];

  if (ch1 >= 0xd800 && ch1 <= 0xdbff && pos + 1 < max) {
    const ch2 = state.src.charCodeAt(pos + 1);

    if (ch2 >= 0xdc00 && ch2 <= 0xdfff) {
      escapedStr += state.src[pos + 1];
      pos++;
    }
  }

  const origStr = `\\${escapedStr}`;

  if (!silent) {
    const token = state.push("text_special", "", 0);

    let isNbsp = false;
    if (ch1 < 256 && ESCAPED[ch1] !== 0) {
      if (ch1 === 0x20) {
        // Handles an escaped space
        if (pos + 1 < max) {
          const ch2 = state.src.charCodeAt(pos + 1);
          if (ch2 === 0x20) {
            pos++; // Won't modify pos until state.pos = pos + 1 below
            isNbsp = true;
          }
        }
        token.content = isNbsp ? "\u00A0" : "";
      } else {
        token.content = escapedStr;
      }
    } else {
      token.content = origStr;
    }

    token.markup = isNbsp ? "\\  " : origStr;
    token.info = "escape";
  }

  state.pos = pos + 1;
  return true;
};

export default function markdownItEscapedSpace(md: MarkdownIt): void {
  md.inline.ruler.at("escape", escapeWithEscapedSpace);
  md.block.ruler.at("paragraph", paragraphWithTrailingEscapedSpaceSupport);
}
