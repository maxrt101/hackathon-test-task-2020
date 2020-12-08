/* page-log.js by maxrt101 */

// Usage: include styles/log-div.css stylesheet, this script, and put <div id="log-div"></div> in html

function pageLog(msg) {
    document.getElementById("log-div").getElementsByTagName("p")[0].innerHTML += msg + "<br>";
}