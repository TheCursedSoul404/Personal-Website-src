window.onload = function() {
    fetch('https://thecursedsoul404.pythonanywhere.com/quotes/random')
        .then(res => res.json())
        .then(data => {
            document.getElementById("Quote-Of-The-Day").innerText = `"${data.quote}"`;
            document.getElementById("Author").innerText = `- ${data.author}`;
        })
        .catch(err => console.error("Error fetching quote:", err));
};