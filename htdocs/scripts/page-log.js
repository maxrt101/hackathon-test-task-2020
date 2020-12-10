/* page-log.js by maxrt101 */

// Usage: include styles/log-div.css stylesheet, this script, and put <div id="log-div"></div> in html

function setDebugDivDisplay() {
    if (config.session.showDebugConsole) {
        document.getElementById("log-div").style.display = "block";
        document.getElementById("dbg-title").style.display = "block";
    } else {
        document.getElementById("log-div").style.display = "none";
        document.getElementById("dbg-title").style.display = "none";
    }
}
function toggleShowDebugConsole() {
    config.session.showDebugConsole = !config.session.showDebugConsole;
    config.save();
    setDebugDivDisplay();
}

function pageLog(msg) {
    document.getElementById("log-div").getElementsByTagName("p")[0].innerHTML += msg + "<br>";
}