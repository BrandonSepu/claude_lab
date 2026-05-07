# Classic Chat Design Specification
**Date:** 2026-05-06  
**Project:** Normix — Classic Chat Interface  
**Status:** Approved for Implementation

---

## Overview

This spec covers the implementation of the **Classic Chat** wireframe from the normix design system. The Classic design is a full-screen chat interface with centered messaging, featuring a sketchy, casual aesthetic with low-fi visual elements.

The design maintains fidelity to the original wireframe while being implemented in Angular as a modernized, functional chat component.

---

## Design Goals

1. **Fidelity** — Stay true to the Classic wireframe's layout and sketchy visual style
2. **Usability** — Provide a smooth chat experience with multiple states (empty, conversation, loading, error)
3. **Clarity** — Include visual annotations to explain UI elements in a playful way
4. **Accessibility** — Ensure keyboard navigation and semantic HTML

---

## Layout Architecture

The interface is divided into **3 fixed sections**:

### 1. Top Bar (Fixed Header)
- **Height:** ~60px
- **Content:**
  - Logo mark "n" (small circular badge, background: teal-soft)
  - Logo text "normix" (handwriting style, ~28px)
  - Hint text "— full screen chat —" (right-aligned, low-fi style)
- **Border:** Bottom border 2px dashed (--rule color)
- **Background:** var(--paper) (light cream/off-white)
- **Padding:** 14px 22px

### 2. Messages Area (Flex 1, Scrollable)
- **Flex:** Takes remaining vertical space
- **Overflow:** Auto (scrollable if messages exceed height)
- **Padding:** 24px 18% (centered, ~18% margin on sides)
- **Display:** Flex column with gap: 12px
- **Background:** var(--paper)

**Sub-sections within Messages Area:**

#### Empty State
Rendered when `messages.length === 0 && !loading() && !errorMessage()`:
- Centered content using flexbox
- Logo mark "n" (large, ~110px)
- Greeting text "Hola, soy normix" (handwriting, ~38px, with zig-zag class)
- Subtitle "Pregúntame lo que sea sobre regulación fintech." (--ink-soft color)
- Grid of 4 suggested questions (2×2, max-width: 520px)
- Annotation box (top-right, rotated 4deg): "logo + saludo ↘"

#### Conversation State
Rendered when `messages.length > 0`:
- Bubble messages rendered in order:
  - User message: right-aligned, background: --color-accent-light, max-width: 70%
  - Bot message: left-aligned, background: --chat-bg, max-width: 70%
  - Loading state: bot bubble with typing animation
  - Error state: red banner below messages
- Annotation box (bottom-left, rotated -3deg): "input fijo (Enter envía) ↙"

### 3. Input Bar (Fixed Footer)
- **Height:** ~80px
- **Content:**
  - Input field (placeholder: "Escribe tu pregunta...")
  - Send button (text: "Enviar", background: --orange)
- **Background:** var(--teal-soft)
- **Border:** Top border 2px solid (--rule)
- **Padding:** 14px 18% 22px 18%
- **Layout:** Flex row with gap: 8px

---

## Component Structure

### chat.component.ts
**Signals (Standalone):**
- `messages = signal<Message[]>([])` — Chat history
- `loading = signal(false)` — Request in progress
- `errorMessage = signal<string | null>(null)` — Error text
- `inputValue = signal('')` — Current input field value

**Methods:**
- `onSendMessage()` — Add user message, call service, handle response/error
- `onKeyDown(event: KeyboardEvent)` — Send on Enter if not loading
- `onSuggestedQuestion(question: string)` — Fill input with suggestion (NEW)

**Service Integration:**
- Inject `ChatService`
- Call `chatService.send(pregunta)` on message send
- Handle subscription: next (add bot message), error (show error banner)

### chat.component.html
**Template Structure:**
```
<div class="chat-container">
  <!-- Top Bar -->
  <div class="top-bar">
    <div class="logo-mark small">n</div>
    <span class="scrawl">normix</span>
    <span class="hint">— full screen chat —</span>
  </div>

  <!-- Messages Area -->
  <div class="messages-area">
    <!-- Empty State -->
    @if (messages().length === 0 && !loading() && !errorMessage()) {
      <div class="empty-state">
        <div class="logo-mark">n</div>
        <div class="greeting">Hola, soy normix</div>
        <div class="subtitle">Pregúntame lo que sea...</div>
        <div class="suggestions-grid">
          <!-- 4 suggestion chips -->
        </div>
        <div class="annotation" style="top: 110px; right: 28px;">
          logo + saludo<br><span class="arrow">↘</span>
        </div>
      </div>
    }

    <!-- Messages -->
    @for (message of messages(); track $index) {
      <div [ngClass]="['message', message.role]">
        <div class="message-bubble">{{ message.text }}</div>
      </div>
    }

    <!-- Loading -->
    @if (loading()) {
      <div class="message bot">
        <div class="message-bubble">
          <div class="typing-dots"><span/><span/><span/></div>
        </div>
      </div>
    }

    <!-- Error -->
    @if (errorMessage()) {
      <div class="error-banner">{{ errorMessage() }}</div>
    }

    <!-- Annotation for conversation state -->
    @if (messages().length > 0) {
      <div class="annotation" style="bottom: 90px; left: 28px;">
        <span class="arrow">↙</span> input fijo<br>(Enter envía)
      </div>
    }
  </div>

  <!-- Input Bar -->
  <div class="input-area">
    <input
      class="input-field"
      [(ngModel)]="inputValue"
      (keydown)="onKeyDown($event)"
      [disabled]="loading()"
      placeholder="Escribe tu pregunta..."
    />
    <button
      class="send-btn"
      (click)="onSendMessage()"
      [disabled]="loading() || !inputValue().trim()"
    >
      Enviar
    </button>
  </div>
</div>
```

### chat.component.css
**CSS Variables (in root or component scope):**
```css
--paper: #faf8f3;
--ink: #1a1a1a;
--ink-soft: #666;
--ink-muted: #999;
--orange: #ff9500;
--orange-soft: #fff4e6;
--teal: #2ec4b6;
--teal-soft: #e8f5f3;
--rule: #d0c9c0;
--chat-bg: #f0ebe4;
--error: #e74c3c;
```

**Key Classes:**

- `.chat-container` — flex column, height: 100dvh, var(--paper) bg
- `.top-bar` — flex, 60px, padding 14px 22px, border-bottom dashed
- `.messages-area` — flex 1, overflow-y: auto, padding 24px 18%, gap 12px
- `.message` — flex, margin-bottom 0.5rem
- `.message.user` — justify-content: flex-end
- `.message.bot` — justify-content: flex-start
- `.message-bubble` — max-width 70%, padding 12px 16px, border-radius 8px
- `.message.user .message-bubble` — background: --color-accent-light
- `.message.bot .message-bubble` — background: --chat-bg
- `.empty-state` — flex column, centered, gap 18px, align items center
- `.logo-mark` — circular badge, centered content, background: --teal-soft
- `.logo-mark.small` — 32px
- `.logo-mark` (large) — 80px
- `.scrawl` — handwriting font family (e.g., "Caveat" from Google Fonts)
- `.scrawl.zig` — slight skew/tilt transform
- `.suggestions-grid` — grid 2/2, gap 10px, max-width 520px
- `.suggest-chip` — padding 8px 12px, border: 2px dashed --rule, border-radius 4px, text-align center
- `.input-area` — flex, gap 8px, padding 14px 18% 22px 18%, background: --teal-soft, border-top solid
- `.input-field` — flex 1, padding 12px 16px, border: 2px dashed --rule, border-radius 4px, font-size 16px
- `.send-btn` — padding 12px 24px, background: --orange, color white, border: none, border-radius 4px, cursor pointer
- `.send-btn:hover:not(:disabled)` — background: #ff8c00 (slightly darker)
- `.send-btn:disabled` — background: #ccc, opacity 0.6, cursor not-allowed
- `.error-banner` — background: --error, color white, padding 12px 16px, border-radius 4px, text-align center
- `.annotation` — position absolute, padding 8px 12px, background: white, border: 2px dashed --rule, border-radius 4px, font-size 12px, color: --ink-soft, z-index 1
- `.annotation .arrow` — display inline-block
- `.typing-dots span` — display inline-block, width 4px, height 4px, border-radius 50%, background: --ink-soft, animation typing 1.4s infinite
- `@keyframes typing` — 0%/20% scale(1), 50% scale(1.3), 100% scale(1)

**Typography:**
- Body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
- Headings/Logo: "Caveat" or "Fredoka One" (handwriting style, Google Fonts)
- Font sizes: 12px (hints), 16px (body), 24px (P./R. labels), 28px (title), 38-46px (hero)

**Responsive Considerations:**
- Sidebar padding: 18% (could be adjusted for smaller screens)
- Input area: full width with gap
- Messages area: scrollable if content exceeds height
- Messages max-width: 70% (could be 90% on mobile)

---

## Data Models

### Message
```typescript
interface Message {
  role: 'user' | 'bot';
  text: string;
}
```

### UI States
- **Empty** — No messages, no loading, no error
- **Conversation** — Messages displayed, input enabled
- **Loading** — Typing animation in bot bubble, input disabled
- **Error** — Error banner shown, input enabled for retry

---

## Interactions

### Sending a Message
1. User types in input field
2. User presses **Enter** OR clicks **Send**
3. If input is empty or loading is true, do nothing
4. Add user message to `messages` signal
5. Clear input field
6. Set `loading = true`
7. Disable input and send button
8. Call `chatService.send(pregunta)`
9. On response: add bot message, set `loading = false`, clear error
10. On error: set `errorMessage`, set `loading = false`

### Clicking a Suggested Question (Empty State)
1. Click on a suggestion chip
2. Populate input field with question text
3. Focus input field
4. User can then press Enter or click Send

### Keyboard Shortcuts
- **Enter** — Send message (if not loading)
- **Escape** — (Optional) Clear input field

---

## Accessibility & UX

- **Semantic HTML** — Use proper heading tags, form elements
- **ARIA labels** — Button roles, aria-disabled on disabled state
- **Focus management** — Input field auto-focuses on empty state
- **Color contrast** — Ensure text on button meets WCAG AA
- **Loading feedback** — Typing dots clearly indicate waiting
- **Error visibility** — Error banner is prominent and red
- **Keyboard nav** — All interactive elements reachable via Tab

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid, Flexbox, CSS Variables
- ES2020+ JavaScript (Angular 17+)

---

## Future Extensibility

This design is complete for the Classic wireframe. Future phases could include:
- Toggle between Classic, Cards, and Hero wireframes
- Color theme selector (orange/teal)
- Suggested questions toggle
- Message persistence/history
- Rich text formatting (markdown support)
- File uploads
- Accessibility enhancements (screen reader testing)

---

## Success Criteria

✅ Layout matches Classic wireframe dimensions and proportions  
✅ Sketchy aesthetic maintained (dashed borders, handwriting fonts, annotations)  
✅ All 4 UI states functional (empty, conversation, loading, error)  
✅ Keyboard (Enter) and mouse interactions work smoothly  
✅ Responsive on desktop (18% sidebar margins)  
✅ No console errors or warnings  
✅ ChatService integration works end-to-end  
✅ Suggested questions populate input field on click  

---

## Implementation Order

1. Create HTML structure with top bar, messages area, input bar
2. Add CSS variables and layout styles (flexbox, spacing)
3. Add typography (Google Fonts for handwriting style)
4. Implement empty state UI
5. Implement message bubbles (user and bot)
6. Implement loading state (typing animation)
7. Implement error banner
8. Implement annotations (positioned boxes)
9. Wire up chat.component.ts signals and methods
10. Integrate ChatService and test full flow
11. Test keyboard interactions (Enter key)
12. Test suggested questions click handler
13. Polish and adjust spacing/colors as needed
