/* page-log.js by maxrt101 */

// Usage: include styles/log-div.css stylesheet, this script, and put <div id="log-div"></div> whereever you want

function page_log(msg) {
    document.getElementById("log-div").innerHTML += msg + "<br>";
}