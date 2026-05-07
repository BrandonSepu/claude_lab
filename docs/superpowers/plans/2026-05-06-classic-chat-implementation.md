# Classic Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Classic Chat wireframe design with full functionality, including empty state, message bubbles, loading, error handling, and suggested questions.

**Architecture:** The implementation follows Angular standalone patterns with signals for reactive state. CSS is modularized into variables, animations, and typography files. The component uses @if/@for control flow for conditional rendering of UI states (empty, conversation, loading, error).

**Tech Stack:** Angular 17+ (Standalone), TypeScript, CSS 3 (Grid/Flexbox), Google Fonts (Caveat handwriting)

---

## Task 1: Create CSS Variables and Theme Foundation

**Files:**
- Create: `src/styles/variables.css`

- [ ] **Step 1: Create variables.css with color palette**

Create file `src/styles/variables.css`:

```css
/* Color Palette */
:root {
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
}

/* Sizing */
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
}

/* Border Radius */
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-pill: 999px;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/variables.css
git commit -m "feat: add CSS color variables and spacing system"
```

---

## Task 2: Create Typography and Font Imports

**Files:**
- Create: `src/styles/typography.css`

- [ ] **Step 1: Create typography.css with Google Fonts import**

Create file `src/styles/typography.css`:

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Fredoka+One&display=swap');

/* Typography System */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 16px;
  line-height: 1.4;
  color: var(--ink);
  background-color: var(--paper);
}

/* Scrawl (Handwriting) Class */
.scrawl {
  font-family: 'Caveat', 'Fredoka One', cursive;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.scrawl.zig {
  transform: skewY(-1deg) rotate(-1deg);
  display: inline-block;
}

/* Hints and Small Text */
.lo-fi-hint {
  font-size: 12px;
  color: var(--ink-muted);
  font-style: italic;
}

/* Annotation Text */
.annotation {
  font-size: 12px;
  line-height: 1.3;
  color: var(--ink-soft);
}

.annotation .arrow {
  display: inline-block;
  margin: 0 2px;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/typography.css
git commit -m "feat: add typography system with Google Fonts (Caveat)"
```

---

## Task 3: Create Animation Keyframes

**Files:**
- Create: `src/styles/animations.css`

- [ ] **Step 1: Create animations.css with typing dots animation**

Create file `src/styles/animations.css`:

```css
/* Typing Dots Animation */
@keyframes typing {
  0%, 20% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.typing-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-dots span {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--ink-soft);
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/animations.css
git commit -m "feat: add typing dots animation keyframes"
```

---

## Task 4: Import CSS Files in Global Styles

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add imports at top of styles.css**

Open `src/styles.css` and add these imports at the very top (before any existing content):

```css
@import 'styles/variables.css';
@import 'styles/typography.css';
@import 'styles/animations.css';
```

- [ ] **Step 2: Verify file looks correct**

Check that the imports are the first thing in `src/styles.css`, followed by any existing content.

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "feat: import modular CSS files (variables, typography, animations)"
```

---

## Task 5: Update chat.component.ts with Suggested Questions Logic

**Files:**
- Modify: `src/app/chat/chat.component.ts`

- [ ] **Step 1: Add SUGGESTED constant to chat.component.ts**

Add this constant at the top of the component file (after imports):

```typescript
const SUGGESTED = [
  "¿Qué es la Ley Fintech?",
  "¿Cómo registro una operación?",
  "Requisitos de KYC",
  "¿Qué reporta la CNBV?",
];
```

- [ ] **Step 2: Add onSuggestedQuestion() method**

Add this method to the `ChatComponent` class:

```typescript
onSuggestedQuestion(question: string): void {
  this.inputValue.set(question);
  // Focus input (requires template ref)
  setTimeout(() => {
    const inputElement = document.querySelector('.input-field') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }, 0);
}
```

- [ ] **Step 3: Export SUGGESTED constant in component**

Add this export statement at the very end of the file (after the class closing brace):

```typescript
export { SUGGESTED };
```

This allows the template to access SUGGESTED via the component instance.

- [ ] **Step 4: Verify imports are present**

Ensure these imports exist at the top of chat.component.ts:

```typescript
import {
  Component,
  OnInit,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { Message } from './chat.models';
```

- [ ] **Step 5: Commit**

```bash
git add src/app/chat/chat.component.ts
git commit -m "feat: add suggested questions constant and onSuggestedQuestion method"
```

---

## Task 6: Rewrite chat.component.html with Classic Design

**Files:**
- Modify: `src/app/chat/chat.component.html`

- [ ] **Step 1: Replace entire template with Classic design**

Open `src/app/chat/chat.component.html` and replace ALL content with:

```html
<div class="chat-container">
  <!-- Top Bar -->
  <div class="top-bar">
    <div class="logo-mark small">n</div>
    <span class="scrawl" style="font-size: 28px;">normix</span>
    <span class="lo-fi-hint" style="margin-left: auto;">— full screen chat —</span>
  </div>

  <!-- Messages Area -->
  <div class="messages-area">
    <!-- Empty State -->
    @if (messages().length === 0 && !loading() && !errorMessage()) {
      <div class="empty-state">
        <div class="logo-mark large">n</div>
        <div class="scrawl zig" style="font-size: 38px; line-height: 1;">Hola, soy normix</div>
        <div class="subtitle">Pregúntame lo que sea sobre regulación fintech.</div>
        
        <!-- Suggestions Grid -->
        <div class="suggestions-grid">
          @for (question of suggestedQuestions; track question) {
            <div class="suggest-chip" (click)="onSuggestedQuestion(question)">
              {{ question }}
            </div>
          }
        </div>

        <!-- Annotation -->
        <div class="annotation" style="top: 110px; right: 28px; transform: rotate(4deg); text-align: right;">
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

    <!-- Loading State -->
    @if (loading()) {
      <div class="message bot">
        <div class="message-bubble">
          <div class="typing-dots"><span/><span/><span/></div>
        </div>
      </div>
    }

    <!-- Error State -->
    @if (errorMessage()) {
      <div class="error-banner">{{ errorMessage() }}</div>
    }

    <!-- Annotation (shown when messages exist) -->
    @if (messages().length > 0) {
      <div class="annotation" style="bottom: 90px; left: 28px; transform: rotate(-3deg);">
        <span class="arrow">↙</span> input fijo<br>(Enter envía)
      </div>
    }
  </div>

  <!-- Input Bar -->
  <div class="input-area">
    <input
      type="text"
      class="input-field"
      placeholder="Escribe tu pregunta..."
      [(ngModel)]="inputValue"
      (keydown)="onKeyDown($event)"
      [disabled]="loading()"
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

- [ ] **Step 2: Commit**

```bash
git add src/app/chat/chat.component.html
git commit -m "feat: implement Classic chat design template with empty state, messages, and annotations"
```

---

## Task 7: Add suggestedQuestions Signal to Component

**Files:**
- Modify: `src/app/chat/chat.component.ts`

- [ ] **Step 1: Add suggestedQuestions signal**

In `src/app/chat/chat.component.ts`, add this line right after the existing signals:

```typescript
suggestedQuestions = signal<string[]>(SUGGESTED);
```

Add it after the line `inputValue = signal('');`, so it looks like:

```typescript
messages = signal<Message[]>([]);
loading = signal(false);
errorMessage = signal<string | null>(null);
inputValue = signal('');
suggestedQuestions = signal<string[]>(SUGGESTED);
```

- [ ] **Step 2: Verify constant is defined**

Make sure the `SUGGESTED` constant exists (from Task 5). If not, add it.

- [ ] **Step 3: Commit**

```bash
git add src/app/chat/chat.component.ts
git commit -m "feat: add suggestedQuestions signal to component"
```

---

## Task 8: Rewrite chat.component.css with Classic Design Styles

**Files:**
- Modify: `src/app/chat/chat.component.css`

- [ ] **Step 1: Replace entire CSS file**

Open `src/app/chat/chat.component.css` and replace ALL content with:

```css
/* Chat Container */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  background-color: var(--paper);
  overflow: hidden;
}

/* Top Bar */
.top-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  border-bottom: 2px dashed var(--rule);
  background-color: var(--paper);
  flex-shrink: 0;
}

/* Logo Mark */
.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Caveat', 'Fredoka One', cursive;
  font-weight: 700;
  color: var(--ink);
  background-color: var(--teal-soft);
  border-radius: 8px;
  border: 2px dashed var(--rule);
  flex-shrink: 0;
}

.logo-mark.small {
  width: 32px;
  height: 32px;
  font-size: 18px;
}

.logo-mark.large {
  width: 110px;
  height: 110px;
  font-size: 56px;
  margin: 0 auto;
}

/* Messages Area */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px 18%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--paper);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin: auto;
  text-align: center;
  position: relative;
}

.subtitle {
  color: var(--ink-soft);
  font-size: 16px;
  max-width: 520px;
}

/* Suggestions Grid */
.suggestions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  max-width: 520px;
  width: 100%;
  margin-top: 8px;
}

.suggest-chip {
  padding: 8px 12px;
  border: 2px dashed var(--rule);
  border-radius: 4px;
  background-color: white;
  color: var(--ink);
  cursor: pointer;
  font-size: 13px;
  text-align: center;
  line-height: 1.3;
  transition: all 0.2s ease;
  user-select: none;
}

.suggest-chip:hover {
  background-color: var(--orange-soft);
  border-color: var(--orange);
}

.suggest-chip:active {
  transform: scale(0.98);
}

/* Message Bubble */
.message {
  display: flex;
  margin-bottom: 0.5rem;
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px dashed var(--rule);
  word-wrap: break-word;
  line-height: 1.5;
}

.message.user .message-bubble {
  background-color: var(--orange-soft);
  color: var(--ink);
  border-color: var(--orange);
}

.message.bot .message-bubble {
  background-color: var(--chat-bg);
  color: var(--ink);
  border-color: var(--rule);
}

/* Error Banner */
.error-banner {
  background-color: var(--error);
  color: white;
  padding: 12px 16px;
  border-radius: 4px;
  margin: 0.5rem 0;
  text-align: center;
  font-size: 14px;
  border: 2px solid var(--error);
}

/* Input Area */
.input-area {
  display: flex;
  gap: 8px;
  padding: 14px 18% 22px 18%;
  background-color: var(--teal-soft);
  border-top: 2px solid var(--rule);
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  padding: 12px 16px;
  border: 2px dashed var(--rule);
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  background-color: white;
  color: var(--ink);
  transition: all 0.2s ease;
}

.input-field::placeholder {
  color: var(--ink-muted);
}

.input-field:focus {
  border-color: var(--orange);
  box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.1);
}

.input-field:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.send-btn {
  padding: 12px 24px;
  background-color: var(--orange);
  color: white;
  border: 2px solid var(--orange);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-family: inherit;
}

.send-btn:hover:not(:disabled) {
  background-color: #ff8c00;
  border-color: #ff8c00;
  transform: translateY(-2px);
}

.send-btn:active:not(:disabled) {
  transform: translateY(0);
}

.send-btn:disabled {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Annotations */
.annotation {
  position: absolute;
  padding: 8px 12px;
  background-color: white;
  border: 2px dashed var(--rule);
  border-radius: 4px;
  max-width: 120px;
  z-index: 10;
  font-size: 12px;
  line-height: 1.3;
  color: var(--ink-soft);
}

/* Scrollbar Styling */
.messages-area::-webkit-scrollbar {
  width: 8px;
}

.messages-area::-webkit-scrollbar-track {
  background: var(--paper);
}

.messages-area::-webkit-scrollbar-thumb {
  background: var(--rule);
  border-radius: 4px;
}

.messages-area::-webkit-scrollbar-thumb:hover {
  background: var(--ink-soft);
}

/* Responsive Design */
@media (max-width: 768px) {
  .messages-area {
    padding: 24px 10%;
  }

  .input-area {
    padding: 14px 10% 22px 10%;
  }

  .message-bubble {
    max-width: 85%;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .messages-area {
    padding: 16px 8%;
  }

  .input-area {
    padding: 12px 8% 18px 8%;
    gap: 6px;
  }

  .message-bubble {
    max-width: 90%;
    padding: 10px 12px;
    font-size: 14px;
  }

  .input-field {
    padding: 10px 12px;
    font-size: 14px;
  }

  .send-btn {
    padding: 10px 16px;
    font-size: 14px;
  }

  .top-bar {
    padding: 10px 16px;
  }

  .annotation {
    font-size: 10px;
    padding: 6px 10px;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/chat/chat.component.css
git commit -m "feat: implement Classic chat design styles with dashed borders, colors, and responsive layout"
```

---

## Task 9: Test Empty State Rendering

**Files:**
- Test in browser (no code changes)

- [ ] **Step 1: Start the dev server**

```bash
ng serve
```

Expected: Application starts without errors on `http://localhost:4200`

- [ ] **Step 2: Open browser and verify empty state**

Open `http://localhost:4200` in your browser.

Expected visuals:
- Top bar with "n" logo and "normix" text, dashed border
- Large "n" logo centered
- "Hola, soy normix" greeting in handwriting font
- Subtitle text below
- 4 suggested questions in 2×2 grid
- Annotation box in top-right with arrow
- Teal-soft input bar at bottom with placeholder and Send button

- [ ] **Step 3: Test suggestion chip interaction**

Click on one of the suggested questions.

Expected behavior:
- Input field populates with the question text
- Input field receives focus (cursor visible)

- [ ] **Step 4: No console errors**

Open browser DevTools (F12) and check Console tab.

Expected: No red errors, only normal Angular logs

---

## Task 10: Test Sending Messages and Chat Flow

**Files:**
- Test in browser (no code changes)

- [ ] **Step 1: Type and send a message**

In the empty state, type "Hola" in the input field and click "Enviar" (or press Enter).

Expected behavior:
- Input clears
- User message "Hola" appears as a bubble on the right (orange-soft background)
- Chat area scrolls, layout switches from empty state to conversation
- Typing dots animation appears in bot bubble on the left

- [ ] **Step 2: Wait for bot response (mock)**

Watch the typing dots animate.

Expected: Animation shows 3 dots bouncing

- [ ] **Step 3: Check that input is disabled during loading**

While typing dots are visible, try to type in the input field.

Expected: Input field is disabled (grayed out), cannot type

- [ ] **Step 4: Verify Send button is disabled**

While loading, check the Send button.

Expected: Button is grayed out and clicking does nothing

- [ ] **Step 5: Wait for response (may need to mock)**

If ChatService is wired up and working, bot response should appear. Otherwise, check network tab or logs for service call.

---

## Task 11: Test Error State

**Files:**
- Test in browser (no code changes, or mock ChatService if needed)

- [ ] **Step 1: Trigger error (if possible with your backend)**

Try to send a message that causes an error response from ChatService, OR manually trigger error in code temporarily.

Expected: Red error banner appears below messages with text "Error al consultar el servicio. Inténtalo de nuevo."

- [ ] **Step 2: Verify input is enabled**

Error banner shown, input field should be enabled.

Expected: Can type in input field and Send button is enabled

- [ ] **Step 3: Retry message**

Type a new question and send it.

Expected: Error banner disappears, new flow starts (typing dots, etc.)

---

## Task 12: Verify Keyboard Shortcuts

**Files:**
- Test in browser (no code changes)

- [ ] **Step 1: Test Enter key**

Type a message and press Enter (without clicking Send).

Expected: Message sends, input clears, user bubble appears

- [ ] **Step 2: Test Ctrl+Enter or other keys**

Press other key combinations (Ctrl+Enter, Shift+Enter).

Expected: Only Enter sends messages, others are ignored

- [ ] **Step 3: Test Enter while loading**

Send a message, then quickly press Enter while typing dots are visible.

Expected: Nothing happens (Enter ignored during loading)

---

## Task 13: Responsive Design Test

**Files:**
- Test in browser (no code changes)

- [ ] **Step 1: Test on mobile viewport**

Open DevTools (F12) → Device Toolbar. Select iPhone 12 or similar (375px width).

Expected visuals:
- Layout adapts with smaller side margins
- Message bubbles are wider (85-90% max-width)
- Suggestions grid becomes single column
- Top bar and input bar scale down proportionally
- No horizontal scrolling

- [ ] **Step 2: Test on tablet viewport**

Select iPad or similar (768px width).

Expected: Layout between mobile and desktop, readable

- [ ] **Step 3: Test on desktop (large screen)**

Resize browser to 1440px+ width.

Expected: Layout stays at 18% side margins, balanced proportions

---

## Task 14: Final Polish and Cleanup

**Files:**
- Verify: `src/styles.css`, `src/app/chat/chat.component.ts`, `.html`, `.css`

- [ ] **Step 1: Remove any debugging code**

Check all files for `console.log()`, commented code, or `//TODO` comments.

Remove if found, commit changes.

- [ ] **Step 2: Verify component selector**

In `src/app/chat/chat.component.ts`, verify selector is `app-chat`:

```typescript
@Component({
  selector: 'app-chat',
  // ...
})
```

- [ ] **Step 3: Check Google Fonts load time**

Open DevTools Network tab and reload page.

Verify that font files (Caveat) load successfully and apply to `.scrawl` elements.

Expected: Handwriting font visible on "Hola, soy normix" and logo area

- [ ] **Step 4: Verify no accessibility issues**

Run axe DevTools or similar accessibility checker in browser.

Expected: No major violations (WCAG AA level)

- [ ] **Step 5: Final commit**

```bash
git status
```

Verify only expected files are modified (chat component files, style files, no untracked files).

```bash
git add .
git commit -m "chore: finalize Classic chat design implementation and testing"
```

---

## Acceptance Criteria

✅ Empty state displays correctly with logo, greeting, suggestions, and annotation  
✅ Suggested questions populate input field and focus on click  
✅ User messages send on Enter or Click, appear right-aligned orange bubble  
✅ Loading state shows typing dots animation while waiting  
✅ Bot messages appear left-aligned in gray bubble  
✅ Error state shows red banner, input remains enabled for retry  
✅ Input field disabled during loading  
✅ Send button disabled when input empty or loading  
✅ Handwriting font (Caveat) loads and applies to title/logo areas  
✅ Dashed borders visible on bubbles, input, suggestions, top bar  
✅ Annotations visible and positioned correctly in empty and conversation states  
✅ Responsive design works on mobile (375px), tablet (768px), desktop (1440px)  
✅ No console errors or warnings  
✅ No accessibility violations (WCAG AA level)  

---

## Tech Notes

- **CSS Variables:** All colors defined in `src/styles/variables.css` for easy theming
- **Animations:** Typing dots in `src/styles/animations.css` using keyframes
- **Fonts:** Google Fonts (Caveat) imported in `src/styles/typography.css`
- **Signals:** Component uses Angular signals for reactive state management
- **Control Flow:** @if/@for syntax for conditional rendering (Angular 17+)
- **Mobile First:** Responsive CSS with media queries for 480px, 768px breakpoints
- **DRY:** CSS uses custom properties to avoid color/spacing repetition
