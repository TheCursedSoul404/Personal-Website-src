window.onload = function() {
    fetch("/api/quotes")
    .then(response => {
        if (!response.ok) {
        return response.text().then(text => {
            throw new Error(`HTTP ${response.status}: ${text}`);
        });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("quote").innerText = data.quote;
    })
    .catch(err => console.log("Error fetching quote:", err));
};