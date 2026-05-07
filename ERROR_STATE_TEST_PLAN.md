# Task 11: Error State Testing Plan

## Test Environment
- Frontend: http://localhost:4200
- Backend: http://localhost:7071
- Service: Chat with error triggering modified

## Test Configuration
A temporary modification was made to `chat.service.ts` to trigger errors when the user message contains the word "error" (case-insensitive).

## Test Steps

### Step 1: Verify Error Trigger Setup
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to http://localhost:4200 (should already be open)

### Step 2: Trigger Error State
1. In the chat input, type: "error" (or any message containing "error")
2. Click "Enviar" or press Enter
3. Wait ~500ms for the error to trigger

**Expected Results:**
- User message appears in chat ("error")
- NO typing dots appear (error happens before bot response)
- Red error banner appears below the last message
- Banner text: "Error al consultar el servicio. Inténtalo de nuevo."
- Banner styling:
  - Red background (--error: #e74c3c)
  - White text
  - Border: 2px solid red
  - Centered text

### Step 3: Verify Input State During Error
1. Observe the input field and send button

**Expected Results:**
- Input field is NOT disabled (not grayed out)
- Input field is empty (cleared after sending)
- Send button is NOT disabled (can click)
- Can type in the input field

### Step 4: Test Retry (New Message)
1. Type a new question: "¿Qué es la CNBV?" (without "error" keyword)
2. Click "Enviar" or press Enter

**Expected Results:**
- Previous error banner disappears
- User message appears in chat
- Typing dots appear (loading state)
- After ~2-3 seconds, bot response appears
- Chat flow continues normally

### Step 5: Verify Error Banner Behavior
1. After bot responds, check if error banner is visible

**Expected Results:**
- No error banner visible
- Error state cleared properly
- Only messages and typing dots show

### Step 6: Test Another Error
1. Type another message with "error": "How to handle error cases?"
2. Send the message

**Expected Results:**
- Same error banner behavior as Step 2
- Consistent error handling

### Step 7: Test Retry from Error
1. After error banner appears, type: "¿Cuál es el propósito de la CNBV?"
2. Send the message

**Expected Results:**
- Error banner disappears
- New message flow starts
- Typing dots appear
- Bot responds normally

### Step 8: Console Verification
1. Check Console (F12 → Console tab)

**Expected Results:**
- When error occurs: "Error al consultar el servicio" log appears
- NO red exception/error stack trace
- Error is logged but handled gracefully
- No unhandled promise rejections

## Detailed CSS Verification

### Error Banner CSS Classes
```css
.error-banner {
  background-color: var(--error);  /* #e74c3c - red */
  color: white;
  padding: 12px 16px;
  border-radius: 4px;
  margin: 0.5rem 0;
  text-align: center;
  font-size: 14px;
  border: 2px solid var(--error);
}
```

### Component Code Verification

#### HTML (chat.component.html):
```html
<!-- Error State -->
@if (errorMessage()) {
  <div class="error-banner">{{ errorMessage() }}</div>
}
```

#### TypeScript (chat.component.ts):
```typescript
onSendMessage(): void {
  // ... message setup ...
  this.loading.set(true);
  this.errorMessage.set(null);  // Clear previous errors
  
  this.chatService.send(pregunta).subscribe({
    next: (response) => {
      // ... handle success ...
      this.loading.set(false);
    },
    error: () => {
      console.log('Error al consultar el servicio');
      this.errorMessage.set('Error al consultar el servicio. Inténtalo de nuevo.');
      this.loading.set(false);
    }
  });
}
```

## Cleanup After Testing
After testing is complete:
1. Restore chat.service.ts to remove the error trigger
2. The modification will be reverted in git

## Pass/Fail Criteria

### PASS if:
✓ Error banner displays with correct styling
✓ Error banner shows correct Spanish message
✓ Input field remains enabled during error
✓ Send button remains enabled during error
✓ Can retry by sending new message
✓ Error banner disappears after successful send
✓ Console shows handled error log (no exceptions)
✓ Multiple error/retry cycles work correctly

### FAIL if:
✗ Error banner doesn't appear
✗ Error banner styling incorrect (wrong color, border, text)
✗ Input field becomes disabled on error
✗ Send button becomes disabled on error
✗ Error banner persists after successful send
✗ Cannot retry after error
✗ Console shows unhandled exception
✗ Error message is different text
