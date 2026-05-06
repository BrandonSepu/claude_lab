# Frontend Spec — normix Chatbot

## 1. Contexto y Objetivo

**normix** es una aplicación web de chatbot tipo pregunta–respuesta. El usuario escribe una pregunta, el frontend la envía a una API REST y muestra la respuesta. Piloto controlado: sin autenticación, sin persistencia, sin múltiples vistas.

---

## 2. Alcance Funcional

- Mostrar un chat full screen con historial de mensajes en memoria.
- Aceptar la pregunta del usuario vía un campo de texto + botón enviar.
- Llamar a `POST /api/chat` con la pregunta y mostrar la respuesta recibida.
- Mostrar un indicador de carga (`loading`) mientras la API responde.
- Mostrar un mensaje de error genérico si la llamada falla.

---

## 3. Suposiciones sobre el Modelo de Datos

Solo estructuras en memoria. No existe base de datos ni persistencia.

```ts
interface Message {
  role: 'user' | 'bot';
  text: string;
}
```

El historial (`Message[]`) vive en el componente y se descarta al recargar la página.

---

## 4. Arquitectura Frontend

```
src/app/
├── app.component.ts          ← bootstrap, importa ChatComponent
└── chat/
    ├── chat.component.ts     ← único componente con lógica + template
    └── chat.service.ts       ← HttpClient wrapper (POST /api/chat)
```

- **Standalone Components** (sin NgModule).
- **`ChangeDetectionStrategy.OnPush`** en `ChatComponent`.
- **Signals** para `messages`, `loading` y `errorMessage`.
- `HttpClient` provisto en `app.config.ts` con `provideHttpClient()`.
- Sin routing (un solo componente raíz).

---

## 5. Vista Única: Chat Full Screen

| Zona | Contenido |
|---|---|
| Área de mensajes | Lista scrollable de burbujas usuario / bot |
| Barra inferior fija | Input texto + botón "Enviar" |
| Estado loading | Burbuja bot con spinner o texto "..." |
| Estado error | Banner/mensaje inline rojo genérico |

**Paleta de colores:**

| Token | Hex | Uso |
|---|---|---|
| `--color-accent` | `#ff9f1c` | Botón enviar (fondo) |
| `--color-accent-light` | `#ffbf69` | Burbuja usuario |
| `--color-bg` | `#ffffff` | Fondo general |
| `--color-chat-bg` | `#cbf3f0` | Burbuja bot |
| `--color-primary` | `#2ec4b6` | Barra inferior, foco del input |

Layout: `height: 100dvh; display: flex; flex-direction: column;`

---

## 6. Flujo Único de Usuario

```
Usuario escribe pregunta
       ↓
Pulsa "Enviar" (o Enter)
       ↓
Mensaje usuario → messages[]
loading = true, input deshabilitado
       ↓
POST /api/chat  { question: string }
       ↓
  ┌── 2xx ──────────────────────────────┐
  │ Mensaje bot → messages[]            │
  │ loading = false                     │
  └─────────────────────────────────────┘
  ┌── Error ────────────────────────────┐
  │ errorMessage = 'Error al consultar' │
  │ loading = false                     │
  └─────────────────────────────────────┘
```

---

## 7. Formulario de Input

Un único campo:

| Atributo | Valor |
|---|---|
| Tipo | `textarea` (una línea, Enter envía) |
| Placeholder | `"Escribe tu pregunta..."` |
| Deshabilitado cuando | `loading() === true` |
| Validación | Solo `required` + longitud mínima 1 |

Sin `ReactiveFormsModule`; se usa `[(ngModel)]` o referencia de template directa para mantener simplicidad.

---

## 8. Gestión de Estado

Solo dos estados, implementados con Signals:

```ts
loading = signal(false);   // API en curso
messages = signal<Message[]>([]);
errorMessage = signal<string | null>(null);
```

No existe estado global, store, ni BehaviorSubject. Todo vive en `ChatComponent`.

---

## 9. Autorización y Permisos

**NO APLICA.** Sin autenticación, sin guards, sin interceptores, sin roles.

---

## 10. Manejo de Errores

Única regla: si `HttpClient` lanza error (cualquier código HTTP o red), mostrar:

> *"Error al consultar el servicio. Inténtalo de nuevo."*

Sin logging, sin reintentos, sin clasificación de errores.

---

## 11. Integración con Backend

**Endpoint único:**

```
POST /api/chat
Content-Type: application/json

Request:
{ "question": string }

Response 200:
{ "answer": string }
```

- La URL base se configura en `environment.ts` → `apiUrl: '/api'`.
- `chat.service.ts` expone un único método:

```ts
send(question: string): Observable<{ answer: string }>
```

Sin caché, sin headers adicionales, sin auth.

---

## 12. Convenciones Técnicas Mínimas

| Ítem | Decisión |
|---|---|
| Framework | Angular 20+ |
| Componentes | Standalone con `ChangeDetectionStrategy.OnPush` |
| Estado | Signals (`signal`, `computed`) |
| HTTP | `HttpClient` + `provideHttpClient()` |
| Estilos | CSS variables en `:root`, sin preprocesadores |
| Sin | NgModule, routing, store, interceptores |
| Nombrado | `camelCase` para métodos/variables, `kebab-case` para selectores |

---

## 13. Fuera de Scope

- Autenticación / autorización
- Persistencia de historial (localStorage, BD, sesión)
- Routing / múltiples vistas
- Modularización por feature (lazy loading)
- Interceptores HTTP
- Manejo avanzado de errores (retry, clasificación, alertas)
- Tests automatizados
- Internacionalización (i18n)
- Accesibilidad avanzada (ARIA extendido)
- Responsive / mobile-first (solo desktop para el piloto)
- SSR / SSG
- PWA / Service Workers
- Dark mode
- Markdown o formato rico en respuestas
- Adjuntos / imágenes en el chat
- Streaming de respuestas (websockets / SSE)
