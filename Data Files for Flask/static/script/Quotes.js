window.onload = function() {
    fetch('/quotes/random')                 // finds the method in '' from the client side server and then performs it's function
        .then(res => res.json())            // turns JSONisfied output into text
        .then(data => {                              
            document.getElementById("Quote-Of-The-Day").innerText = data.quote;        // wraps the text into the markup element
        })
        .catch(err => console.error("Error fetching quote:", err));                // error handeling
};