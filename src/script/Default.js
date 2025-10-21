document.documentElement.style.overflowX = 'hidden';

// Idea: make a button and hook up an eventlistener to onclick make the overflow visible

document.getElementById("Home-btn").onclick = function() {
    location.href = "index.html";
};
document.getElementById("Projects-btn").onclick = function() {
    location.href = "projects.html";
};
document.getElementById("Contact-btn").onclick = function() {
    location.href = "contact.html";
};
document.getElementById("Cooking-btn").onclick = function() {
    location.href = "recipes.html";
};