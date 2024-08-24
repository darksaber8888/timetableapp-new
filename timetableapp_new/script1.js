// Function to initialize speech recognition
function initializeSpeechRecognition() {
    // Check if SpeechRecognition is available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        // Initialize SpeechRecognition object
        var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        // Set recognition language to English
        recognition.lang = 'en-US';

        // Set continuous mode to false to stop recognition after the first result
        recognition.continuous = false;

        // Define event handler for when speech is recognized
        recognition.onresult = function(event) {
            var transcript = event.results[event.results.length - 1][0].transcript.trim();
            processUserInput(transcript);
        };

        // Define event handler for errors
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            alert('Speech recognition encountered an error. Please try again.');
        };

        return recognition;
    } else {
        // SpeechRecognition not available, inform the user
        alert('Speech recognition is not supported in your browser.');
        return null;
    }
}

// Function to start speech recognition
function startSpeechRecognition() {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser.');
        return;
    }

    // Start speech recognition
    recognition.start();

    // Update interface to indicate speech recognition is active
    document.getElementById("response").textContent = "Jarvis: Listening...";
}

// Initialize SpeechRecognition object
var recognition = initializeSpeechRecognition();

// Function to send user input to backend and update animation
function processUserInput(userInput) {
    // Set AI response in the interface
    setAIResponse(ai_model(userInput));
}

// Function to handle user submission
function submitQuery() {
    // Get user input
    var userInput = document.getElementById("userInput").value;

    // Process user input
    processUserInput(userInput);

    // Stop speech recognition
    recognition.stop();

    // Clear input field
    document.getElementById("userInput").value = "";
}

// Function to set AI response in the interface
function setAIResponse(message) {
    var responseElement = document.getElementById("response");
    responseElement.textContent = "Jarvis: " + message;

    // Speak the response
    speak(message);

    // Trigger animation of the ball for each word
    animateBallForWords(message);
}

// Function to speak the message
function speak(message) {
    var utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
}

// Mock AI model function (replace this with your actual AI model)
function ai_model(user_input) {
    // Normalize user input for easier comparison
    user_input = user_input.toLowerCase();

    // Check if user input contains greetings
    if (["hello", "hi", "hey"].some(greeting => user_input.includes(greeting))) {
        return "Hello! How can I assist you today?";
    }
    
    // Check if user input contains a request for a joke
    if (user_input.includes("joke")) {
        // Add your collection of jokes here
        var jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "What do you get when you cross a snowman and a vampire? Frostbite!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            // Add more jokes as needed
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }
    
    // Check if user input contains keywords related to Google search
    if (["search", "find", "look up"].some(keyword => user_input.includes(keyword))) {
        // Extract the search query
        var searchQuery = user_input.replace(/(search|find|look up)/g, "").trim();
        
        // Construct the URL for the Google search results page
        var searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(searchQuery);
        
        // Open the URL in a new tab
        window.open(searchUrl, "_blank");

        // Return a message indicating that the search has been initiated
        return "Searching for '" + searchQuery + "'...";

    }

    // Check for additional interactions
    if (user_input.includes("how are you")) {
        return "I'm just a program, but thanks for asking!";
    }

    if (user_input.includes("what is your name")) {
        return "I am Jarvis, an artificial intelligence designed to assist you.";
    }
    
    // Fallback response for other types of user input
    return "You said: '" + user_input + "'. Can I help you with anything else?";
}
