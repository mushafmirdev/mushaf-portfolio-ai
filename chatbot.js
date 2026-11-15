class Chatbot {
    constructor() {
        this.webhookUrl = 'https://unsystematizing-snitchier-lane.ngrok-free.dev/webhook/portfolio-chat';
        this.isOpen = false;
        this.messages = [];
        this.createChatUI();
        this.attachEventListeners();
        this.renderInitialGreeting();
    }

    createChatUI() {
        // 1. Floating trigger button with online ping badge and morphing icon
        const chatButton = document.createElement('button');
        chatButton.className = 'chat-button';
        chatButton.type = 'button';
        chatButton.setAttribute('aria-label', 'Open AI chat');
        chatButton.setAttribute('aria-expanded', 'false');
        chatButton.setAttribute('aria-controls', 'chatContainer');
        chatButton.innerHTML = `
            <span class="chat-badge-online" aria-hidden="true" title="Online"></span>
            <span class="chat-btn-icon chat-icon-open" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-7.74 16.33l-1.07 3.23a1 1 0 0 0 1.25 1.25l3.23-1.07A10 10 0 1 0 12 2zm0 18a7.96 7.96 0 0 1-4.08-1.12.8.8 0 0 0-.58-.08l-2.07.69.69-2.07a.8.8 0 0 0-.08-.58A7.98 7.98 0 1 1 12 20zm-3-9a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm3 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm3 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z"/></svg>
            </span>
            <span class="chat-btn-icon chat-icon-close" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
            </span>
        `;
        document.body.appendChild(chatButton);

        // 2. Main Chat Container Window
        const chatContainer = document.createElement('section');
        chatContainer.className = 'chat-container';
        chatContainer.id = 'chatContainer';
        chatContainer.setAttribute('role', 'dialog');
        chatContainer.setAttribute('aria-label', 'Mushaf AI Assistant');
        chatContainer.setAttribute('aria-hidden', 'true');
        chatContainer.innerHTML = `
            <header class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar" aria-hidden="true">
                        <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="3"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="16" y1="16" x2="16.01" y2="16"></line><path d="M9 19h6"></path></svg>
                        <span class="chat-avatar-status" title="Active"></span>
                    </div>
                    <div>
                        <div class="chat-title-row">
                            <h2>Mushaf AI</h2>
                            <span class="chat-badge-agent">AI Agent</span>
                        </div>
                        <p class="chat-header-subtitle">
                            <span class="live-pulse-dot" aria-hidden="true"></span> Online · Ask me anything
                        </p>
                    </div>
                </div>
                <div class="chat-header-actions">
                    <button class="chat-header-btn chat-restart-btn" type="button" aria-label="Restart chat" title="Restart conversation">
                        <svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 13.66-5.66L20 4v6h-6l2.34-2.34A6 6 0 1 0 18 12h2a8 8 0 0 1-16 0z"/></svg>
                    </button>
                    <button class="chat-header-btn chat-close" type="button" aria-label="Close chat" title="Close chat">
                        <svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
                    </button>
                </div>
            </header>

            <div class="chat-messages" id="chatMessages" role="log" aria-live="polite" aria-relevant="additions"></div>

            <div class="chat-suggestions" id="chatSuggestions" aria-label="Suggested questions">
                <span class="suggestions-label">Popular questions</span>
                <div class="suggestions-track">
                    <button type="button" class="suggestion-chip" data-query="Tell me about your featured projects">🚀 Featured projects</button>
                    <button type="button" class="suggestion-chip" data-query="What is your published research paper?">📄 Published research</button>
                    <button type="button" class="suggestion-chip" data-query="What are your core AI & ML skills?">🧠 AI &amp; ML skills</button>
                    <button type="button" class="suggestion-chip" data-query="What services do you offer?">⚡ Services</button>
                    <button type="button" class="suggestion-chip" data-query="How can I contact Mushaf?">📬 Contact &amp; hire</button>
                </div>
            </div>

            <p class="chat-status" id="chatStatus" role="status" aria-live="polite"></p>

            <form class="chat-input-form" id="chatForm">
                <div class="chat-input-wrap">
                    <label class="sr-only" for="chatInput">Your message</label>
                    <input type="text" id="chatInput" placeholder="Ask about projects, skills, services…" autocomplete="off" required>
                    <button type="submit" class="chat-send-btn" id="sendBtn" aria-label="Send message" title="Send message">
                        <svg viewBox="0 0 24 24"><path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"/></svg>
                    </button>
                </div>
                <div class="chat-input-footer">
                    <span>AI Assistant · Answers based on Mushaf's portfolio</span>
                </div>
            </form>
        `;
        document.body.appendChild(chatContainer);

        this.chatButton = chatButton;
        this.chatContainer = chatContainer;
        this.chatMessages = chatContainer.querySelector('#chatMessages');
        this.chatSuggestions = chatContainer.querySelector('#chatSuggestions');
        this.chatForm = chatContainer.querySelector('#chatForm');
        this.chatInput = chatContainer.querySelector('#chatInput');
        this.sendBtn = chatContainer.querySelector('#sendBtn');
        this.chatStatus = chatContainer.querySelector('#chatStatus');
        this.closeButton = chatContainer.querySelector('.chat-close');
        this.restartButton = chatContainer.querySelector('.chat-restart-btn');
    }

    attachEventListeners() {
        // Toggle chat
        this.chatButton.addEventListener('click', () => this.setOpen(!this.isOpen));
        this.closeButton.addEventListener('click', () => this.setOpen(false));

        // Restart conversation
        this.restartButton.addEventListener('click', () => this.restartChat());

        // Suggestion chips
        this.chatSuggestions.addEventListener('click', (event) => {
            const chip = event.target.closest('.suggestion-chip');
            if (!chip) return;
            const query = chip.getAttribute('data-query');
            if (query) {
                this.chatInput.value = query;
                this.sendMessage();
            }
        });

        // Form submit
        this.chatForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.sendMessage();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen) this.setOpen(false);
        });

        // Click outside to close
        document.addEventListener('click', (event) => {
            if (this.isOpen &&
                !this.chatContainer.contains(event.target) &&
                !this.chatButton.contains(event.target) &&
                !event.target.closest('.chat-button') &&
                !event.target.closest('[onclick*="chat-button"]')) {
                this.setOpen(false);
            }
        });
    }

    setOpen(isOpen) {
        this.isOpen = isOpen;
        this.chatContainer.classList.toggle('is-open', isOpen);
        this.chatContainer.setAttribute('aria-hidden', String(!isOpen));
        this.chatButton.setAttribute('aria-expanded', String(isOpen));
        this.chatButton.setAttribute('aria-label', isOpen ? 'Close AI chat' : 'Open AI chat');

        if (isOpen) {
            setTimeout(() => this.chatInput.focus(), 150);
        } else {
            this.chatButton.focus();
        }
    }

    renderInitialGreeting() {
        this.chatMessages.innerHTML = '';
        
        // Welcome card
        const welcomeCard = document.createElement('div');
        welcomeCard.className = 'chat-welcome-card';
        welcomeCard.innerHTML = `
            <h3><span>👋</span> Welcome!</h3>
            <p>I’m Mushaf's AI Assistant. Ask me about his machine learning research, robotics projects, generative AI applications, or collaboration opportunities.</p>
        `;
        this.chatMessages.appendChild(welcomeCard);

        // Initial bot greeting
        this.addMessage("How can I assist you with Mushaf's portfolio today? Choose a question below or type your own!", 'bot');
    }

    restartChat() {
        this.messages = [];
        this.chatStatus.textContent = '';
        this.renderInitialGreeting();
        this.chatSuggestions.style.display = 'block';
        this.chatInput.value = '';
        this.chatInput.focus();
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.sendBtn.disabled) return;

        this.chatStatus.textContent = '';
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.sendBtn.disabled = true;

        // Show animated typing indicator
        this.showTypingIndicator();

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

            this.removeTypingIndicator();

            if (!response.ok) throw new Error('The assistant could not be reached.');

            const data = await response.json();
            const botMessage = this.getResponseText(data);
            this.addMessage(botMessage, 'bot');
            this.chatStatus.textContent = '';
        } catch (error) {
            console.error('Error sending message:', error);
            this.removeTypingIndicator();
            this.addMessage('I could not reach the server just now. Please try again or email Mushaf directly at alimushaf30@gmail.com.', 'bot');
            this.chatStatus.textContent = 'Connection issue. Please try again.';
        } finally {
            this.sendBtn.disabled = false;
            this.chatInput.focus();
        }
    }

    showTypingIndicator() {
        this.removeTypingIndicator();
        const typingEl = document.createElement('article');
        typingEl.className = 'message bot typing-message';
        typingEl.id = 'chatTypingIndicator';
        typingEl.innerHTML = `
            <div class="message-meta">Mushaf AI · typing</div>
            <div class="message-bubble typing-bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        this.chatMessages.appendChild(typingEl);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    removeTypingIndicator() {
        const typingEl = document.getElementById('chatTypingIndicator');
        if (typingEl) typingEl.remove();
    }

    getResponseText(data) {
        if (typeof data === 'string') return data;
        const candidates = [data?.response, data?.message, data?.output, data?.text, data?.reply, data?.data?.response, data?.data?.message];
        const response = candidates.find((candidate) => typeof candidate === 'string' && candidate.trim());
        if (response) return response;
        const firstValue = data && typeof data === 'object' ? Object.values(data)[0] : null;
        return typeof firstValue === 'string' ? firstValue : 'I received your message, but could not read the response.';
    }

    formatTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    addMessage(text, type) {
        const messageElement = document.createElement('article');
        messageElement.className = `message ${type}`;

        const meta = document.createElement('div');
        meta.className = 'message-meta';
        meta.textContent = type === 'user' ? `You · ${this.formatTime()}` : `Mushaf AI · ${this.formatTime()}`;

        const bubble = document.createElement('p');
        bubble.className = 'message-bubble';
        bubble.textContent = String(text);

        messageElement.appendChild(meta);
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
