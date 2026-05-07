# normix Chatbot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone Angular 20+ chatbot that sends questions to a Claude API endpoint and displays responses in a real-time chat interface.

**Architecture:** Standalone Angular component with Signals for state management, HttpClient for API communication, and a dedicated service layer for backend integration. No routing, no modules, minimal UI — full-screen chat with input, message history, loading state, and error handling.

**Tech Stack:**
- Angular 20+ (Standalone components, Signals, ChangeDetectionStrategy.OnPush)
- TypeScript
- HttpClient for API calls
- Native CSS with CSS variables
- No external UI libraries or preprocessing

---

## File Structure

```
src/
├── main.ts                          ← Bootstraps app
├── index.html                       ← HTML entry point
├── styles.css                       ← Global styles & CSS variables
├── app/
│   ├── app.component.ts             ← Root component (bootstrap only)
│   ├── app.component.html           ← Root template
│   ├── app.component.css            ← Root styles (minimal)
│   ├── app.config.ts                ← Angular config, HTTP providers
│   ├── chat/
│   │   ├── chat.component.ts        ← Main logic, Signals, UI interaction
│   │   ├── chat.component.html      ← Chat UI template
│   │   ├── chat.component.css       ← Chat styles
│   │   ├── chat.service.ts          ← API integration service
│   │   └── chat.models.ts           ← Type definitions (Message, Response)
│   └── environments/
│       ├── environment.ts           ← API base URL (dev)
│       └── environment.prod.ts      ← API base URL (prod)
└── tsconfig.json, angular.json      ← Angular CLI config (already exists)
```

---

## Task 1: Create Chat Models (Types & Interfaces)

**Files:**
- Create: `src/app/chat/chat.models.ts`

- [ ] **Step 1: Create the chat models file**

```typescript
// src/app/chat/chat.models.ts

export interface Message {
  role: 'user' | 'bot';
  text: string;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  infografiaUrl: string | null;
  vecesConsultada: number;
  normalizedQuestion: string;
  category: string;
}

export interface ChatRequest {
  pregunta: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/chat/chat.models.ts
git commit -m "feat: add chat models and interfaces"
```

---

## Task 2: Create Chat Service with API Integration

**Files:**
- Create: `src/app/chat/chat.service.ts`
- Create: `src/app/environments/environment.ts`
- Create: `src/app/environments/environment.prod.ts`

- [ ] **Step 1: Create environment configuration**

```typescript
// src/app/environments/environment.ts

export const environment = {
  apiUrl: 'http://localhost:7071'
};
```

```typescript
// src/app/environments/environment.prod.ts

export const environment = {
  apiUrl: 'http://localhost:7071'
};
```

- [ ] **Step 2: Create chat.service.ts with API method**

```typescript
// src/app/chat/chat.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequest, ChatResponse } from './chat.models';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/api/ConsultarFunction`;

  constructor(private http: HttpClient) {}

  send(pregunta: string): Observable<ChatResponse> {
    const request: ChatRequest = { pregunta };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'competencialab'
    });

    return this.http.post<ChatResponse>(this.apiUrl, request, { headers });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/environments/ src/app/chat/chat.service.ts
git commit -m "feat: add chat service with API integration"
```

---

## Task 3: Configure Angular App with HTTP Provider

**Files:**
- Create: `src/app/app.config.ts`

- [ ] **Step 1: Create app configuration**

```typescript
// src/app/app.config.ts

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient()
  ]
};
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app.config.ts
git commit -m "feat: configure Angular with HTTP provider"
```

---

## Task 4: Create Global Styles

**Files:**
- Create: `src/styles.css`

- [ ] **Step 1: Create global styles with CSS variables**

```css
/* src/styles.css */

:root {
  --color-accent: #ff9f1c;
  --color-accent-light: #ffbf69;
  --color-bg: #ffffff;
  --color-chat-bg: #cbf3f0;
  --color-primary: #2ec4b6;
  --color-text: #333333;
  --color-error: #d32f2f;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: var(--color-text);
}

app-root {
  display: block;
  height: 100%;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles.css
git commit -m "feat: add global styles with CSS variables"
```

---

## Task 5: Create Chat Component (Signals & Logic)

**Files:**
- Create: `src/app/chat/chat.component.ts`

- [ ] **Step 1: Create chat component with Signals**

```typescript
// src/app/chat/chat.component.ts

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

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
  messages = signal<Message[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  inputValue = signal('');

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Component initialization if needed
  }

  onSendMessage(): void {
    const pregunta = this.inputValue().trim();

    if (!pregunta) {
      return;
    }

    // Add user message to history
    this.messages.update(msgs => [
      ...msgs,
      { role: 'user', text: pregunta }
    ]);

    // Clear input and enable loading state
    this.inputValue.set('');
    this.loading.set(true);
    this.errorMessage.set(null);

    // Call service
    this.chatService.send(pregunta).subscribe({
      next: (response) => {
        // Add bot message to history
        this.messages.update(msgs => [
          ...msgs,
          { role: 'bot', text: response.answer }
        ]);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al consultar el servicio. Inténtalo de nuevo.');
        this.loading.set(false);
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.loading()) {
      event.preventDefault();
      this.onSendMessage();
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/chat/chat.component.ts
git commit -m "feat: create chat component with Signals and logic"
```

---

## Task 6: Create Chat Component Template

**Files:**
- Create: `src/app/chat/chat.component.html`

- [ ] **Step 1: Create chat template**

```html
<!-- src/app/chat/chat.component.html -->

<div class="chat-container">
  <!-- Messages area -->
  <div class="messages-area">
    @for (message of messages(); track $index) {
      <div [ngClass]="['message', message.role]">
        <div class="message-bubble">
          {{ message.text }}
        </div>
      </div>
    }

    @if (loading()) {
      <div class="message bot">
        <div class="message-bubble loading">
          <span class="dots">...</span>
        </div>
      </div>
    }

    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
      </div>
    }
  </div>

  <!-- Input area -->
  <div class="input-area">
    <input
      type="text"
      class="input-field"
      placeholder="Escribe tu pregunta..."
      [(ngModel)]="inputValue"
      (keydown)="onKeyDown($event)"
      [disabled]="loading()"
      required
    />
    <button
      class="send-button"
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
git commit -m "feat: create chat component template"
```

---

## Task 7: Create Chat Component Styles

**Files:**
- Create: `src/app/chat/chat.component.css`

- [ ] **Step 1: Create chat styles**

```css
/* src/app/chat/chat.component.css */

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  background-color: var(--color-bg);
}

/* Messages Area */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

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
  padding: 0.75rem 1rem;
  border-radius: 8px;
  word-wrap: break-word;
  line-height: 1.4;
}

.message.user .message-bubble {
  background-color: var(--color-accent-light);
  color: #333;
}

.message.bot .message-bubble {
  background-color: var(--color-chat-bg);
  color: #333;
}

.message-bubble.loading {
  font-style: italic;
  color: #666;
}

.dots {
  display: inline-block;
  animation: dots 1.4s infinite;
}

@keyframes dots {
  0%, 20% {
    content: '.';
  }
  40% {
    content: '..';
  }
  60%, 100% {
    content: '...';
  }
}

/* Error Banner */
.error-banner {
  background-color: var(--color-error);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin: 0.5rem 0;
  text-align: center;
}

/* Input Area */
.input-area {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-primary);
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.1);
}

.input-field:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.send-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background-color: #e68500;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Scrollbar styling */
.messages-area::-webkit-scrollbar {
  width: 8px;
}

.messages-area::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-area::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.messages-area::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/chat/chat.component.css
git commit -m "feat: create chat component styles"
```

---

## Task 8: Create Root Component

**Files:**
- Create: `src/app/app.component.ts`
- Create: `src/app/app.component.html`
- Create: `src/app/app.component.css`

- [ ] **Step 1: Create root component**

```typescript
// src/app/app.component.ts

import { Component } from '@angular/core';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
```

```html
<!-- src/app/app.component.html -->

<app-chat></app-chat>
```

```css
/* src/app/app.component.css */

:host {
  display: block;
  height: 100%;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app.component.ts src/app/app.component.html src/app/app.component.css
git commit -m "feat: create root app component"
```

---

## Task 9: Create Main Entry Point

**Files:**
- Create: `src/main.ts`

- [ ] **Step 1: Create main.ts bootstrap**

```typescript
// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
```

- [ ] **Step 2: Commit**

```bash
git add src/main.ts
git commit -m "feat: create application bootstrap"
```

---

## Task 10: Create HTML Entry Point

**Files:**
- Create: `src/index.html`

- [ ] **Step 1: Create index.html**

```html
<!-- src/index.html -->

<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>normix - Chatbot</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/index.html
git commit -m "feat: create HTML entry point"
```

---

## Task 11: Update Angular Configuration

**Files:**
- Modify: `angular.json`

- [ ] **Step 1: Review and update angular.json if needed**

The `angular.json` should be configured to use:
- `src/main.ts` as the main entry point
- `src/index.html` as the index
- `src/styles.css` as global stylesheet

Check that the serve configuration points to the correct files. If using Angular 20+, it should be auto-configured by `ng new`.

- [ ] **Step 2: Commit if changes were made**

```bash
git add angular.json
git commit -m "chore: verify angular.json configuration"
```

---

## Task 12: Verify and Test in Browser

**Files:**
- No files created/modified in this task

- [ ] **Step 1: Start the development server**

```bash
ng serve
```

Expected output:
```
⠏ Building...
✔ Compiled successfully.
✔ Application bundle generated successfully in 2.34 seconds.
Application bundle generation complete. [4.45 seconds]

Watch mode enabled. Watching for file changes in /path/to/project...
Local:   http://localhost:4200/
```

- [ ] **Step 2: Open browser and test the application**

Open `http://localhost:4200` in your browser.

Expected behavior:
1. Page shows a full-screen chat interface
2. Input field at bottom with "Escribe tu pregunta..." placeholder
3. "Enviar" button next to input
4. Click input and type a question
5. Press Enter or click Enviar button
6. User message appears in the chat on the right (light orange background)
7. Loading indicator appears ("..." in turquoise bubble)
8. After API responds, bot message appears on the left (turquoise background) with the markdown answer
9. If API fails, error message appears in red

- [ ] **Step 3: Test error handling**

Make sure to test with an invalid endpoint or network error to verify:
- Error banner displays: "Error al consultar el servicio. Inténtalo de nuevo."
- Loading state clears
- Input is re-enabled

- [ ] **Step 4: Final commit (if any fixes were needed)**

```bash
git add .
git commit -m "chore: verify browser functionality and layout"
```

---

## Self-Review Checklist

**Spec Coverage:**
- ✅ Standalone Angular 20+ component
- ✅ Signals for state (messages, loading, errorMessage)
- ✅ ChangeDetectionStrategy.OnPush
- ✅ HttpClient with API key header
- ✅ Full-screen chat layout (height: 100dvh)
- ✅ Message bubbles (user right, bot left)
- ✅ Input field + button
- ✅ Loading indicator
- ✅ Error message
- ✅ CSS variables for colors
- ✅ POST to http://localhost:7071/api/ConsultarFunction
- ✅ Request body: { pregunta: string }
- ✅ Response parsing (answer field)
- ✅ No routing, no modules, no interceptors
- ✅ camelCase for methods, kebab-case for selectors
- ✅ In-memory message history (no persistence)

**No Placeholders:** All code is complete and production-ready. No "TBD", no placeholder implementations, no stubbed methods.

**Type Consistency:** ChatResponse interface matches what the API returns; ChatRequest matches what we send; Message interface is used consistently throughout.

---

## Next Steps

Plan complete and saved to `docs/superpowers/plans/2026-05-06-normix-chatbot.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration with quality checkpoints.

2. **Inline Execution** — I execute tasks in this session using executing-plans, with batch execution and checkpoints for review.

**Which approach would you like?**
