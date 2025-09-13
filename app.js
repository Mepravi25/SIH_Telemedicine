// Enhanced MediGram Emergency Telemedicine App JavaScript with Full Chat System

// Application state
let currentScreen = 'login';
let selectedLanguage = 'english';
let isOnline = true;
let cartItems = [];
let uploadedPhotos = [];
let currentCall = null;
let emergencyCall = null;
let orderTracking = null;
let notifications = [];
let otpTimer = null;
let otpCountdown = 30;
let phoneNumber = '';
let selectedEmergencyType = null;
let emergencyDoctors = [];
let emergencyConnectionStatus = 'waiting';
let ambulanceDispatched = false;

// Chat System State
let currentChat = null;
let chatHistory = {};
let activeChats = [];
let typingTimeouts = {};
let lastMessageId = 0;
let autoResponseTimeouts = [];

let currentPrescription = {
  patientName: '',
  patientAge: '',
  chiefComplaint: '',
  medicines: [],
  specialInstructions: '',
  followupDuration: ''
};
let voiceRecording = false;

// Enhanced sample data with comprehensive chat system
const appData = {
  doctors: [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      specialty: "General Medicine",
      hospital: "Nabha Civil Hospital",
      experience: "15 years",
      rating: 4.8,
      status: "online",
      avatar: "👨‍⚕️",
      next_slot: "7:00 PM Today"
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialty: "Pediatrics",
      hospital: "Punjab Medical College",
      experience: "12 years",
      rating: 4.9,
      status: "busy",
      avatar: "👩‍⚕️",
      next_slot: "8:30 PM Today"
    },
    {
      id: 3,
      name: "Dr. Amandeep Singh",
      specialty: "Cardiology",
      hospital: "Rajindra Hospital",
      experience: "20 years",
      rating: 4.7,
      status: "online",
      avatar: "👨‍⚕️",
      next_slot: "9:00 PM Today"
    }
  ],
  emergency_doctors: [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      specialty: "Emergency Medicine",
      hospital: "Nabha Civil Hospital",
      emergency_duty: true,
      avg_response_time: "45 seconds",
      status: "available",
      avatar: "👨‍⚕️"
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialty: "Critical Care",
      hospital: "Punjab Medical College", 
      emergency_duty: true,
      avg_response_time: "60 seconds",
      status: "available",
      avatar: "👩‍⚕️"
    },
    {
      id: 3,
      name: "Dr. Amandeep Singh",
      specialty: "Cardiology",
      hospital: "Rajindra Hospital",
      emergency_duty: false,
      avg_response_time: "120 seconds",
      status: "off_duty",
      avatar: "👨‍⚕️"
    }
  ],
  emergency_types: [
    {
      id: "accident",
      name: "Accident/Injury",
      icon: "🚑",
      priority: "critical",
      description: "Road accident, fall, cuts, fractures"
    },
    {
      id: "breathing",
      name: "Breathing Problem", 
      icon: "🫁",
      priority: "critical",
      description: "Difficulty breathing, choking, asthma attack"
    },
    {
      id: "chest_pain",
      name: "Severe Chest Pain",
      icon: "❤️",
      priority: "critical", 
      description: "Heart attack symptoms, severe chest pain"
    },
    {
      id: "unconscious",
      name: "Unconsciousness",
      icon: "😵",
      priority: "critical",
      description: "Fainting, unresponsive, seizures"
    },
    {
      id: "fever",
      name: "High Fever",
      icon: "🌡️",
      priority: "high",
      description: "Very high fever, severe illness symptoms"
    },
    {
      id: "bleeding",
      name: "Severe Bleeding",
      icon: "🩸",
      priority: "critical",
      description: "Heavy bleeding, deep cuts, trauma"
    },
    {
      id: "other",
      name: "Other Critical Emergency",
      icon: "⚠️",
      priority: "high",
      description: "Other life-threatening conditions"
    }
  ],
  medicines: [
    {
      name: "Paracetamol 500mg",
      timing: ["morning", "night"],
      meal: "after",
      dosage: "1 tablet",
      instructions: "Take with water after meals"
    },
    {
      name: "Metformin 850mg", 
      timing: ["morning", "noon", "night"],
      meal: "before",
      dosage: "1 tablet",
      instructions: "Take 30 minutes before meals"
    },
    {
      name: "Vitamin D3",
      timing: ["morning"],
      meal: "after",
      dosage: "1 capsule",
      instructions: "Take with breakfast"
    }
  ],
  pharmacies: [
    {
      name: "Nabha Medical Store",
      distance: "2.3 km",
      rating: 4.5,
      phone: "+91 98765 00001",
      pharmacist: "Mr. Harpreet Singh"
    },
    {
      name: "Punjab Pharmacy",
      distance: "3.1 km", 
      rating: 4.3,
      phone: "+91 98765 00002",
      pharmacist: "Mrs. Rajni Devi"
    },
    {
      name: "Village Health Center",
      distance: "5.2 km",
      rating: 4.1,
      phone: "+91 98765 00003",
      pharmacist: "Dr. Manpreet Kaur"
    }
  ]
};

// Chat participants data from JSON
const chatParticipants = {
  doctors: [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      specialty: "General Medicine",
      avatar: "👨‍⚕️",
      status: "online"
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialty: "Pediatrics", 
      avatar: "👩‍⚕️",
      status: "online"
    }
  ],
  pharmacists: [
    {
      id: 1,
      name: "Mr. Harpreet Singh",
      pharmacy: "Nabha Medical Store",
      avatar: "👨‍💼",
      status: "online"
    }
  ],
  support: [
    {
      id: 1,
      name: "MediGram Support",
      avatar: "🔧",
      status: "online"
    }
  ]
};

// Auto-responses data from JSON
const autoResponses = {
  doctor: [
    "Thank you for your message. Let me review your symptoms.",
    "I understand your concern. Can you tell me more about when this started?",
    "Based on what you've described, I recommend the following...",
    "Please follow the prescribed medication schedule. Any questions?",
    "I'm here to help. What specific symptoms are you experiencing?"
  ],
  pharmacist: [
    "Hello! I can help you with your medicine queries.",
    "Let me check the availability of that medicine for you.",
    "We have that in stock. I can prepare it for pickup.",
    "That medicine is currently out of stock, but we have a good alternative.",
    "Your prescription is ready. You can collect it anytime."
  ],
  emergency: [
    "This is emergency support. How can I assist you?", 
    "I'm connecting you with the nearest available doctor.",
    "Please stay calm. Help is on the way.",
    "Can you describe the emergency situation?",
    "I've alerted the emergency services. Stay on the line."
  ],
  support: [
    "Hi! I'm here to help with any app-related questions.",
    "I can guide you through using MediGram features.",
    "Let me help you with that technical issue.",
    "For medical emergencies, please use the Emergency button.",
    "Is there anything specific I can help you with today?"
  ]
};

// Quick replies from JSON
const quickReplies = [
  "Yes, that helps",
  "I need more information", 
  "Can you explain further?",
  "Thank you",
  "I have another question"
];

// Chat System Functions
function openChat(chatType, participantId = null) {
  console.log('Opening chat:', chatType, participantId);
  
  let participant;
  let chatId;
  
  switch (chatType) {
    case 'doctor':
      participant = participantId ? 
        chatParticipants.doctors.find(d => d.id === participantId) :
        chatParticipants.doctors[0];
      chatId = `doctor_${participant.id}`;
      break;
    case 'pharmacist':
      participant = participantId ? 
        chatParticipants.pharmacists.find(p => p.id === participantId) :
        chatParticipants.pharmacists[0];
      chatId = `pharmacist_${participant.id}`;
      break;
    case 'emergency':
      participant = {
        id: 'emergency',
        name: 'Emergency Support',
        avatar: '🚨',
        status: 'online'
      };
      chatId = 'emergency_support';
      break;
    case 'support':
      participant = chatParticipants.support[0];
      chatId = 'support';
      break;
    default:
      console.error('Invalid chat type:', chatType);
      return;
  }
  
  currentChat = {
    id: chatId,
    type: chatType,
    participant: participant,
    messages: chatHistory[chatId] || []
  };
  
  // Initialize chat history if it doesn't exist
  if (!chatHistory[chatId]) {
    chatHistory[chatId] = [];
    
    // Add welcome message
    const welcomeMessage = createMessage(
      getWelcomeMessage(chatType),
      'other',
      participant.name
    );
    chatHistory[chatId].push(welcomeMessage);
    currentChat.messages = chatHistory[chatId];
  }
  
  // Add to active chats if not already there
  if (!activeChats.find(chat => chat.id === chatId)) {
    activeChats.push({
      id: chatId,
      type: chatType,
      participant: participant,
      lastMessage: currentChat.messages[currentChat.messages.length - 1],
      unread: 0
    });
  }
  
  // Show chat screen and load messages
  showScreen('chat');
  loadChatInterface();
  scrollToBottom();
}

function getWelcomeMessage(chatType) {
  const welcomeMessages = {
    doctor: "Hello! I'm ready to help with your medical concerns. How are you feeling today?",
    pharmacist: "Hi! I can help you find medicines and answer questions about your prescriptions.",
    emergency: "🚨 Emergency Support Connected. Please describe your emergency situation immediately.",
    support: "Welcome to MediGram Support! How can I assist you with the app today?"
  };
  
  return welcomeMessages[chatType] || "Hello! How can I help you?";
}

function loadChatInterface() {
  if (!currentChat) return;
  
  const { participant } = currentChat;
  
  // Update chat header
  const chatAvatar = document.getElementById('chat-avatar');
  const chatParticipantName = document.getElementById('chat-participant-name');
  
  if (chatAvatar) chatAvatar.textContent = participant.avatar;
  if (chatParticipantName) chatParticipantName.textContent = participant.name;
  
  // Update status
  const statusIndicator = document.getElementById('chat-status-indicator');
  const statusText = document.getElementById('chat-status-text');
  
  if (statusIndicator && statusText) {
    statusIndicator.className = `status-indicator ${participant.status}`;
    statusText.textContent = participant.status.charAt(0).toUpperCase() + participant.status.slice(1);
  }
  
  // Show/hide video call button based on chat type
  const videoCallBtn = document.getElementById('video-call-btn');
  if (videoCallBtn) {
    if (currentChat.type === 'doctor' || currentChat.type === 'emergency') {
      videoCallBtn.classList.remove('hidden');
    } else {
      videoCallBtn.classList.add('hidden');
    }
  }
  
  // Load messages
  loadChatMessages();
  
  // Load quick replies
  loadQuickReplies();
  
  // Focus on input
  setTimeout(() => {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.focus();
    }
  }, 100);
}

function loadChatMessages() {
  const messagesContainer = document.getElementById('chat-messages');
  if (!messagesContainer || !currentChat) return;
  
  messagesContainer.innerHTML = '';
  
  currentChat.messages.forEach(message => {
    const messageElement = createMessageElement(message);
    messagesContainer.appendChild(messageElement);
  });
  
  scrollToBottom();
}

function createMessageElement(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${message.sender}`;
  messageDiv.innerHTML = `
    <div class="message-bubble">
      <p class="message-text">${message.text}</p>
      ${message.attachment ? createAttachmentHTML(message.attachment) : ''}
    </div>
    <div class="message-meta">
      <span class="message-time">${formatTime(message.timestamp)}</span>
      ${message.sender === 'user' ? `<span class="message-status ${message.status}">${getStatusIcon(message.status)}</span>` : ''}
    </div>
  `;
  
  return messageDiv;
}

function createAttachmentHTML(attachment) {
  if (attachment.type === 'image') {
    return `<div class="message-attachment">
      <img src="${attachment.url}" alt="Shared image" class="attachment-image" onclick="showImagePreview('${attachment.url}')">
    </div>`;
  } else if (attachment.type === 'file') {
    return `<div class="message-attachment">
      <div class="attachment-file" onclick="downloadFile('${attachment.url}')">
        <span>📄</span>
        <span>${attachment.name}</span>
      </div>
    </div>`;
  }
  return '';
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const minutes = Math.floor((now - date) / (1000 * 60));
    return minutes < 1 ? 'Just now' : `${minutes}m ago`;
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString();
  }
}

function getStatusIcon(status) {
  const icons = {
    sent: '✓',
    delivered: '✓✓',
    read: '✓✓'
  };
  return icons[status] || '';
}

function createMessage(text, sender, senderName = '', attachment = null) {
  return {
    id: ++lastMessageId,
    text: text,
    sender: sender,
    senderName: senderName,
    timestamp: Date.now(),
    status: sender === 'user' ? 'sent' : 'delivered',
    attachment: attachment
  };
}

function sendMessage(messageText = null) {
  if (!currentChat) return;
  
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  
  const text = messageText || (chatInput ? chatInput.value.trim() : '');
  
  if (!text) return;
  
  // Create user message
  const userMessage = createMessage(text, 'user');
  
  // Add to chat history
  currentChat.messages.push(userMessage);
  chatHistory[currentChat.id] = currentChat.messages;
  
  // Clear input
  if (chatInput) {
    chatInput.value = '';
    chatInput.focus();
  }
  
  // Disable send button temporarily
  if (sendBtn) {
    sendBtn.disabled = true;
  }
  
  // Add message to UI
  const messagesContainer = document.getElementById('chat-messages');
  if (messagesContainer) {
    const messageElement = createMessageElement(userMessage);
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
  }
  
  // Update message status to delivered after delay
  setTimeout(() => {
    userMessage.status = 'delivered';
    updateMessageStatus(userMessage);
  }, 1000);
  
  // Update to read after another delay
  setTimeout(() => {
    userMessage.status = 'read';
    updateMessageStatus(userMessage);
  }, 2000);
  
  // Show typing indicator and generate auto response
  showTypingIndicator();
  generateAutoResponse(text);
  
  // Re-enable send button
  setTimeout(() => {
    if (sendBtn) {
      sendBtn.disabled = false;
    }
  }, 1000);
}

function updateMessageStatus(message) {
  const messageElements = document.querySelectorAll('.chat-message.user');
  messageElements.forEach(element => {
    const messageId = element.dataset.messageId;
    if (messageId == message.id) {
      const statusElement = element.querySelector('.message-status');
      if (statusElement) {
        statusElement.textContent = getStatusIcon(message.status);
        statusElement.className = `message-status ${message.status}`;
      }
    }
  });
}

function showTypingIndicator() {
  const typingIndicator = document.getElementById('chat-typing-indicator');
  if (typingIndicator) {
    typingIndicator.classList.remove('hidden');
  }
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById('chat-typing-indicator');
  if (typingIndicator) {
    typingIndicator.classList.add('hidden');
  }
}

function generateAutoResponse(userMessage) {
  if (!currentChat) return;
  
  // Random delay between 2-4 seconds
  const delay = 2000 + Math.random() * 2000;
  
  const timeoutId = setTimeout(() => {
    hideTypingIndicator();
    
    // Get appropriate response based on chat type
    const responses = autoResponses[currentChat.type] || autoResponses.support;
    let responseText;
    
    // Context-aware responses
    if (userMessage.toLowerCase().includes('pain') || userMessage.toLowerCase().includes('hurt')) {
      responseText = currentChat.type === 'doctor' ? 
        "I understand you're experiencing pain. Can you describe the location and intensity of the pain on a scale of 1-10?" :
        responses[Math.floor(Math.random() * responses.length)];
    } else if (userMessage.toLowerCase().includes('medicine') || userMessage.toLowerCase().includes('prescription')) {
      responseText = currentChat.type === 'pharmacist' ? 
        "Let me check our inventory for that medication. Could you please share the prescription or medicine name?" :
        currentChat.type === 'doctor' ?
        "I'll review your current medications. Are you experiencing any side effects?" :
        responses[Math.floor(Math.random() * responses.length)];
    } else if (userMessage.toLowerCase().includes('emergency') || userMessage.toLowerCase().includes('urgent')) {
      responseText = currentChat.type === 'emergency' ? 
        "I understand this is urgent. Please provide your exact location and describe what happened." :
        "For medical emergencies, please use our Emergency consultation feature or call 108 immediately.";
    } else {
      responseText = responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Create response message
    const responseMessage = createMessage(
      responseText,
      'other',
      currentChat.participant.name
    );
    
    // Add to chat history
    currentChat.messages.push(responseMessage);
    chatHistory[currentChat.id] = currentChat.messages;
    
    // Add to UI
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
      const messageElement = createMessageElement(responseMessage);
      messagesContainer.appendChild(messageElement);
      scrollToBottom();
    }
    
    // Update active chat
    updateActiveChat(currentChat.id, responseMessage);
    
  }, delay);
  
  autoResponseTimeouts.push(timeoutId);
}

function updateActiveChat(chatId, lastMessage) {
  const activeChatIndex = activeChats.findIndex(chat => chat.id === chatId);
  if (activeChatIndex !== -1) {
    activeChats[activeChatIndex].lastMessage = lastMessage;
  }
}

function loadQuickReplies() {
  const quickRepliesContainer = document.getElementById('quick-replies');
  if (!quickRepliesContainer) return;
  
  quickRepliesContainer.innerHTML = '';
  
  // Add context-specific quick replies based on chat type
  let replies = [...quickReplies];
  
  if (currentChat && currentChat.type === 'doctor') {
    replies = ["Yes, that helps", "I have more symptoms", "When should I take medicine?", "Thank you", "I need prescription"];
  } else if (currentChat && currentChat.type === 'pharmacist') {
    replies = ["Is it available?", "What's the price?", "Any alternatives?", "When can I collect?", "Thank you"];
  } else if (currentChat && currentChat.type === 'emergency') {
    replies = ["Need ambulance", "It's getting worse", "I'm conscious", "Family notified", "Send help"];
  } else if (currentChat && currentChat.type === 'support') {
    replies = ["How do I...", "App not working", "Reset password", "Contact doctor", "Thank you"];
  }
  
  replies.forEach(reply => {
    const button = document.createElement('button');
    button.className = 'quick-reply-btn';
    button.textContent = reply;
    button.onclick = () => sendMessage(reply);
    quickRepliesContainer.appendChild(button);
  });
}

function scrollToBottom() {
  const messagesContainer = document.getElementById('chat-messages-container');
  if (messagesContainer) {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
  }
}

function goBackFromChat() {
  // Save current chat state
  if (currentChat) {
    chatHistory[currentChat.id] = currentChat.messages;
  }
  
  // Clear current chat
  currentChat = null;
  
  // Clear any pending timeouts
  autoResponseTimeouts.forEach(timeout => clearTimeout(timeout));
  autoResponseTimeouts = [];
  
  // Return to previous screen
  showScreen('consultation'); // Default back to consultation
}

function startVideoCall() {
  if (!currentChat || (currentChat.type !== 'doctor' && currentChat.type !== 'emergency')) {
    showNotification('Video calling not available for this chat type');
    return;
  }
  
  // Set up video call with current chat participant
  if (currentChat.type === 'emergency') {
    // Emergency video call
    const availableDoctor = appData.emergency_doctors.find(d => d.emergency_duty && d.status === 'available');
    if (availableDoctor) {
      emergencyCall = { 
        doctor: availableDoctor, 
        startTime: new Date(),
        emergencyType: 'chat_initiated'
      };
      showScreen('emergency-call');
      startEmergencyCallTimer();
    }
  } else {
    // Regular doctor video call
    const doctor = appData.doctors.find(d => d.name === currentChat.participant.name);
    if (doctor) {
      currentCall = { doctor, startTime: new Date() };
      const doctorNameCall = document.getElementById('doctor-name-call');
      if (doctorNameCall) {
        doctorNameCall.textContent = doctor.name;
      }
      showScreen('video-call');
      startCallTimer();
    }
  }
  
  showNotification(`📹 Starting video call with ${currentChat.participant.name}`);
}

// Chat during video call functions
function openChatDuringCall() {
  const callChat = document.getElementById('call-chat');
  if (callChat) {
    callChat.classList.toggle('hidden');
  }
}

function toggleCallChat() {
  openChatDuringCall();
}

function sendCallMessage() {
  const callChatInput = document.getElementById('call-chat-input');
  if (!callChatInput) return;
  
  const message = callChatInput.value.trim();
  if (!message) return;
  
  const messagesContainer = document.getElementById('call-chat-messages');
  if (messagesContainer) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
    messagesContainer.appendChild(messageDiv);
    
    callChatInput.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Auto response after delay
    setTimeout(() => {
      const responseDiv = document.createElement('div');
      responseDiv.className = 'chat-message doctor-message';
      responseDiv.innerHTML = `<strong>Dr. Kumar:</strong> I understand. Let me address that during our consultation.`;
      messagesContainer.appendChild(responseDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 2000);
  }
}

// File attachment functions
function attachFile() {
  showModal('photo-upload-modal');
}

function toggleEmojiPicker() {
  // Simple emoji picker simulation
  const emojis = ['😊', '👍', '❤️', '😷', '🤒', '💊', '🏥', '📋', '✅', '❓'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.value += randomEmoji;
    chatInput.focus();
  }
}

// Update existing doctor chat function
function chatWithDoctor(doctorId) {
  openChat('doctor', doctorId);
}

// Core navigation functions
function showScreen(screenId) {
  console.log('Navigating to screen:', screenId);
  
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenId + '-screen');
  if (targetScreen) {
    targetScreen.classList.add('active');
    currentScreen = screenId;
    
    // Update navigation
    updateBottomNavigation(screenId);
    
    // Show/hide header and navigation
    const header = document.getElementById('main-header');
    const bottomNav = document.getElementById('bottom-nav');
    
    if (screenId === 'login' || screenId === 'otp') {
      if (header) header.classList.add('hidden');
      if (bottomNav) bottomNav.classList.add('hidden');
    } else {
      if (header) header.classList.remove('hidden');
      if (bottomNav) bottomNav.classList.remove('hidden');
    }
    
    // Load screen-specific content
    loadScreenContent(screenId);
  }
}

function updateBottomNavigation(activeScreen) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.screen === activeScreen) {
      item.classList.add('active');
    }
  });
}

function loadScreenContent(screenId) {
  switch (screenId) {
    case 'consultation':
      loadDoctorsList();
      break;
    case 'emergency':
      loadEmergencyScreen();
      break;
    case 'health-records':
      loadHealthRecords();
      break;
    case 'medicine-finder':
      loadPharmacyStores();
      loadCommonMedicines();
      break;
    case 'prescription-creator':
      initializePrescriptionCreator();
      break;
    case 'notifications':
      loadNotifications();
      break;
    case 'cart':
      updateCartDisplay();
      break;
    case 'chat':
      // Chat screen loaded separately
      break;
  }
}

// Phone/OTP Login functionality - COMPLETELY REWRITTEN FOR RELIABILITY
function handlePhoneSubmit() {
  console.log('Phone submit handler called');
  
  const phoneInput = document.getElementById('phone-number');
  if (!phoneInput) {
    console.error('Phone input not found');
    showNotification('Error: Phone input field not found');
    return false;
  }
  
  phoneNumber = phoneInput.value.trim();
  console.log('Phone number entered:', phoneNumber);
  
  if (!phoneNumber || phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
    showNotification('Please enter a valid 10-digit mobile number');
    return false;
  }
  
  console.log('Phone number is valid, proceeding...');
  
  // Show loading state
  showLoginLoading('Sending OTP...');
  
  setTimeout(() => {
    console.log('Showing OTP screen');
    showScreen('otp');
    updatePhoneDisplay();
    startOTPTimer();
    showNotification('OTP sent to +91 ' + phoneNumber);
  }, 2000);
  
  return false;
}

function handleOTPSubmit() {
  console.log('OTP submit handler called');
  
  // Get OTP values
  let otp = '';
  for (let i = 1; i <= 6; i++) {
    const input = document.getElementById(`otp-${i}`);
    if (input) {
      otp += input.value;
    }
  }
  
  console.log('OTP entered:', otp);
  
  if (otp.length !== 6) {
    showNotification('Please enter complete 6-digit OTP');
    return false;
  }
  
  // Show loading
  showLoginLoading('Verifying OTP...');
  
  setTimeout(() => {
    console.log('OTP verification complete, logging in...');
    showLoginSuccess();
    initializeNotifications();
    initializeChatSystem();
    clearInterval(otpTimer);
    setTimeout(() => {
      showScreen('consultation');
    }, 1500);
  }, 2000);
  
  return false;
}

function handleEmailSubmit() {
  console.log('Email submit handler called');
  
  const emailInput = document.querySelector('#email-login-form input[type="email"]');
  const passwordInput = document.querySelector('#email-login-form input[type="password"]');
  
  const email = emailInput ? emailInput.value : '';
  const password = passwordInput ? passwordInput.value : '';
  
  if (!email || !password) {
    showNotification('Please enter both email and password');
    return false;
  }
  
  showLoginLoading('Signing in...');
  
  setTimeout(() => {
    showLoginSuccess();
    initializeNotifications();
    initializeChatSystem();
    setTimeout(() => {
      showScreen('consultation');
    }, 1500);
  }, 1000);
  
  return false;
}

function updatePhoneDisplay() {
  const phoneDisplay = document.getElementById('phone-display');
  if (phoneDisplay && phoneNumber) {
    const formatted = `+91 ${phoneNumber.substring(0, 5)} ${phoneNumber.substring(5)}`;
    phoneDisplay.textContent = formatted;
  }
}

function startOTPTimer() {
  otpCountdown = 30;
  const countdownElement = document.getElementById('countdown');
  const resendBtn = document.getElementById('resend-btn');
  const timerElement = document.getElementById('otp-timer');
  
  if (resendBtn) resendBtn.classList.add('hidden');
  if (timerElement) timerElement.classList.remove('hidden');
  
  otpTimer = setInterval(() => {
    otpCountdown--;
    if (countdownElement) {
      countdownElement.textContent = otpCountdown;
    }
    
    if (otpCountdown <= 0) {
      clearInterval(otpTimer);
      if (timerElement) timerElement.classList.add('hidden');
      if (resendBtn) resendBtn.classList.remove('hidden');
    }
  }, 1000);
}

function resendOTP() {
  console.log('Resending OTP');
  showNotification('Resending OTP...');
  startOTPTimer();
  setTimeout(() => {
    showNotification('OTP sent to +91 ' + phoneNumber);
  }, 2000);
}

function clearOTPInputs() {
  for (let i = 1; i <= 6; i++) {
    const input = document.getElementById(`otp-${i}`);
    if (input) {
      input.value = '';
      input.classList.remove('filled');
    }
  }
}

function showEmailLogin() {
  console.log('Showing email login');
  const phoneForm = document.getElementById('phone-login-form');
  const emailForm = document.getElementById('email-login-form');
  
  if (phoneForm) phoneForm.classList.add('hidden');
  if (emailForm) emailForm.classList.remove('hidden');
}

function showPhoneLogin() {
  console.log('Showing phone login');
  const phoneForm = document.getElementById('phone-login-form');
  const emailForm = document.getElementById('email-login-form');
  
  if (emailForm) emailForm.classList.add('hidden');
  if (phoneForm) phoneForm.classList.remove('hidden');
}

function loginWithFacebook() {
  console.log('Facebook login processing...');
  showLoginLoading('Connecting with Facebook...');
  
  setTimeout(() => {
    showLoginSuccess();
    initializeNotifications();
    initializeChatSystem();
    setTimeout(() => {
      showScreen('consultation');
    }, 1500);
  }, 1500);
}

function showLoginLoading(message) {
  const loginContainer = document.querySelector('.login-form-container');
  if (loginContainer) {
    loginContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 2rem; margin-bottom: 1rem; animation: spin 1s linear infinite;">⏳</div>
        <h3 style="color: var(--color-primary); margin-bottom: 1rem;">${message}</h3>
        <p style="color: var(--color-text-secondary);">Please wait...</p>
      </div>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  }
}

function showLoginSuccess() {
  const loginContainer = document.querySelector('.login-form-container');
  if (loginContainer) {
    loginContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
        <h3 style="color: var(--color-success); margin-bottom: 1rem;">Login Successful!</h3>
        <p style="color: var(--color-text-secondary);">Redirecting to consultation dashboard...</p>
      </div>
    `;
  }
}

function initializeChatSystem() {
  console.log('Initializing chat system...');
  
  // Initialize chat history storage
  chatHistory = {};
  activeChats = [];
  
  // Clear any existing timeouts
  autoResponseTimeouts.forEach(timeout => clearTimeout(timeout));
  autoResponseTimeouts = [];
  
  console.log('Chat system initialized successfully!');
}

// Emergency Functions - keeping existing functionality
function loadEmergencyScreen() {
  loadEmergencyTypes();
  loadEmergencyDoctors();
  initializeNetworkQuality();
}

function loadEmergencyTypes() {
  const emergencyTypesContainer = document.getElementById('emergency-types');
  if (!emergencyTypesContainer) return;
  
  emergencyTypesContainer.innerHTML = appData.emergency_types.map(type => `
    <div class="emergency-type-card" onclick="selectEmergencyType('${type.id}')" id="emergency-type-${type.id}">
      ${type.priority === 'critical' ? '<div class="priority-indicator">CRITICAL</div>' : ''}
      <div class="emergency-type-icon">${type.icon}</div>
      <div class="emergency-type-name">${type.name}</div>
      <div class="emergency-type-description">${type.description}</div>
    </div>
  `).join('');
}

function selectEmergencyType(typeId) {
  selectedEmergencyType = typeId;
  
  // Update UI
  document.querySelectorAll('.emergency-type-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  const selectedCard = document.getElementById(`emergency-type-${typeId}`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
  
  const emergencyType = appData.emergency_types.find(t => t.id === typeId);
  if (emergencyType) {
    showNotification(`Selected: ${emergencyType.name}`);
    setTimeout(() => {
      initiateEmergencyAlert();
    }, 1000);
  }
}

function initiateEmergencyAlert() {
  if (!selectedEmergencyType) return;
  
  // Show connection status
  const statusElement = document.getElementById('emergency-status');
  if (statusElement) {
    statusElement.classList.remove('hidden');
  }
  
  emergencyConnectionStatus = 'alerting';
  updateEmergencyConnectionStatus('Alerting Emergency Doctors...', 'Sending priority notification to available doctors');
  
  // Simulate doctor response
  setTimeout(() => {
    const availableDoctor = appData.emergency_doctors.find(d => d.emergency_duty && d.status === 'available');
    if (availableDoctor) {
      showDoctorResponse(availableDoctor);
    }
  }, 3000);
}

function updateEmergencyConnectionStatus(title, detail) {
  const statusTitle = document.getElementById('connection-status-text');
  const statusDetail = document.getElementById('connection-status-detail');
  
  if (statusTitle) statusTitle.textContent = title;
  if (statusDetail) statusDetail.textContent = detail;
}

function showDoctorResponse(doctor) {
  emergencyConnectionStatus = 'responding';
  
  // Hide status, show instant connection
  const statusElement = document.getElementById('emergency-status');
  const connectionElement = document.getElementById('instant-connection');
  
  if (statusElement) statusElement.classList.add('hidden');
  if (connectionElement) connectionElement.classList.remove('hidden');
  
  // Update doctor info
  const doctorName = document.getElementById('responding-doctor-name');
  if (doctorName) doctorName.textContent = doctor.name;
  
  // Start countdown
  let countdown = 30;
  const countdownElement = document.getElementById('response-countdown');
  
  const countdownTimer = setInterval(() => {
    countdown--;
    if (countdownElement) {
      countdownElement.textContent = countdown;
    }
    
    if (countdown <= 0) {
      clearInterval(countdownTimer);
      // Auto-connect if not manually joined
      if (emergencyConnectionStatus === 'responding') {
        joinEmergencyCall();
      }
    }
  }, 1000);
}

function joinEmergencyCall() {
  emergencyConnectionStatus = 'connected';
  
  const availableDoctor = appData.emergency_doctors.find(d => d.emergency_duty && d.status === 'available');
  if (availableDoctor) {
    emergencyCall = { 
      doctor: availableDoctor, 
      startTime: new Date(),
      emergencyType: selectedEmergencyType
    };
    
    // Update emergency call screen
    const emergencyDoctorName = document.getElementById('emergency-doctor-name');
    const emergencyDoctorDisplay = document.getElementById('emergency-doctor-display');
    const emergencyTypeBadge = document.getElementById('emergency-type-badge');
    
    if (emergencyDoctorName) emergencyDoctorName.textContent = availableDoctor.name;
    if (emergencyDoctorDisplay) emergencyDoctorDisplay.textContent = availableDoctor.name;
    
    const emergencyType = appData.emergency_types.find(t => t.id === selectedEmergencyType);
    if (emergencyTypeBadge && emergencyType) {
      emergencyTypeBadge.textContent = `${emergencyType.icon} ${emergencyType.name}`;
    }
    
    showScreen('emergency-call');
    startEmergencyCallTimer();
    
    showNotification('🚨 Emergency consultation connected!');
  }
}

function startEmergencyCallTimer() {
  if (!emergencyCall) return;
  
  const startTime = emergencyCall.startTime.getTime();
  
  setInterval(() => {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const callTime = document.getElementById('emergency-call-time');
    if (callTime) {
      callTime.textContent = timeString;
    }
  }, 1000);
}

function loadEmergencyDoctors() {
  const emergencyDoctorsContainer = document.getElementById('emergency-doctors');
  if (!emergencyDoctorsContainer) return;
  
  emergencyDoctorsContainer.innerHTML = appData.emergency_doctors.map(doctor => `
    <div class="emergency-doctor-card ${doctor.emergency_duty ? 'on-duty' : ''}">
      <div class="emergency-duty-badge ${doctor.emergency_duty ? 'on-duty' : 'off-duty'}">
        ${doctor.emergency_duty ? '🟢 ON DUTY' : '🔴 OFF DUTY'}
      </div>
      <div class="emergency-doctor-header">
        <div class="emergency-doctor-avatar">${doctor.avatar}</div>
        <div class="emergency-doctor-info">
          <h5>${doctor.name}</h5>
          <div class="emergency-doctor-specialty">${doctor.specialty}</div>
          <div class="emergency-doctor-hospital">🏥 ${doctor.hospital}</div>
        </div>
      </div>
      <div class="response-time-info">
        <div class="avg-response-time">⚡ Avg Response: ${doctor.avg_response_time}</div>
        <div class="doctor-status ${doctor.status}">${doctor.status.toUpperCase()}</div>
      </div>
    </div>
  `).join('');
}

function initializeNetworkQuality() {
  // Simulate network quality detection
  const qualityBars = document.querySelectorAll('.bar');
  const qualityText = document.querySelector('.quality-text');
  
  // Simulate different quality levels
  const qualities = [
    { bars: 2, text: 'Poor - Audio Only', class: 'poor' },
    { bars: 3, text: 'Fair - Limited Video', class: 'fair' },
    { bars: 4, text: 'Good - Video Ready', class: 'good' },
    { bars: 5, text: 'Excellent - HD Ready', class: 'excellent' }
  ];
  
  // Randomly set quality (in real app, this would be actual network detection)
  const currentQuality = qualities[2]; // Default to "Good"
  
  qualityBars.forEach((bar, index) => {
    if (index < currentQuality.bars) {
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
    }
  });
  
  if (qualityText) {
    qualityText.textContent = currentQuality.text;
  }
}

// Emergency Call Controls
function toggleNetworkMode() {
  const networkMode = document.getElementById('network-mode');
  if (networkMode) {
    if (networkMode.textContent === '📹') {
      networkMode.textContent = '📻';
      showNotification('Switched to Audio-Only Mode for better connectivity');
    } else {
      networkMode.textContent = '📹';
      showNotification('Switched to Video Mode');
    }
  }
}

function shareEmergencyLocation() {
  if (confirm('Share your current location with emergency services?')) {
    showNotification('📍 Location shared with emergency services and ambulance dispatch');
    
    // Simulate location sharing
    setTimeout(() => {
      showNotification('✅ Location confirmed: Village Nabha, Punjab 147201');
    }, 2000);
  }
}

function endEmergencyCall() {
  if (confirm('End the emergency consultation?')) {
    emergencyCall = null;
    emergencyConnectionStatus = 'ended';
    selectedEmergencyType = null;
    
    showScreen('consultation');
    showNotification('Emergency consultation ended. Summary saved to your records.');
    
    // Add to notifications
    const emergencyNotification = {
      id: Date.now(),
      type: 'emergency',
      title: 'Emergency Consultation Completed',
      message: 'Emergency consultation completed. Follow-up care recommendations sent.',
      time: 'Just now',
      read: false
    };
    
    notifications.unshift(emergencyNotification);
    updateNotificationCount();
  }
}

// Continue with existing functions (Triage, Ambulance, Notifications, etc.)
function confirmAmbulanceRequest() {
  ambulanceDispatched = true;
  const triageAlert = document.getElementById('triage-alert');
  if (triageAlert) {
    triageAlert.classList.add('hidden');
  }
  
  showNotification('🚑 Ambulance dispatch confirmed');
  
  setTimeout(() => {
    showScreen('ambulance');
    simulateAmbulanceDispatch();
  }, 2000);
}

function declineAmbulanceRequest() {
  const triageAlert = document.getElementById('triage-alert');
  if (triageAlert) {
    triageAlert.classList.add('hidden');
  }
  
  showNotification('Ambulance request declined. Continuing emergency consultation.');
}

function simulateAmbulanceDispatch() {
  showNotification('🚨 Ambulance dispatched from Nabha Civil Hospital');
  
  // Simulate ETA countdown
  setTimeout(() => {
    showNotification('🚑 Ambulance ETA: 10-12 minutes');
  }, 3000);
  
  setTimeout(() => {
    showNotification('📱 Family contacts notified via SMS');
  }, 5000);
}

function updateLocation() {
  showNotification('📍 Updating location...');
  
  setTimeout(() => {
    showNotification('✅ Location updated and shared with ambulance service');
  }, 2000);
}

function callAmbulanceService() {
  if (confirm('Call Nabha Emergency Services (108)?')) {
    showNotification('📞 Calling 108...\n\nNote: In a real app, this would initiate an actual phone call.');
  }
}

function backToEmergencyCall() {
  showScreen('emergency-call');
}

// Initialize notifications system
function initializeNotifications() {
  notifications = [
    {
      id: 1,
      type: 'approval',
      title: 'Alternative Medicine Approved',
      message: 'Dr. Rajesh Kumar approved Dolo 650mg as alternative to Crocin 650mg',
      time: '5 minutes ago',
      read: false,
      data: {
        doctorId: 1,
        originalMedicine: 'Crocin 650mg',
        alternative: 'Dolo 650mg',
        approved: true
      }
    },
    {
      id: 2,
      type: 'order',
      title: 'Order Dispatched',
      message: 'Your medicine order #MG1234 is out for delivery',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Your video consultation with Dr. Priya Sharma is scheduled for 8:30 PM today',
      time: '2 hours ago',
      read: true
    }
  ];
  updateNotificationCount();
}

function updateNotificationCount() {
  const unreadCount = notifications.filter(n => !n.read).length;
  const notificationCounts = document.querySelectorAll('#notification-count');
  
  notificationCounts.forEach(element => {
    element.textContent = unreadCount;
    if (unreadCount > 0) {
      element.classList.add('has-items');
    } else {
      element.classList.remove('has-items');
    }
  });
}

function loadNotifications() {
  const notificationsList = document.getElementById('notifications-list');
  if (!notificationsList) return;
  
  if (notifications.length === 0) {
    notificationsList.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔔</div>
        <h3>No notifications</h3>
        <p>You're all caught up!</p>
      </div>
    `;
    return;
  }
  
  notificationsList.innerHTML = notifications.map(notification => `
    <div class="notification-item ${notification.type === 'approval' ? 'approval-notification' : ''} ${notification.data?.approved === true ? 'approved' : ''} ${notification.data?.approved === false ? 'rejected' : ''} ${!notification.read ? 'unread' : ''}">
      <div class="notification-header">
        <div>
          <div class="notification-title">${notification.title}</div>
          <div class="notification-time">${notification.time}</div>
        </div>
        ${!notification.read ? '<div class="notification-badge" style="width: 8px; height: 8px; background: var(--color-primary); border-radius: 50%;"></div>' : ''}
      </div>
      <div class="notification-message">${notification.message}</div>
      ${notification.type === 'approval' && notification.data ? `
        <div class="notification-actions">
          ${notification.data.approved ? 
            '<button class="btn btn--sm btn--primary" onclick="addApprovedAlternativeToCart(\'' + notification.data.alternative + '\', ' + notification.id + ')">Add to Cart</button>' :
            '<button class="btn btn--sm btn--outline" onclick="findOtherAlternatives(\'' + notification.data.originalMedicine + '\')">Find Other Alternatives</button>'
          }
        </div>
      ` : ''}
    </div>
  `).join('');
  
  // Mark notifications as read when screen is viewed
  setTimeout(() => {
    notifications.forEach(n => n.read = true);
    updateNotificationCount();
  }, 2000);
}

function clearAllNotifications() {
  if (confirm('Clear all notifications?')) {
    notifications = [];
    updateNotificationCount();
    loadNotifications();
    showNotification('All notifications cleared');
  }
}

// Doctor consultation functions
function loadDoctorsList() {
  const doctorsList = document.getElementById('doctors-list');
  if (!doctorsList) return;
  
  doctorsList.innerHTML = appData.doctors.map(doctor => `
    <div class="doctor-card">
      <div class="doctor-status ${doctor.status}">${doctor.status === 'online' ? '● Online' : doctor.status === 'busy' ? '● Busy' : '● Offline'}</div>
      <div class="doctor-header">
        <div class="doctor-avatar">${doctor.avatar}</div>
        <div class="doctor-info">
          <h4>${doctor.name}</h4>
          <div class="doctor-specialty">${doctor.specialty}</div>
          <div class="doctor-hospital">🏥 ${doctor.hospital}</div>
        </div>
      </div>
      <div class="doctor-details">
        <div class="doctor-stats">
          <div class="doctor-rating">⭐ ${doctor.rating}</div>
          <div class="doctor-experience">${doctor.experience} experience</div>
        </div>
      </div>
      <div class="next-slot">Next available: ${doctor.next_slot}</div>
      <div class="doctor-actions">
        ${doctor.status === 'online' ? 
          `<button class="btn btn--primary" onclick="joinMeeting(${doctor.id})">Join Meeting</button>` :
          `<button class="btn btn--outline" onclick="requestAppointment(${doctor.id})">Request Appointment</button>`
        }
        <button class="btn btn--secondary" onclick="chatWithDoctor(${doctor.id})">💬 Chat</button>
      </div>
    </div>
  `).join('');
}

function joinMeeting(doctorId) {
  const doctor = appData.doctors.find(d => d.id === doctorId);
  if (doctor) {
    currentCall = { doctor, startTime: new Date() };
    const doctorNameCall = document.getElementById('doctor-name-call');
    if (doctorNameCall) {
      doctorNameCall.textContent = doctor.name;
    }
    showScreen('video-call');
    startCallTimer();
  }
}

function requestAppointment(doctorId) {
  const doctor = appData.doctors.find(d => d.id === doctorId);
  if (doctor) {
    showNotification(`Appointment request sent to ${doctor.name}. You will receive a confirmation shortly.`);
  }
}

// Simplified placeholder functions for other features
function loadHealthRecords() {
  showNotification('Loading health records...');
}

function loadPharmacyStores() {
  showNotification('Loading pharmacy stores...');
}

function loadCommonMedicines() {
  showNotification('Loading common medicines...');
}

function initializePrescriptionCreator() {
  showNotification('Initializing prescription creator...');
}

function updateCartDisplay() {
  showNotification('Updating cart display...');
}

function searchMedicines() {
  showNotification('Searching medicines...');
}

// Utility functions
function showNotification(message) {
  console.log('Notification:', message);
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-success);
    color: white;
    padding: var(--space-12) var(--space-16);
    border-radius: var(--radius-base);
    font-size: var(--font-size-sm);
    z-index: 1001;
    max-width: 90%;
    text-align: center;
    box-shadow: var(--shadow-lg);
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
  }, 10);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('MediGram Enhanced Emergency App with Full Chat System Initializing...');
  
  initializeApp();
  
  // Setup event listeners immediately and also with delays
  setupEventListeners();
  setTimeout(setupEventListeners, 100);
  setTimeout(setupEventListeners, 500);
  
  console.log('MediGram Enhanced Emergency App with Full Chat System Initialized Successfully! 🚀');
});

function initializeApp() {
  showScreen('login');
  updateConnectivityStatus();
  updateCartCount();
  updateNotificationCount();
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Use more direct approach - replace form submission handlers
  const phoneForm = document.getElementById('phone-login-form');
  if (phoneForm) {
    // Replace the entire form's onsubmit
    phoneForm.onsubmit = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Phone form submitted');
      return handlePhoneSubmit();
    };
    console.log('Phone form handler set');
  }
  
  const otpForm = document.getElementById('otp-verification-form');
  if (otpForm) {
    otpForm.onsubmit = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('OTP form submitted');
      return handleOTPSubmit();
    };
    console.log('OTP form handler set');
  }
  
  const emailForm = document.getElementById('email-login-form');
  if (emailForm) {
    emailForm.onsubmit = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Email form submitted');
      return handleEmailSubmit();
    };
    console.log('Email form handler set');
  }
  
  // Chat input enter key
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.onkeypress = function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    };
  }
  
  // Call chat input enter key
  const callChatInput = document.getElementById('call-chat-input');
  if (callChatInput) {
    callChatInput.onkeypress = function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendCallMessage();
      }
    };
  }
  
  // OTP input handling
  for (let i = 1; i <= 6; i++) {
    const otpInput = document.getElementById(`otp-${i}`);
    if (otpInput) {
      otpInput.oninput = function(e) {
        // Auto-focus next input
        if (e.target.value.length === 1 && i < 6) {
          const nextInput = document.getElementById(`otp-${i + 1}`);
          if (nextInput) nextInput.focus();
        }
        
        // Add filled class
        if (e.target.value) {
          e.target.classList.add('filled');
        } else {
          e.target.classList.remove('filled');
        }
        
        // Auto-submit when all filled
        let allFilled = true;
        for (let j = 1; j <= 6; j++) {
          const input = document.getElementById(`otp-${j}`);
          if (!input || !input.value) {
            allFilled = false;
            break;
          }
        }
        
        if (allFilled) {
          setTimeout(() => handleOTPSubmit(), 500);
        }
      };
      
      // Handle backspace
      otpInput.onkeydown = function(e) {
        if (e.key === 'Backspace' && !e.target.value && i > 1) {
          const prevInput = document.getElementById(`otp-${i - 1}`);
          if (prevInput) {
            prevInput.focus();
            prevInput.select();
          }
        }
      };
    }
  }
  
  // Navigation items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.onclick = function() {
      const screenName = this.dataset.screen;
      if (screenName) {
        showScreen(screenName);
      }
    };
  });
  
  console.log('Event listeners setup complete');
}

function updateConnectivityStatus() {
  const connectivityStatus = document.getElementById('connectivity-status');
  if (connectivityStatus) {
    if (isOnline) {
      connectivityStatus.className = 'status status--success';
      connectivityStatus.textContent = 'Online';
    } else {
      connectivityStatus.className = 'status status--warning';
      connectivityStatus.textContent = 'Offline';
    }
  }
}

function updateCartCount() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCounts = document.querySelectorAll('#cart-count, #cart-count-header');
  
  cartCounts.forEach(element => {
    element.textContent = totalItems;
    if (totalItems > 0) {
      element.classList.add('has-items');
    } else {
      element.classList.remove('has-items');
    }
  });
}

// Video call functions
function startCallTimer() {
  if (!currentCall) return;
  
  const startTime = currentCall.startTime.getTime();
  
  setInterval(() => {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const callStatus = document.querySelector('.call-status');
    if (callStatus) {
      callStatus.textContent = `Connected • ${timeString}`;
    }
  }, 1000);
}

function toggleMute() {
  const muteIcon = document.getElementById('mute-icon');
  if (muteIcon) {
    if (muteIcon.textContent === '🎤') {
      muteIcon.textContent = '🔇';
      showNotification('Microphone muted');
    } else {
      muteIcon.textContent = '🎤';
      showNotification('Microphone unmuted');
    }
  }
}

function toggleVideo() {
  const videoIcon = document.getElementById('video-icon');
  if (videoIcon) {
    if (videoIcon.textContent === '📹') {
      videoIcon.textContent = '📷';
      showNotification('Video turned off');
    } else {
      videoIcon.textContent = '📹';
      showNotification('Video turned on');
    }
  }
}

function sharePhoto() {
  showModal('photo-upload-modal');
}

function endCall() {
  if (confirm('End the consultation call?')) {
    currentCall = null;
    showScreen('consultation');
    showNotification('Call ended. Consultation summary will be saved to your records.');
  }
}

// Photo and modal functions
function uploadPhoto(source) {
  showModal('photo-upload-modal');
}

function uploadPrescription(source) {
  showModal('photo-upload-modal');
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

function confirmPhotoUpload() {
  const photoId = Date.now();
  uploadedPhotos.push({
    id: photoId,
    type: 'symptom',
    timestamp: new Date()
  });
  
  closeModal('photo-upload-modal');
  showNotification('Photo uploaded successfully! 📷');
}

function removePhoto(photoId) {
  uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
  loadScreenContent(currentScreen);
}

// Make functions globally available for onclick handlers
window.showScreen = showScreen;
window.handlePhoneSubmit = handlePhoneSubmit;
window.handleOTPSubmit = handleOTPSubmit;
window.handleEmailSubmit = handleEmailSubmit;
window.resendOTP = resendOTP;
window.showEmailLogin = showEmailLogin;
window.showPhoneLogin = showPhoneLogin;
window.loginWithFacebook = loginWithFacebook;
window.selectEmergencyType = selectEmergencyType;
window.joinEmergencyCall = joinEmergencyCall;
window.toggleNetworkMode = toggleNetworkMode;
window.shareEmergencyLocation = shareEmergencyLocation;
window.endEmergencyCall = endEmergencyCall;
window.confirmAmbulanceRequest = confirmAmbulanceRequest;
window.declineAmbulanceRequest = declineAmbulanceRequest;
window.updateLocation = updateLocation;
window.callAmbulanceService = callAmbulanceService;
window.backToEmergencyCall = backToEmergencyCall;
window.joinMeeting = joinMeeting;
window.requestAppointment = requestAppointment;
window.chatWithDoctor = chatWithDoctor;
window.searchMedicines = searchMedicines;
window.clearAllNotifications = clearAllNotifications;
window.toggleMute = toggleMute;
window.toggleVideo = toggleVideo;
window.sharePhoto = sharePhoto;
window.endCall = endCall;
window.uploadPhoto = uploadPhoto;
window.uploadPrescription = uploadPrescription;
window.closeModal = closeModal;
window.confirmPhotoUpload = confirmPhotoUpload;
window.removePhoto = removePhoto;

// Chat system functions
window.openChat = openChat;
window.sendMessage = sendMessage;
window.goBackFromChat = goBackFromChat;
window.startVideoCall = startVideoCall;
window.openChatDuringCall = openChatDuringCall;
window.toggleCallChat = toggleCallChat;
window.sendCallMessage = sendCallMessage;
window.attachFile = attachFile;
window.toggleEmojiPicker = toggleEmojiPicker;

// Simulate connectivity changes
setInterval(() => {
  if (Math.random() < 0.02) {
    isOnline = !isOnline;
    updateConnectivityStatus();
    
    if (!isOnline) {
      showNotification('⚠️ Connection lost - Working offline');
    } else {
      showNotification('✅ Back online - Syncing data...');
    }
  }
}, 5000);
