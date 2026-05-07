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

const SUGGESTED = [
  "¿Qué es la Ley Fintech?",
  "¿Cómo registro una operación?",
  "Requisitos de KYC",
  "¿Qué reporta la CNBV?",
];

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
  suggestedQuestions = signal<string[]>(SUGGESTED);

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Component initialization if needed
  }

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

export { SUGGESTED };
