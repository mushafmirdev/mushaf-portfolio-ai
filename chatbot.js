class Chatbot {
    constructor() {
        this.webhookUrl = 'https://unsystematizing-snitchier-lane.ngrok-free.dev/webhook/portfolio-chat';
        this.isOpen = false;
        this.messages = [];
        this.createChatUI();
        this.attachEventListeners();
    }

    createChatUI() {
        const chatButton = document.createElement('button');
        chatButton.className = 'chat-button';
        chatButton.type = 'button';
        chatButton.setAttribute('aria-label', 'Open AI chat');
        chatButton.setAttribute('aria-expanded', 'false');
        chatButton.setAttribute('aria-controls', 'chatContainer');
        chatButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v12H7l-3 3V4zm4 4h8v1H8zm0 4h6v1H8z"/></svg>';
        document.body.appendChild(chatButton);

        const chatContainer = document.createElement('section');
        chatContainer.className = 'chat-container';
        chatContainer.id = 'chatContainer';
        chatContainer.setAttribute('role', 'dialog');
        chatContainer.setAttribute('aria-label', 'Mushaf AI Assistant');
        chatContainer.hidden = true;
        chatContainer.innerHTML = `
            <header class="chat-header">
                <div>
                    <h2>Mushaf AI Assistant</h2>
                    <p>Ask about projects, skills, or services</p>
                </div>
                <button class="chat-close" type="button" aria-label="Close chat">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
                </button>
            </header>
            <div class="chat-messages" id="chatMessages" role="log" aria-live="polite" aria-relevant="additions"></div>
            <p class="chat-status" id="chatStatus" role="status" aria-live="polite"></p>
            <form class="chat-input-form" id="chatForm">
                <label class="sr-only" for="chatInput">Your message</label>
                <input type="text" id="chatInput" placeholder="Write a message…" autocomplete="off" required>
                <button type="submit" class="chat-send-btn" id="sendBtn" aria-label="Send message">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 21 3l-8.5 18-2-7.5L3 11.5zm7.5 2L21 3"/></svg>
                </button>
            </form>
        `;
        document.body.appendChild(chatContainer);

        this.chatButton = chatButton;
        this.chatContainer = chatContainer;
        this.chatMessages = chatContainer.querySelector('#chatMessages');
        this.chatForm = chatContainer.querySelector('#chatForm');
        this.chatInput = chatContainer.querySelector('#chatInput');
        this.sendBtn = chatContainer.querySelector('#sendBtn');
        this.chatStatus = chatContainer.querySelector('#chatStatus');
        this.closeButton = chatContainer.querySelector('.chat-close');
    }

    attachEventListeners() {
        this.chatButton.addEventListener('click', () => this.setOpen(!this.isOpen));
        this.closeButton.addEventListener('click', () => this.setOpen(false));
        this.chatForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.sendMessage();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen) this.setOpen(false);
        });
        document.addEventListener('click', (event) => {
            if (this.isOpen && !this.chatContainer.contains(event.target) && !this.chatButton.contains(event.target)) {
                this.setOpen(false);
            }
        });
    }

    setOpen(isOpen) {
        this.isOpen = isOpen;
        this.chatContainer.hidden = !isOpen;
        this.chatButton.setAttribute('aria-expanded', String(isOpen));
        this.chatButton.setAttribute('aria-label', isOpen ? 'Close AI chat' : 'Open AI chat');
        if (isOpen) this.chatInput.focus();
        else this.chatButton.focus();
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.sendBtn.disabled) return;

        this.chatStatus.textContent = '';
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.sendBtn.disabled = true;
        this.chatStatus.textContent = 'Sending…';

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    timestamp: new Date().toISOString(),
                    userId: this.getUserId()
                })
            });

            if (!response.ok) throw new Error('The assistant could not be reached.');

            const data = await response.json();
            const botMessage = this.getResponseText(data);
            this.addMessage(botMessage, 'bot');
            this.chatStatus.textContent = '';
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('I could not connect just now. Please try again or email me directly.', 'bot');
            this.chatStatus.textContent = 'Message not sent. Check your connection and try again.';
        } finally {
            this.sendBtn.disabled = false;
            this.chatInput.focus();
        }
    }

    getResponseText(data) {
        if (typeof data === 'string') return data;
        const candidates = [data?.response, data?.message, data?.output, data?.text, data?.reply, data?.data?.response, data?.data?.message];
        const response = candidates.find((candidate) => typeof candidate === 'string' && candidate.trim());
        if (response) return response;
        const firstValue = data && typeof data === 'object' ? Object.values(data)[0] : null;
        return typeof firstValue === 'string' ? firstValue : 'I received your message, but could not read the response.';
    }

    addMessage(text, type) {
        const messageElement = document.createElement('article');
        messageElement.className = `message ${type}`;
        const bubble = document.createElement('p');
        bubble.className = 'message-bubble';
        bubble.textContent = String(text);
        messageElement.appendChild(bubble);
        this.chatMessages.appendChild(messageElement);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        this.messages.push({ text: String(text), type, time: new Date().toISOString() });
    }

    getUserId() {
        let userId;
        try {
            userId = localStorage.getItem('chatUserId');
            if (!userId) {
                userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
                localStorage.setItem('chatUserId', userId);
            }
        } catch (error) {
            userId = `user_${Date.now()}`;
        }
        return userId;
    }
}

new Chatbot();
