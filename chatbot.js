// Chatbot functionality
class Chatbot {
    constructor() {
        this.webhookUrl = 'https://unsystematizing-snitchier-lane.ngrok-free.dev/webhook/portfolio-chat';
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatUI();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createChatUI() {
        // Create chat button
        const chatButton = document.createElement('button');
        chatButton.className = 'chat-button';
        chatButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
            </svg>
            <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        document.body.appendChild(chatButton);

        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <div class="chat-avatar">M</div>
                <div class="chat-header-info">
                    <h3>Mushaf AI Assistant</h3>
                    <p><span class="chat-status"></span>Online - Ask me anything!</p>
                </div>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="welcome-message">
                    <h4>👋 Welcome!</h4>
                    <p>Hi! I'm Mushaf's AI assistant. How can I help you today?</p>
                </div>
            </div>
            <div class="typing-indicator">
                <div class="message-avatar">M</div>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div class="error-message" id="errorMessage">
                Failed to send message. Please try again.
            </div>
            <div class="chat-input">
                <form class="chat-input-form" id="chatForm">
                    <input 
                        type="text" 
                        id="chatInput" 
                        placeholder="Type your message..."
                        autocomplete="off"
                        required
                    >
                    <button type="submit" class="chat-send-btn" id="sendBtn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(chatContainer);

        this.chatButton = chatButton;
        this.chatContainer = chatContainer;
        this.chatMessages = document.getElementById('chatMessages');
        this.chatForm = document.getElementById('chatForm');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = chatContainer.querySelector('.typing-indicator');
        this.errorMessage = document.getElementById('errorMessage');
    }

    attachEventListeners() {
        // Toggle chat
        this.chatButton.addEventListener('click', () => this.toggleChat());

        // Handle form submission
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.chatContainer.contains(e.target) && 
                !this.chatButton.contains(e.target)) {
                this.toggleChat();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatButton.classList.toggle('active');
        this.chatContainer.classList.toggle('active');
        
        if (this.isOpen) {
            this.chatInput.focus();
        }
    }

    addWelcomeMessage() {
        // Welcome message is already in HTML
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        
        if (!message) return;

        // Hide error message
        this.errorMessage.classList.remove('active');

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.chatInput.value = '';
        
        // Disable send button and show typing indicator
        this.sendBtn.disabled = true;
        this.showTypingIndicator();

        try {
            // Send message to webhook
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    timestamp: new Date().toISOString(),
                    userId: this.getUserId()
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Log the response for debugging
            console.log('Webhook response:', data);
            
            // Hide typing indicator
            this.hideTypingIndicator();

            // Add bot response - handle multiple possible response formats
            let botMessage;
            
            // Check various possible response structures
            if (data.response) {
                botMessage = data.response;
            } else if (data.message) {
                botMessage = data.message;
            } else if (data.output) {
                botMessage = data.output;
            } else if (data.text) {
                botMessage = data.text;
            } else if (data.reply) {
                botMessage = data.reply;
            } else if (data.data && data.data.response) {
                botMessage = data.data.response;
            } else if (data.data && data.data.message) {
                botMessage = data.data.message;
            } else if (typeof data === 'string') {
                botMessage = data;
            } else {
                // If none of the above, try to get the first property value
                const firstKey = Object.keys(data)[0];
                botMessage = data[firstKey] || "I received your message! Let me help you with that.";
            }
            
            this.addMessage(botMessage, 'bot');

        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.showError();
            
            // Fallback response
            this.addMessage("I'm having trouble connecting right now. Please try again or contact me directly via email.", 'bot');
        } finally {
            // Re-enable send button
            this.sendBtn.disabled = false;
        }
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-avatar">${type === 'bot' ? 'M' : 'U'}</div>
            <div class="message-content">
                <div class="message-bubble">${this.escapeHtml(text)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Store message
        this.messages.push({ text, type, time });
    }

    showTypingIndicator() {
        this.typingIndicator.classList.add('active');
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.classList.remove('active');
    }

    showError() {
        this.errorMessage.classList.add('active');
        setTimeout(() => {
            this.errorMessage.classList.remove('active');
        }, 5000);
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getUserId() {
        // Generate or retrieve user ID from localStorage
        let userId = localStorage.getItem('chatUserId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatUserId', userId);
        }
        return userId;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
