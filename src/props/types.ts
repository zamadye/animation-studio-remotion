export type PhoneContent = {
  kind: 'phone';
  mode?: 'chat' | 'call';
  id: string;
  contact: string;
  messages: readonly { from: 'them' | 'me'; lines: readonly string[] }[];
};

export type LetterContent = {
  kind: 'letter';
  id: string;
  headerTag?: string;
  heading: string;
  number: string;
  lines: readonly string[];
  signatureLabel?: string;
  signature: string;
};

export type HeldContent = PhoneContent | LetterContent;

export type HeldProp = {
  content: HeldContent;
  hand: 'left' | 'right';
  start: number;
  end: number;
};

export const propSize = (p: HeldContent) =>
  p.kind === 'phone'
    ? { width: 360, height: 640, scale: 0.14 }
    : { width: 640, height: 800, scale: 0.13 };

/** A readable insert is deliberately short authored copy, not unrestricted chat history. */
export const validateContent = (p: HeldContent) => {
  const check = (text: string, max: number) => {
    if (!text.trim() || text.length > max) {
      throw new Error(`${p.id}: text exceeds readable layout budget (${max})`);
    }
  };
  check(p.id, 60);
  if (p.kind === 'phone') {
    check(p.contact, 22);
    if (!p.messages.length || p.messages.length > 3) {
      throw new Error(`${p.id}: use 1–3 messages`);
    }
    for (const m of p.messages) {
      if (!m.lines.length || m.lines.length > 3) {
        throw new Error(`${p.id}: use 1–3 lines per message`);
      }
      m.lines.forEach((s) => check(s, 22));
    }
  } else {
    if (p.headerTag) {
      check(p.headerTag, 32);
    }
    check(p.heading, 24);
    check(p.number, 32);
    check(p.signature, 26);
    if (p.signatureLabel) {
      check(p.signatureLabel, 28);
    }
    if (!p.lines.length || p.lines.length > 10) {
      throw new Error(`${p.id}: use 1–10 letter lines`);
    }
    p.lines.filter((s) => s.length > 0).forEach((s) => check(s, 34));
  }
  return p;
};
