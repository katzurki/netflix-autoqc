var IMARUVERSION = "July 8, 2021"

if (window.location.hostname == "localization-lucid.netflix.com") {
    imarunettuKNP2CSV()
    //When KNP doesn't export from Originator page, the user is redirected here. The KNP2CSV function must handle both locations without interfering with the main code
} else if (window.location.hostname == "originator.backlot.netflix.com") {
    var menu = document.querySelector("div.popup")
    var itemButtons = document.getElementsByClassName("item-button")
    var dropdown = itemButtons[itemButtons.length -
        1] //this should always yield the More Actions dropdown trigger
    //the property is the function name; the value is the button text
    //Object.entries()[Object.keys().length-1] is the last button/
    var imarunettuButtons = {
        "imarunettuBilingualExportHTML": "Export Bilingual File",
        "imarunettuExportMP4": "Export Video as MP4",
        "imarunettuDoubleExportSRT": "Export Subtitles as SRT",
        "imarunettuKNP2CSV": "Export KNP as CSV",
        "imarunettuExportSettings" : "Save Current Shortcuts",
        "imarunettuImportBetterSrt": "Import SRT as Subtitles",
        "imarunettuRemoveClutter": "Hide or Move Elements",
        "imarunettuRunAutoQC": "Run AutoQC"
    }
    var clq = decodeURIComponent(document.location.href)
        .split(":")[3]
    //imarunettu may only work in Originator, so clq is always there
    if (!localStorage["lang:" + clq]) {
        var LANG = imarunettuGetLang()
    }
    //there are 3 ways to get language: from meta (best), from title, from previously saved to window.imarunettuLang
    //incidentally, since a window.attr does not survive reload, its presence this early indicates the bookmarklet
    //has been run once already. So let's not risk it. 
    var imarunettuClickDropdown = ''
    //placing it here in scope to pass a reference to the eventListener when removing it
    imarunettuPopulateDropdown()

    function imarunettuPopulateDropdown() {
        var itemButtons = document.getElementsByClassName("item-button")
        var dropdown = itemButtons[itemButtons.length -
            1] //this should always yield the More Actions dropdown trigger
        imarunettuClickDropdown = function(event) {
            setTimeout(imarunettuAddButtonsToMenu,
                30) //it takes about 5ms for div.popup to initialize
        }
        dropdown.addEventListener('click', imarunettuClickDropdown, {
            passive: false,
            capture: true
        })
    }

    function deferAddButtonUntil(condition,
        argument) { //fortunately I hope never to need this anymore ever again
        if (eval(condition)) {
            console.log("Condition: " + condition + " evalued TRUE after " + firedon +
                "ms");
            firedon = 0;
            imarunettuAddButtonToMenu(argument)
        } else {
            firedon++;
            setTimeout(function() {
                deferAddButtonUntil(condition, argument)
            }, 1);
        }
    }

    function imarunettuExportMP4() {
        (function() {
            function download(videolink) {
                var element = document.createElement('a');
                element.setAttribute('href', videolink);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }
            videolink = document.getElementsByClassName("video-holder")[0]
                .children[0].getAttribute("src")
            download(videolink)
        })()
    }

    function imarunettuExportSettings(){
        (function(){
        var currentSettings = localStorage.getItem("originator.shortcuts.bindings");
        if(typeof currentSettings !== "undefined"){
            var userName = document.getElementsByClassName("username")[0].textContent.replace(/@.+/gi,":")
            var url = 'https://katzurki.github.io/nettufurikusu/Shortcuts-As-Bookmarklet.html#' + userName + btoa(currentSettings);
            window.open(url) } else {alert("CurrentSettings problem." + typeof currentSettings)}
    })()
}

    function imarunettuRemoveClutter() {
        var wm = document.getElementsByClassName("Watermark");
        try {
            wm[0].remove();
        } catch (e) {}
        var wm = document.getElementsByClassName("proxy-upgrade-notification");
        try {
            wm[0].remove();
        } catch (e) {}
        //the Dragon bookmarklet gratefully stolen from I forgot where
        (function() {
            var b = X = Y = T = L = 0;
            document.addEventListener("click", function(a) {
                a.preventDefault()
            }, !0);
            document.addEventListener("mousedown", c);
            document.addEventListener("touchstart", c);

            function c(a) {
                a.preventDefault();
                a.target !== document.documentElement && a.target !== document.body && (b = Date.now(), a
                    .target.setAttribute("data-drag", b), a.target.style.position = "relative", T = a
                    .target.style.top.split("px")[0] || 0, L = a.target.style.left.split("px")[0] || 0
                );
                X = a.clientX || a.touches[0].clientX;
                Y = a.clientY || a.touches[0].clientY
            }
            document.addEventListener("mousemove", d);
            document.addEventListener("touchmove", d);

            function d(a) {
                if ("" !== b) {
                    var e = document.querySelector('[data-drag="' + b + '"]');
                    e.style.top = parseInt(T) + parseInt((a.clientY || a.touches[0].clientY) - Y) + "px";
                    e.style.left = parseInt(L) + parseInt((a.clientX || a.touches[0].clientX) - X) + "px"
                }
            }
            document.addEventListener("mouseup", f);
            document.addEventListener("touchend", f);

            function f() {
                b = ""
            }
            document.addEventListener("mouseover", g);

            function g(a) {
                a.target.style.cursor = "default";
                a.target.style.boxShadow = "inset lime 0 0 1px,lime 0 0 1px"
            }
            document.addEventListener("mouseout", h);

            function h(a) {
                a.target.style.cursor = a.target.style.boxShadow = ""
            };
        })()
    }

    function imarunettuRunAutoQC(language = window.imarunettuLang) {
        //here the scopes get REALLY interesting
        (function() {
            language ? (LANG = language) : (LANG = imarunettuGetLang());
            var outOfTheBox
            var qcMeta = {}
            qcMeta.lang = LANG
            if (decodeURIComponent(document.location.href)
                .includes("originator.backlot.netflix.com")) {
                var our_clq = decodeURIComponent(document.location.href)
                    .split(":")[3]
                if (our_clq) {
                    qcMeta.clq = our_clq
                }
                outOfTheBox = false
                console.log("DEBUG: state: inTheBox\nour_clq: from location " +
                    our_clq)
            } else if (typeof Window.autoQC_safe_meta !== "undefined") {
                var qcSavedMeta = JSON.parse(Window.autoQC_safe_meta)
                var our_clq = qcSavedMeta.clq
                console.log(
                    "DEBUG: state: outOfTheBox\nour_clq: from qcSavedMeta " +
                    our_clq)
            } else if (document.body.innerText.split("\n")[1].includes(" --> ")) {
                var our_clq = document.body.innerText.split("\n")
                console.log("DEBUG: state: in SRT file\nour_clq: split object " + (
                    typeof our_clq))
            }

            function setShotChanges() {
                if (typeof our_clq !== "object" && document.location.href.includes(
                        "originator.backlot.netflix.com")) {
                    var getJSON = function(url, callback) {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', url, true);
                        xhr.responseType = 'json';
                        xhr.onload = function() {
                            var status = xhr.status;
                            if (status === 200) {
                                callback(null, xhr.response);
                            } else {
                                callback(status, xhr.response);
                            }
                        };
                        xhr.send();
                    }
                    if (!localStorage.getItem("shotChanges:" + our_clq)) {
                        if (!outOfTheBox) {
                            getJSON(
                                "https://originator.backlot.netflix.com/api/request/shotchanges/clq:origination:" +
                                our_clq,
                                function(err, data) {
                                    if (err !== null) {
                                        alert('Something went wrong with error status: ' +
                                            err +
                                            '\nIf it\'s 500-something, please reload the page and try again.'
                                        );
                                    } else {
                                        localStorage.setItem("shotChanges:" + our_clq,
                                            data["frameNumbers"])
                                        qcMeta.SC = data["frameNumbers"]
                                        console.log("DEBUG: Shot changes for " +
                                            our_clq + " saved in localStorage")
                                    }
                                })
                        } else {
                            localStorage.setItem("shotChanges:" + qcSavedMeta.clq,
                                qcSavedMeta.SC)
                        }
                    } else {
                        console.log("DEBUG: Shot changes for " + our_clq +
                            " already present in localStorage")
                        qcMeta.SC = localStorage.getItem("shotChanges:" + our_clq)
                    }
                }
            }

            function defer(method) {
                if (localStorage.getItem("shotChanges:" + our_clq) ||
                    typeof our_clq == "object") {
                    setTimeout(function() {
                        runAutoQC(our_clq);
                    }, 2400);
                } else {
                    setTimeout(function() {
                        defer(runAutoQC)
                    }, 350);
                }
            }
            (function(global, factory) {
                typeof exports === 'object' && typeof module !== 'undefined' ?
                    module.exports = factory() : typeof define === 'function' &&
                    define.amd ? define(factory) : (global.runAutoQC = factory());
            }(this, (function() {
                'use strict';

                function uid() {
                    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
                        .replace(
                            /[018]/g, c => (c ^ crypto.getRandomValues(
                                new Uint8Array(1))[0] & 15 >> c / 4)
                            .toString(
                                16))
                }

                function runAutoQC() {

                    String.prototype.regexIndexOf = function(regex, startpos) {
                        var indexOf = this.substring(startpos || 0)
                            .search(regex);
                        return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
                    }

                    var clq_pattern = new RegExp(
                        '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
                        'i');
                    if (typeof our_clq !== "object") {
                        our_clq = arguments.length > 0 && arguments[0] !==
                            undefined && clq_pattern.test(arguments[0]) ?
                            arguments[0] : '';
                    }
                    LANG = LANG.toUpperCase()
                    console.log("DEBUG: Starting AutoQC with LANG: " + LANG)
                    var line_limit = 0
                    var max_cps = 0
                    var normal_cps = 0
                    switch (LANG) {
                        case "AR":
                            line_limit = 42
                            normal_cps = 20
                            max_cps = 26
                            break;
                        case "CN":
                            line_limit = 16
                            normal_cps = 9
                            max_cps = 11.7
                            break;
                        case "RU":
                            line_limit = 39
                            normal_cps = 17
                            max_cps = 22.1
                            break;
                        case "DE":
                        case "MS":
                        case "GR":
                        case "FR":
                        case "PT":
                        case "EN":
                            line_limit = 42
                            normal_cps = 20
                            max_cps = 25
                            break;
                        default:
                            line_limit = 42
                            normal_cps = 17
                            max_cps = 22.1

                    }
                    if (typeof our_clq !== "object") {
                        if (!our_clq || !clq_pattern.test(our_clq)) {
                            alert(
                                "You must be in a started, saved Originator task!");
                            return null
                        }
                        if (!clq_pattern.test(our_clq)) {
                            alert("The CLQ is invalid: " + our_clq + "\n" +
                                "Please report me to the developer.");
                            return null
                        }
                    }
                    var shotChanges = localStorage.getItem("shotChanges:" +
                        our_clq)
                    try {
                        shotChanges = shotChanges.split(",");
                        console.log("DEBUG: Shot changes validated.")
                    } catch (e) {
                        var shotChanges = undefined;
                        console.log(
                            "DEBUG: No shot changes found, which is ok if our_clq is object: " +
                            (typeof our_clq))
                    }
                    var hasSafeBox = document.getElementsByClassName(
                        "marketing-border")[0] ? true : false
                    try {
                        var userIp = document.getElementsByClassName(
                            "Watermark")[0].innerHTML;
                        var userName = document.getElementsByClassName(
                            "username")[0].textContent;
                    } catch (e) {
                        var userIp = "LOCAL ITERATION"
                    }
                    var reportHtml =
                        `<head><meta charset="utf-8">
                          <script>
                          Window.autoQC_safe_meta = METADATATOKEN
                          </script>
              <script>var prevScrollpos = window.pageYOffset;
              window.onscroll = function() {
                var currentScrollPos = window.pageYOffset;
                if (prevScrollpos > currentScrollPos) {
                  document.getElementById("navbar").style.top = "0";
                } else {
                  document.getElementById("navbar").style.top = "-50px";
                }
                prevScrollpos = currentScrollPos;
              }</script>
                              <script>var z=function(q) {
                  var s=document.getElementsByClassName(q);
                  for(x of s) {
                      x.className===q ? (x.className=q+" of0"): (x.setAttribute("class", q))
                  }
              }

              ;
              </script><style>body {
                  background-color: #212121
              }

              #navbar {
                background-color: #333;
                position: fixed; 
                top: 0; 
                width: 100%;
                transition: top 0.5s;

              }

              #navbar a {
                float: left;
                display: block;
                color: white;
                text-align: center;
                padding: 5px;
                text-decoration: none;
              }

              #navbar a:hover {
                background-color: #ddd;
                color: black;
              }

              #background{
                  position:fixed;
                  z-index:-999;
                  background:#212121;
                  display:block
                  height:100vh; 
                  width:100vh;
                  color:grey; 
              }

              .bg-text
              {
                  font-family: Netflix-Sans;
                  pointer-events: none;
                  color:lightgrey;
                  text-align: center;
                  opacity: 0.06;
                  font-size:80px;
                  transform:rotate(320deg);
                  -webkit-transform:rotate(320deg);
                  position: relative;
                  overflow: visible;
                  user-select: none;
                  -webkit-user-select: none;
                  -khtml-user-select: none;
                  -moz-user-select: none;
                  -ms-user-select: none;
              }

              .of0 {
                  visibility: hidden;
                  color: #000!important;
              }

              .username {
                 float:left;
              }

              .ipAddress {
                 float:right; 
              }

              .cSpace {
                  color: #00fa00;
                  visibility: visible;
              }

              .StyledTextEditor {
                  font-family: Netflix-Sans;
                  line-height: 1.3;
                  margin: 2px;
                  white-space: nowrap;
                  overflow: hidden;
                  font-variant-ligatures: none;
                  position: relative;
                  pointer-events: none
              }

              .StyledTextEditor .ltr {
                  unicode-bidi: embed;
                  direction: ltr
              }

              .TimedTextEvent {
                  font-family: Netflix-Sans;
                  font-size: 1.3rem;
                  font-weight: 400;
                  line-height: 2rem;
                  margin-top: .5rem;
                  display: -webkit-box;
                  display: -moz-box;
                  display: -webkit-flex;
                  display: -ms-flexbox;
                  display: box;
                  display: flex;
                  -webkit-box-orient: vertical;
                  -moz-box-orient: vertical;
                  -o-box-orient: vertical;
                  -webkit-flex-direction: column;
                  -ms-flex-direction: column;
                  flex-direction: column;
                  border: 1px solid transparent;
                  -webkit-transition: height 250ms ease, border 150ms ease;
                  -moz-transition: height 250ms ease, border 150ms ease;
                  -o-transition: height 250ms ease, border 150ms ease;
                  -ms-transition: height 250ms ease, border 150ms ease;
                  transition: height 250ms ease, border 150ms ease
              }

              .TimedTextEvent .details {
                  padding-top: .5rem;
                  padding-left: 1rem;
                  padding-right: 1rem;
                  display: -webkit-box;
                  display: -moz-box;
                  display: -webkit-flex;
                  display: -ms-flexbox;
                  display: box;
                  display: flex;
                  -webkit-box-orient: horizontal;
                  -moz-box-orient: horizontal;
                  -o-box-orient: horizontal;
                  -webkit-flex-direction: row;
                  -ms-flex-direction: row;
                  flex-direction: row
              }

              .TimedTextEvent .details .timing {
                  -webkit-flex-shrink: 0;
                  flex-shrink: 0;
                  display: -webkit-box;
                  display: -moz-box;
                  display: -webkit-flex;
                  display: -ms-flexbox;
                  display: box;
                  display: flex;
                  -webkit-box-orient: vertical;
                  -moz-box-orient: vertical;
                  -o-box-orient: vertical;
                  -webkit-flex-direction: column;
                  -ms-flex-direction: column;
                  flex-direction: column;
                  width: 8rem
              }

              #titleinfo {
              color: #fffff0;
              font-weight: bolder;
              font-style: normal;
              font-family: Roboto, Netflix-Sans;
              font-size: 150%;
              margin-left: 30px;
              margin-right: 20px;
              position: relative; top: 7px; left: -5px;
              width: 580px;
              flex-shrink: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              }



              .issue {
                  font-size: 16;
                  vertical-align: middle;
                  font-family: Netflix-Sans;
                  position: relative;
                  top: -1px
              }

              .TimedTextEvent .details .timing .TimeCode {
                  color: rgba(255, 255, 255, .54);
                  padding: 0 .5rem;
                  border-radius: 1rem;
                  white-space: nowrap
              }

              .TimedTextEvent .details .content {
                  -webkit-box-flex: 1;
                  -moz-box-flex: 1;
                  -o-box-flex: 1;
                  -ms-box-flex: 1;
                  box-flex: 1;
                  -webkit-flex-grow: 1;
                  flex-grow: 1;
                  display: -webkit-box;
                  display: -moz-box;
                  display: -webkit-flex;
                  display: -ms-flexbox;
                  display: box;
                  display: flex;
                  -webkit-box-orient: vertical;
                  -moz-box-orient: vertical;
                  -o-box-orient: vertical;
                  -webkit-flex-direction: column;
                  -ms-flex-direction: column;
                  flex-direction: column;
                  padding-left: 2rem;
                  padding-bottom: .5rem;
                  width: 24rem
              }

              .TimedTextEvent .details .content .header {
                  display: -webkit-box;
                  display: -moz-box;
                  display: -webkit-flex;
                  display: -ms-flexbox;
                  display: box;
                  display: flex;
                  -webkit-box-orient: horizontal;
                  -moz-box-orient: horizontal;
                  -o-box-orient: horizontal;
                  -webkit-flex-direction: row;
                  -ms-flex-direction: row;
                  flex-direction: row
              }

              .TimedTextEvent .details .content .header .index {
                  color: rgba(255, 255, 255, .66)
              }

              .TimedTextEvent .details .content .header .duration {
                  color: rgba(255, 255, 255, .54);
                  margin-left: auto;
                  border-radius: 1rem
              }

              .TimedTextEvent .details .content .StyledTextEditor {
                  color: rgba(255, 255, 255, .87);
                  min-height: 3.2rem;
                  margin-top: .3rem
              }

              img {
                  display: table-cell;
                  vertical-align: middle
              }

              #logonetflix {
                  margin-left: 12px;
              }

              .TimedTextEvent .footer {
                  height: .5rem;
                  border-bottom: 2px solid rgba(0, 0, 0, .77);
                  margin-left: 1rem;
                  margin-right: 1rem
              }

              .outline {
                  color: #000;
                  position: relative;
                  left: 350%;
              }

              button {
                  background-color: black;
                  color: #39ff1a;
                  opacity: 0.5;
              }

              i {
                  font-style: italic!important;
                  font-family: serif!important
              }

              #feedback {
                  height: 0;
                  width: 65px;
                  position: fixed;
                  right: 0;
                  top: 50%;
                  z-index: 1000;
                  transform: rotate(-90deg);
                  -webkit-transform: rotate(-90deg);
                  -moz-transform: rotate(-90deg);
                  -o-transform: rotate(-90deg)
              }

              #feedback a {
                  display: block;
                  background: #06c;
                  height: 15px;
                  width: 165px;
                  padding: 8px 16px;
                  color: #fff;
                  font-family: Arial, sans-serif;
                  font-size: 17px;
                  font-weight: 700;
                  text-decoration: none;
                  border-bottom: solid 1px #333;
                  border-left: solid 1px #333;
                  border-right: solid 1px #fff
              }

              #feedback a:hover {
                  background: #ccc
              }

              </style><body style="width:70%;height:100%">
              <div id="navbar">
                <a href="https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617-Timed-Text-Style-Guide-General-Requirements"><img id="logonetflix" width="auto" height="32" src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" title="Netflix TTSG Quality Compliance Initiative"></a>
                <span id="titleinfo" title="TITLEINFOTOKEN">TITLEINFOTOKEN</span>
              </div>
              <div id="background">
              <p class="bg-text" style="top: 0px; left: 100px;">WATERMARKPLACEHOLDER<br>NETFLIX CONFIDENTIAL</p>
              <p class="bg-text" style="top: -100px; left: 540px;">NETFLIX CONFIDENTIAL<br>WATERMARKPLACEHOLDER</p>
                  </div>

                  <div id="stick" style="position:relative;left:750px;"><button type="button" class="f" onclick="alert(Window.autoQC_safe_meta)">🛈</button><button type="button" class="f" onclick="z(\'cSpace\')" title="Highlight whitespace">🟩</button><button title="Display minor issues" type="button" class="f" onclick="z(\'minor_issue\') ">⚠️</button><button title="Display major issues" type="button" class="f" onclick="z(\'major_issue\')">🚫</button><button title="Shot-change suggestions" type="button" onclick="z(\'shot_change_issue\') ">🎞</button>DLFIXSRTTOKEN<span style="position: relative; top: 3px; left: 165px; font-family: monospace; color: #fdfdf2; opacity: 0.33;">Linguist: LINGUISTNAME</div>`
                    if (document.location.href.includes(
                            "originator.backlot.netflix.com")) {
                        var lsJson = localStorage["clq:origination:" +
                            decodeURIComponent(our_clq)]
                        if (!lsJson) {
                            alert("Timed text events not found in localStorage\nfor CLQ: " +
                                our_clq + "\n" +
                                "If the CLQ is correct and" + "\n" +
                                "\"Save to local storage\" is enabled in Settings," +
                                "\n" + "save the task and try again.");
                            return null
                        }
                        var json_obj = JSON.parse(lsJson)
                        var src = json_obj["events"]
                        var fps_ = json_obj["meta"]["fps"];
                        var fps = fps_.split("_")[1] / 100
                        qcMeta.fps = fps
                        qcMeta.fps_ = fps_
                    } else if (outOfTheBox) {
                        var fps = qcSavedMeta.fps
                        var fps_ = qcSavedMeta.fps_
                    } else if (typeof our_clq == "object") {
                        var srt_fps = prompt(
                            "What FPS does this SRT file likely have?\n2397, 2398, 2400, 2500, 2997 are the most likely"
                        )
                        if (srt_fps.length < 4) {
                            var fps = 24.00;
                            var fps_ = "FPS_2400"
                        } else {
                            var fps_ = "FPS_" + (srt_fps.replace(/[^\d]/g, "")
                                .replace(/(^....)(.+$)/, "$1"))
                            var fps = fps_.split("_")[1] / 100
                        }
                        alert("Continuing with " + fps_ +
                            " and real fps set to " + fps)
                    }
                    var majTotal = 0
                    var minTotal = 0
                    var scTotal = 0
                    var evTotal = 0
                    var afTotal = 0
                    var frms = 1000 / fps
                    var fpsHalfSecond = Math.round(fps / 2)

                    if (typeof our_clq !== "object") {
                        var proposed_fps = prompt("Framerate set to: " +
                            fps +
                            " fps. Gap/shot change set to: " + fpsHalfSecond +
                            " frames.\nEnter custom FPS or press Enter to keep current"
                        );
                        if (proposed_fps) {
                            var int_fps = proposed_fps.substring(0, 2);
                            var decimal_fps = proposed_fps.substring(2,
                                proposed_fps.length);
                            fps_ = "FPS" + "_" + int_fps + decimal_fps
                            fps = (int_fps + "." + decimal_fps) * 1;
                            alert("Continuing with " + fps_ +
                                " and real fps set to " + fps);
                        }
                    }
                    fpsHalfSecond = Math.round(fps / 2)
                    console.log("Using " + fpsHalfSecond +
                        " frames as target gap/shot change mark")
                    if (document.location.href.includes(
                            "originator.backlot.netflix.com")) {
                        var titleInfo = document.getElementsByClassName(
                                "cpe-page-menu-label")[0].innerText.replace(
                                / "/g, ' “')
                            .replace(/"/g, "”")
                        qcMeta.titleinfo = titleInfo
                    } else if (typeof our_clq !== "object") {
                        var titleInfo = qcSavedMeta.titleinfo
                    } else {
                        var titleInfo = document.location.href.replace(
                            /(.+?)([^/]+$)/g, "$2")
                    }

                    function srtName(suffix = "", extension = ".srt") {
                        var s = titleInfo
                        var srtName = (s.replace(/[ ]/g, '_')
                                .replace(
                                    /[^a-z0-9_]/gi, '') + "_" + suffix +
                                extension
                            ) //This gets rid of all punctuation, spaces and non-English letters
                            .trim() //resulting in a name like 14545_El_Burrito_A_Breaking_Fat_Movie_FPS_2500.srt
                        if (!srtName) srtName = our_clq + "_" + suffix +
                            extension
                        return srtName
                    }

                    function frames2tcf(framenumber, framerate =
                        fps) { //frames to 00:01:02:24 format
                        var seconds_float = framenumber / framerate
                        var seconds_int = Math.floor(seconds_float)
                        var seconds_frac = seconds_float - seconds_int
                        var frames = Math.round(seconds_frac * framerate) +
                            ''
                        var date = new Date(0);
                        date.setSeconds(seconds_int);
                        try {
                            var timeString = date.toISOString()
                                .substr(11, 8)
                            if (frames.length == 1) frames = "0" + frames
                            var timecodef = timeString + ":" + frames
                        } catch (e) {
                            var timecodef = 'ERROR'
                        }
                        return timecodef
                    }

                    function frames2timecode(frames) { //frames to 00:01:02,000 format
                        var milliseconds = Math.round(frames * frms)
                        var srt_timecode = TimeConversion(milliseconds)
                        return srt_timecode
                    }

                    function array2srt(events_object) {
                        var ordered_events = []
                        for (var id in events_object) {
                            try {
                                var type_fn = events_object[id]["type"]
                                if (type_fn === "fn") {
                                    events_object[id]["txt"] += "<b></b>";
                                }
                            } catch (e) {}
                            ordered_events.push([
                                events_object[id]
                                ["start"],
                                events_object[id]
                                ["end"],
                                events_object[id]
                                ["txt"],
                                events_object[id]
                                ["styles"],
                                events_object[id]
                                ["rgn"]
                            ])
                        }
                        ordered_events.sort(function(a, b) {
                            return a[0] - b[0];
                        }); //Array sorted by in_cues, sequentially
                        var index = 0
                        var srt_txt = ''
                        for (event of ordered_events) {
                            index++
                            var start = frames2timecode(event[0])
                            var end = frames2timecode(event[1])
                            var content = event[2]
                            try {
                                if (typeof event[3]
                                    [0]["type"] !== "undefined") {
                                    if (event[3][0]
                                        ["type"] == "italic") {
                                        content = italicize(content, event[3])
                                    }
                                }
                            } catch (e) {}
                            try {
                                if (typeof event[4] !== "undefined") {
                                    if (event[4] == "top") {
                                        content = "{\\an8}" + content
                                    }
                                }
                            } catch (e) {}
                            try {
                                if (event["type"] == "fn") {
                                    content += '<b></b>'
                                }
                            } catch (e) {}
                            //                      console.log(content)
                            var current_event = index + "\n" + start +
                                " --> " + end + "\n" + content + "\n"
                            srt_txt += current_event + "\n"
                        }
                        return srt_txt
                    }

                    function parsed2srt(parsedSRT) {
                        var nbspRegex = new RegExp(String.fromCharCode(160),
                            "gi");
                        var srt_txt = ''
                        for (let event of parsedSRT) {
                            var cleanTxt = event["text"].replace(nbspRegex,
                                    " ")
                                .trim()
                                .replace(/[ ][ ]/gi, " ")
                            if (cleanTxt.length < 2) {
                                cleanTxt = "\n"
                            }
                            let text_event = event["id"] + "\n" + event[
                                    "start"] + " --> " + event["end"] + "\n" +
                                cleanTxt + "\n\n"
                            srt_txt += text_event
                        }
                        return srt_txt
                    }

                    function italicize(content, italics_array) {
                        var position_offset = 0
                        for (var italic of italics_array) {
                            var position_from = italic["from"] +
                                position_offset;
                            position_offset += 3
                            content = [content.slice(0, position_from), "<i>",
                                content.slice(position_from)
                            ].join('')
                            var position_to = italic["to"] + position_offset;
                            position_offset += 4
                            content = [content.slice(0, position_to), "</i>",
                                content.slice(position_to)
                            ].join('')
                        }
                        return content
                    }

                    function download(filename, text) {
                        var element = document.createElement('a');
                        element.setAttribute('href',
                            'data:text/plain;charset=utf-8,' +
                            encodeURIComponent(text));
                        element.setAttribute('download', filename);
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                    }

                    function TimeConversion(duration) {
                        let time = parseDuration(duration)
                        return formatTimeHMSS(time)
                    }

                    function parseDuration(duration) {
                        let remain = duration
                        let hours = Math.floor(remain / (1000 * 60 * 60))
                        remain = remain % (1000 * 60 * 60)
                        let minutes = Math.floor(remain / (1000 * 60))
                        remain = remain % (1000 * 60)
                        let seconds = Math.floor(remain / (1000))
                        remain = remain % (1000)
                        let milliseconds = remain
                        return {
                            hours,
                            minutes,
                            seconds,
                            milliseconds
                        }
                    }

                    function formatTimeHMSS(o) {
                        let hours = o.hours.toString()
                        if (hours.length === 1) hours = '0' + hours
                        let minutes = o.minutes.toString()
                        if (minutes.length === 1) minutes = '0' + minutes
                        let seconds = o.seconds.toString()
                        if (seconds.length === 1) seconds = '0' + seconds
                        let milliseconds = o.milliseconds.toString()
                        if (milliseconds.length === 1) milliseconds = '00' +
                            milliseconds
                        if (milliseconds.length === 2) milliseconds = '0' +
                            milliseconds
                        return hours + ":" + minutes + ":" +
                            //Example: 00:01:02,999 -- note that the SRT spec calls for a comma, not a period!
                            seconds + "," + milliseconds
                    }

                    function isBetween(distance, a, b) {
                        var left_lim = a;
                        var right_lim = b;
                        if (a > b) {
                            left_lim = b;
                            right_lim = a
                        }
                        if (distance >= left_lim && distance <= right_lim) {
                            return true
                        }
                        return false
                    }

                    function validateScE(distance, framesE, sc, distance2) {
                        var violation = false
                        var V = {}
                        var css_cs1 = '<span class="shot_change_issue">';
                        var css_cs2 = '</span>';
                        var oldTcf = frames2tcf(framesE)
                        var scTcf = frames2tcf(sc)
                        var distanceNext = distance2
                        if (isBetween(distance, 5, fpsHalfSecond - 1)) {
                            var moveTo = fpsHalfSecond - distance
                            var newFramesE = framesE + moveTo
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            violation = '🎞 Move out-cue right ' + moveTo +
                                ' to +' + fpsHalfSecond +
                                ' frames after shot change<br><font style="color: #7DFDFE; font-family: monospace">[OUT-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                        }
                        if (isBetween(distance, -1, 4)) {
                            var moveTo = -2 - distance
                            var newFramesE = framesE + moveTo
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            violation = '🎞 Move out-cue left ' + moveTo +
                                ' to -2 frames before shot change<br><font style="color: #7DFDFE; font-family: monospace">[OUT-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                        }
                        if (isBetween(distance, -3, -7)) {
                            var moveTo = -2 - distance
                            var newFramesE = framesE + moveTo
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            violation = '🎞 Move out-cue right ' + moveTo +
                                ' to -2 before shot change<br><font style="color: #7DFDFE; font-family: monospace">[OUT-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                        }
                        if (distanceNext > 2 && distanceNext < fpsHalfSecond &&
                            distanceNext <= Math.abs(distance)
                        ) //fixes nasty, nasty situation!
                        {
                            var moveTo = distanceNext - 2
                            var newFramesE = framesE + moveTo
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            violation = '🎞 Move out-cue right ' + moveTo +
                                ' to reduce frame gap from ' + distanceNext +
                                ' to 2.<br><font style="color: #7DFDFE; font-family: monospace">[OUT-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                        }
                        if (cpsFixable) {
                            var moveTo = framesToFixCPS
                            var newFramesE = framesE + framesToFixCPS
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            violation = '📖 Move out-cue right ' + moveTo +
                                ' to reduce CPS to ' + normal_cps +
                                '.<br><font style="color: #7DDDFF; font-family: monospace">[OUT-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                            cpsFixable = false
                        }
                        if (cpsAttemptable) {
                            var moveTo = framesToFixCPS
                            var newFramesE = framesE + framesToFixCPS
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            cpsAttemptable = false
                            violation = '📖 Move out-cue right ' + moveTo +
                                ' to reduce CPS to ' + bestWorstCPS +
                                '.<br><font style="color: #7DDDFF; font-family: monospace">[OUT-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                            cpsAttemptable = false
                        }
                        if (Math.abs(distanceNext) < 2) {
                            var moveTo = distanceNext - 2
                            var newFramesE = framesE + moveTo
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            violation = '🎞 Move out-cue ' + moveTo +
                                ' to -2 before next subtitle event<br><font style="color: #7DFDFE; font-family: monospace">[OUT-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                        }
                        if (violation) {
                            scTotal++
                            afTotal++
                            V = {
                                violation: css_cs1 + violation + css_cs2,
                                start: undefined,
                                end: frames2timecode(newFramesE)
                            }
                            return V;
                        }
                        return false
                    }

                    function moveToSigned(moveTo) {
                        var frames = " frames"
                        if (Math.abs(moveTo) == 1) {
                            var frames = " frame"
                        }
                        if (moveTo <= 0) {
                            return moveTo + frames
                        } else {
                            return '+' + moveTo + frames
                        }
                    }

                    function validateScS(distance, framesE, sc) {
                        var violation = false
                        var V = {}
                        var css_cs1 = '<span class="shot_change_issue">';
                        var css_cs2 = '</span>';
                        var oldTcf = frames2tcf(framesE)
                        var scTcf = frames2tcf(sc)
                        if (isBetween(distance, 1, fpsHalfSecond - 2)) {
                            var moveTo = 0 - distance
                            var newFramesE = framesE + moveTo
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            violation = '🎞 Move in-cue left ' + moveTo +
                                ' to snap it to shot change<br><font style="color: #7FFFD4; font-family: monospace">[IN-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                        }
                        if (isBetween(distance, fpsHalfSecond - 1, fpsHalfSecond - 1)) {
                            var moveTo = 1
                            var newFramesE = framesE + moveTo
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            violation = '🎞 Move in-cue right ' + moveTo +
                                ' to put ' + fpsHalfSecond +
                                ' frames after shot change<br><font style="color: #7FFFD4; font-family: monospace">[IN-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                        }
                        if (isBetween(distance, fpsHalfSecond - 2, fpsHalfSecond - 2)) {
                            var moveTo = 2
                            var newFramesE = framesE + moveTo
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            violation = '🎞 Move in-cue right ' + moveTo +
                                ' to +' + fpsHalfSecond +
                                ' frames after shot change<br><font style="color: #7FFFD4; font-family: monospace">[IN-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                        }
                        if (isBetween(distance, (fpsHalfSecond - 1) * -1, -5)) {
                            var moveTo = fpsHalfSecond * -1 - distance
                            var newFramesE = framesE + moveTo
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            violation = '🎞 Move in-cue left ' + moveTo +
                                ' to -' + fpsHalfSecond +
                                ' frames before shot change<br><font style="color: #7FFFD4; font-family: monospace">[IN-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                        }
                        if (isBetween(distance, -4, -1)) {
                            var moveTo = 0 - distance
                            var newFramesE = framesE + moveTo
                            var newTcf = frames2tcf(newFramesE)
                            var intTo = (moveTo > 0) ? "+" + moveTo : moveTo;
                            moveTo = moveToSigned(moveTo)
                            violation = '🎞 Move in-cue right ' + moveTo +
                                ' to snap it to shot change<br><font style="color: #7FFFD4; font-family: monospace">[IN-CUE: ' +
                                oldTcf + ' ' + intTo + ' = ' + newTcf +
                                ']</font>'
                        }
                        if (violation) {
                            scTotal++
                            afTotal++
                            V = {
                                violation: css_cs1 + violation + css_cs2,
                                start: frames2timecode(newFramesE),
                                end: undefined
                            }
                            return V
                        }
                        return false
                    }

                    function getNextShotchange(frame) {
                        if (!shotChanges) {
                            return false
                        } else {
                            var smallestDist = Number.POSITIVE_INFINITY
                            var bestCandidate = 0
                            for (let shotChange of shotChanges) {
                                var distance = shotChange - frame
                                if (distance < smallestDist && shotChange >=
                                    frame) {
                                    smallestDist = distance
                                    bestCandidate = shotChange * 1
                                }
                            }
                            return bestCandidate
                        }
                    }
                    //returns distance in frames from a given frame to the nearest shot change
                    function getNearestShotchange(frame) {
                        if (!shotChanges) {
                            return false
                        } else {
                            var smallestDist = Number.POSITIVE_INFINITY
                            var bestCandidate = 0
                            for (let shotChange of shotChanges) {
                                var distance = Math.abs(frame - shotChange)
                                if (distance < smallestDist) {
                                    smallestDist = distance
                                    bestCandidate = shotChange * 1
                                }
                            }
                            return bestCandidate
                        }
                    }

                    function leftFillNum(num, targetLength) {
                        return num.toString()
                            .padStart(targetLength, 0);
                    }
                    if (src && !outOfTheBox) {
                        console.log(
                            "DEBUG: In Originator, working with json_src")
                        var SRT = array2srt(src)
                        SRT = parseSRT(SRT)
                    } else if (typeof our_clq !== "object" && outOfTheBox) {
                        console.log(
                            "DEBUG: In AutoQC, working with encoded fixed")
                        var SRT = decodeURIComponent(document.getElementById(
                                    "FixedTaskSRT")
                                .href)
                            .replace(
                                "data:text/plain;charset=utf-8,", "")
                        SRT = parseSRT(SRT)
                    } else if (typeof our_clq == "object") {
                        console.log(
                            "DEBUG: In SRT file, working with document body"
                        )
                        var SRT = our_clq.join("\n")
                            .trim()
                        SRT = parseSRT(SRT)
                    }
                    var fSRT = SRT
                    var issues = []
                    var events_detected = 0
                    for (var i = 0; i < SRT.length; i++) {
                        var end_current = SRT[i]["end"]
                        if (typeof(SRT[i + 1]) !== "undefined") {
                            var start_next = SRT[i + 1]["start"]
                        } else {
                            var start_next = 23976023976
                        }
                        var distance = Math.round(
                            (start_next - end_current) * fps)
                        SRT[i]["frames_to_next"] = distance
                    }
                    for (event of SRT) {
                        var start_time = event["start"]
                        var end_time = event["end"]
                        var delta = Math.round((end_time - start_time) *
                            1000) / 1000
                        var delta_fps = Math.floor(delta) + ":" + Math.round(
                            (delta - Math.floor(delta)) * fps)
                        var start_frames = Math.round(start_time * fps)
                        var end_frames = Math.round(end_time * fps)
                        var start_tcf = frames2tcf(start_frames)
                        var end_tcf = frames2tcf(end_frames)
                        var id = event["id"]
                        var srtId = id - 1;
                        var distanceNextEvent = event["frames_to_next"]
                        var _id = leftFillNum(id, 4)
                        var eventIssue = []
                        var eventTxt = event["text"]
                        var bareTxt = eventTxt.replace(/\n/g, "‣")
                            .replace(
                                /<(|\/)(i|b)>/g, "") //strips all italics and FN tags
                            .replace(/\{.an.\}/g, "") //and positions
                            .replace(/[\u064b-\u0652]/gi, "") //length fix for Arabic and eventually other diacritics
                        var totalLength = bareTxt.length - 1
                        var cps = (Math.round((totalLength / delta) *
                            1000)) / 1000
                        var duration_for_normal_cps = (Math.round((
                            totalLength / normal_cps) * 1000)) / 1000
                        var framesToFixCPS = Math.floor(((((
                                duration_for_normal_cps - delta) *
                            1000) * fps) / 1000) + 1)
                        var round_int_cps = Math.floor(cps + 1);
                        var html_cps = ''
                        var eventFixedTxt = event["text"]
                        var eventOriginalTxt = event["text"]
                        var eventIsFn = (event["text"].indexOf("<b></b>") !== -1)
                        var eventIsFnInCaps = eventIsFn && (LANG !== 'CN') &&
                            (bareTxt.toUpperCase()
                                .trim() === bareTxt
                                .trim())
                        var scS = getNearestShotchange(start_frames)
                        var scE = getNearestShotchange(end_frames)
                        var scN = getNextShotchange(end_frames)
                        var scND = scN - end_frames
                        var scSD = start_frames - scS
                        var scED = end_frames - scE
                        var cpsFixable = false
                        var cpsAttemptable = false
                        var bestWorstCPS = false
                        if (cps > normal_cps && cps < max_cps && scND -
                            framesToFixCPS > (fpsHalfSecond - 1) && distanceNextEvent -
                            framesToFixCPS > (fpsHalfSecond - 1) && framesToFixCPS <
                            fpsHalfSecond && !
                            eventIsFnInCaps) {
                            cpsFixable = true
                            //var log = "EVENT: "+id+"\nCPS: "+cps+"\tDuration: "+delta_fps+"\nTAR: //"+normal_cps+".00\tWant_dur: "+duration_for_normal_cps+
                            //"\nEnd_frame: "+end_frames+"\nNex_ev in: "+distanceNextEvent+"\nNex_sc in: "
                            //+scND+"\nADD_FRAM: "+framesToFixCPS+"\nTotal length: "
                            //+totalLength+"\nEND_TIMECODE_1: "+frames2tcf(end_frames+framesToFixCPS)+"\nEND_TIMECODE_2: "+
                            //frames2tcf(Math.round((start_time + duration_for_normal_cps)*fps))
                        }
                        if (cps >= max_cps && scND - fpsHalfSecond > fpsHalfSecond - 1 &&
                            distanceNextEvent - fpsHalfSecond > fpsHalfSecond - 1 && !
                            eventIsFnInCaps) {
                            cpsAttemptable = true
                            framesToFixCPS = fpsHalfSecond
                            var plusDelta = fpsHalfSecond / fps
                            bestWorstCPS = Math.round((totalLength / (delta +
                                plusDelta) * 1000)) / 1000
                        }
                        var scStcf = frames2tcf(scS)
                        var scEtcf = frames2tcf(scE)
                        var violS = validateScS(scSD, start_frames, scS)
                        var violE = validateScE(scED, end_frames, scE,
                            distanceNextEvent, cps)
                        if (violS) {
                            eventIssue.push(violS["violation"])
                            fSRT[srtId]["start"] = violS["start"];
                        } else {
                            fSRT[srtId]["start"] = frames2timecode(Math.round(
                                fSRT[srtId]
                                ["start"] * fps))
                        }
                        if (violE) {
                            eventIssue.push(violE["violation"])
                            fSRT[srtId]["end"] = violE["end"];
                        } else {
                            fSRT[srtId]["end"] = frames2timecode(Math.round(
                                fSRT[srtId]
                                ["end"] * fps))
                        }
                        if (eventIsFn) {
                            _id +=
                                '<span class="outline" style="color: purple; position: relative; top: 0px; left: 137px;">🅵🅽</span>'
                        }
                        eventTxt = eventTxt.replace(/(<([^>]+)>)/ig, "");
                        eventTxt = eventTxt.replace(/{.an.}/ig, "");
                        if (eventTxt.indexOf("\n") !== -1 && eventTxt.indexOf(
                                "\n-") == -1 && eventTxt.replace("\n", " ")
                            .replace(/[\u064b-\u0652]/gi, "")
                            .length <= line_limit && !eventIsFn && !
                            hasSafeBox) {
                            eventIssue.push(
                                "<span class=\"major_issue\">🚫 Can fit on one line (" +
                                line_limit + " for " + LANG + ")")
                            majTotal++
                            eventFixedTxt = eventFixedTxt.replace(/\n/g, " ")
                            eventFixedTxt = eventFixedTxt.replace(/ /gi, " ")
                                .replace(/[ ][ ]/g, ' ');
                            afTotal++
                        }
                        if (eventTxt.indexOf("...") !== -1) {
                            eventIssue.push(
                                "<span class=\"minor_issue\">⚠️ Legacy ellipsis detected, replace with U+2026: …"
                            );
                            minTotal++
                            eventFixedTxt = eventFixedTxt.replace(/\.\.\./g,
                                "…")
                            afTotal++
                        }

                        if (eventTxt.indexOf(" ,") !== -1) {
                            eventIssue.push(
                                "<span class=\"minor_issue\">⚠️ Extraneous space before comma"
                            );
                            minTotal++
                            eventFixedTxt = eventFixedTxt.replace(/ ,/g,
                                ",")
                            afTotal++
                        }
                        if ((eventTxt.indexOf('",') !== -1 || eventTxt.indexOf('".') !== -
                                1) && LANG == "EN" && eventTxt.indexOf('"...') == -1) {
                            eventIssue.push(
                                "<span class=\"minor_issue\">⚠️ Commas and periods stay within “quotes,” “like so.”"
                            )
                            minTotal++
                            eventFixedTxt = eventFixedTxt.replace(/"([.,])/g, '$1"')
                            afTotal++
                        }

                        if ((eventTxt.regexIndexOf(/([^\w]|^)OK[^\w]/, 0) !== -1 && LANG ==
                                "EN")) {
                            eventIssue.push(
                                "<span class=\"minor_issue\">⚠️ Netflix requires OK to be spelled fully: “Okay.”"
                            )
                            minTotal++
                            eventFixedTxt = eventFixedTxt.replace(
                                    /([\w,"“”’…;:][^\w])OK([^\w])/g, "$1okay$2")
                                .replace(/([^\w]|^)OK([^\w])/g, "$1Okay$2");
                            afTotal++
                        }

                        if (eventTxt.indexOf("'") !== -1 || eventTxt.indexOf(
                                '"') !== -1) {
                            switch (LANG) {
                                //case "EN":
                                case "NEVER":
                                    eventIssue.push(
                                        "<span class=\"minor_issue\">⚠️ Smart quotes recommended for EN: <b>“   ”   ’</b>"
                                    );
                                    minTotal++
                                    eventFixedTxt = eventFixedTxt.replace(
                                            /"([aA-zZ0-9<]{1})/g, "“$1")
                                        .replace(/"/g,
                                            "”")
                                        .replace(/'/g,
                                            "’")
                                    afTotal++
                                    break;
                                case "RU":
                                    eventIssue.push(
                                        "<span class=\"minor_issue\">⚠️ Proper Russian uses chevrons: <b>« »</b>"
                                    );
                                    minTotal++
                                    eventFixedTxt = eventFixedTxt.replace(
                                            /"([^$\\n\s.,:?!])/g, "«$1")
                                        .replace(/"/g, "»")
                                    afTotal++
                                    break;
                            }
                        }
                        if (eventTxt.indexOf("!?") !== -1) {
                            eventIssue.push(
                                "<span class=\"minor_issue\">⚠️ Unconventional punctuation detected. Did you mean to use '?!'"
                            )
                            minTotal++
                            eventFixedTxt = eventFixedTxt.replace(/[!][?]/g,
                                "?!")
                            afTotal++
                        }

                        if (eventTxt.indexOf(" - ") !== -1 && !eventIsFn) {
                            eventIssue.push(
                                "<span class=\"minor_issue\">⚠️ Instead of hyphen, consider en or em dash: – or —"
                            )
                            minTotal++
                            afTotal++
                        }
                        var eventSpecial = false
                        var hasSpace = /(\s$|^\s)/;
                        var eventTxt_lines = eventTxt.split("\n");
                        var nPos = eventTxt.lastIndexOf("\n");
                        var hasSpaceIssue = nPos && (typeof eventTxt[nPos +
                            1] == "undefined")
                        var overLineLimit = false
                        var hasDoubleSpace = eventTxt.replace("\n", "")
                            .split(/\s\s/)
                            .length - 1
                        var hasThreeLines = typeof eventTxt_lines[2] !==
                            "undefined"
                        for (var line of eventTxt_lines) {
                            hasSpaceIssue = (hasSpace.test(line) ||
                                hasSpaceIssue)
                            if (line.replace(/[\u064b-\u0652]/gi, "")
                                .length > line_limit) {
                                eventSpecial = line
                                overLineLimit = true
                            }
                        }
                        if (hasDoubleSpace) {
                            eventIssue.push(
                                "<span class=\"minor_issue>\"<span class=\"minor_issue\">⚠️ Double spaces detected, replace with single space</span>"
                            );
                            minTotal++
                        }
                        if (hasThreeLines) {
                            eventIssue.push(
                                "<span class=\"major_issue\">🚫 Three lines detected in this event"
                            );
                            majTotal++
                        }
                        if (hasSpaceIssue) {
                            if (eventTxt.length > 1) {
                                eventIssue.push(
                                    "<span class=\"minor_issue\">⚠️ One of the lines begins or ends with whitespace"
                                );
                                try {
                                    eventFixedTxt = eventFixedTxt.replace(
                                            /( |)\n( |)/, "‣")
                                        .replace(
                                            /[ ]{2,}/gi, " ")
                                        .trim()
                                        .replace("‣",
                                            "\n")
                                    eventFixedTxt = eventFixedTxt.replace(
                                            ' <b></b>', '<b></b>')
                                        .replace(
                                            ' </i><b></b>', '</i><b></b>')
                                    eventFixedTxt = eventFixedTxt.replace(
                                        /( )(<(|\/)i>)(\n)/g, "$2$4")
                                    eventFixedTxt = eventFixedTxt.replace(
                                        '<i></i>', '')
                                    afTotal++
                                } catch (e) {
                                    eventFixedTxt = eventFixedTxt.replace(
                                            /( |)\n( |)/, "×")
                                        .replace(/ \s+/gi,
                                            " ")
                                        .trim()
                                        .replace("×", "\n")
                                    afTotal++
                                }
                            } else {
                                eventIssue.push(
                                    "<span class=\"major_issue\">🚫 Empty event detected!"
                                );
                                majTotal++
                                eventSpecial =
                                    "<span style='color:red;'>&lt;text cannot be empty&gt;</span>"
                            }
                        }
                        if (overLineLimit) {
                            eventIssue.push(
                                "<span class=\"major_issue\">🚫 Line over max limit of " +
                                line_limit + " for " + LANG)
                            majTotal++
                            eventSpecial = [
                                eventSpecial.slice(0, line_limit),
                                "<span style='color: red; text-overflow: fade;'>",
                                eventSpecial.slice(line_limit)
                            ].join('')
                        }
                        if (delta * delta > 49) {
                            eventIssue.push(
                                "<span class=\"major_issue\">🚫 Maximum duration exceeded for current FPS!"
                            )
                            majTotal++
                        }
                        // var halfLength = totalLength - Contrary to official statement,
                        // ( eventTxt.replace(/[ ]/g, '') Originator does not count
                        // .replace(/[^a-z0-9]/gi Western punctuation and spaces
                        // , '').length); as 0.5 characters for CPS.*/
                        //
                        // totalLength += (halfLength/(-2))
                        if (cps > normal_cps && cps < max_cps) {
                            html_cps =
                                '<div><span style="color: gold;">&nbsp;&nbsp;&emsp;' +
                                round_int_cps + ' c/s</span></div>'
                        } else if (cps > (max_cps)) {
                            eventIssue.push(
                                "<span class=\"major_issue\">🚫 Reading speed above maximum! Either truncate text or extend timings!"
                            )
                            majTotal++
                            html_cps =
                                '<div><span style="color:red;">&nbsp;&nbsp;&emsp;' +
                                round_int_cps + ' c/s</span></div>'
                        } else {
                            html_cps =
                                '<div><span style="color:silver;">&nbsp;&nbsp;&emsp;' +
                                round_int_cps + ' c/s</span></div>'
                        }
                        var dur_tcf = frames2tcf(delta * fps)
                            .substr(6)
                        var eventLines = eventTxt.trim()
                            .split("\n")
                        if (typeof eventIssue !== "undefined" && eventIssue
                            .length > 0) {
                            events_detected++;
                            var log_event = (start_tcf + " " + eventTxt_lines[
                                        0].slice(0, line_limit)
                                    .padEnd(
                                        line_limit + 4, " ") + _id)
                                .padEnd(
                                    line_limit + 10, " ")
                            if (typeof eventTxt_lines[1] !== "undefined") {
                                log_event += "\n" + end_tcf + " " +
                                    eventTxt_lines[1].padEnd(line_limit + 8,
                                        " ")
                            } else {
                                log_event += "\n" + end_tcf + " " + " ".padEnd(
                                    line_limit + 6, " ")
                            }
                            console.log('%c' + log_event,
                                'background: #12343b; color: #66ff00')
                            console.log((+_id + "\n" + start_tcf + "\n" +
                                    end_tcf + "\n" + eventTxt)
                                .padEnd(50),
                                'background: #222; color: #bada55');
                            console.log(('%c' + eventIssue.join("\n"))
                                .padEnd(
                                    50),
                                'background: #FFF; color: #FF0000; font-style: italic; border:solid 1px #000;'
                            )
                            console.log("┉".repeat(63))
                            var issue = {
                                id: _id,
                                issues: eventIssue,
                                content: eventTxt,
                                contentO: eventOriginalTxt,
                                start_tcf: start_tcf,
                                end_tcf: end_tcf,
                                start_frames: start_frames,
                                end_frames: end_frames,
                                start_time: start_time,
                                end_time: end_time,
                                duration: delta,
                                cps: cps,
                                html_cps: html_cps,
                                dur_tcf: dur_tcf,
                                special: eventSpecial
                            }
                            htmlize(issue)
                            if (eventFixedTxt !== eventOriginalTxt) {
                                fSRT[srtId]["text"] = eventFixedTxt
                            }
                        }
                    }
                    if (!events_detected) {
                        console.log('%c' + "No issues detected",
                            'background: #12343b; color: #66ff00')
                    }

                    function htmlize(issue) {
                        try {
                            var original = issue.contentO.replace('<b></b>',
                                    '')
                                .replace(/{.an.}/g, '')
                            var lines = original
                        } catch (e) {
                            var lines = issue.content;
                        }
                        lines = lines.replace(/\n/g, '⏎');
                        lines = lines.replace(/\s/g,
                            "<span class='cSpace'>⎵</span>");
                        lines = lines.replace(/⏎/g,
                            "<span class='cSpace' style=\"color: #00fa00;\">⏎</span>\n"
                        );
                        lines = lines.split("\n");
                        if (issue.special) {
                            var check_length = lines[0].replace(/[\u064b-\u0652]/gi, "")
                                .length;
                            lines[0] = issue.special
                            if (check_length > line_limit) {
                                var save_l0 = issue.special.substring(
                                    line_limit - 1)
                                lines[0] = issue.special.substring(0,
                                        line_limit - 1)
                                    .replace(/\s/g,
                                        "<span class='cSpace'>⎵</span>") +
                                    save_l0
                            }
                        }
                        var timedTextEvent =
                            '<div class="TimedTextEvent" style="width: 700px; max-width: 100%;">' +
                            '<div class="details">' +
                            '<div class="timing"><span class="TimeCode">' +
                            issue.start_tcf + '</span>' +
                            '<span class="TimeCode">' + issue.end_tcf +
                            '</span></div><div class="content"><div class="header">' +
                            '<span class="index">' + issue.id + '</span>' +
                            issue.html_cps +
                            '<span class="duration"><span class="TimeCode">' +
                            issue.dur_tcf + '</span></span>' +
                            '</div><div class="StyledTextEditor" dir="ltr" style="position:relative; top:-20px;">' +
                            '<pre><span>' + lines[0];
                        if (typeof lines[1] == "undefined") {
                            lines[1] = ""
                        }
                        timedTextEvent += '</span><div><span>' + lines[1] +
                            '</span></div>'
                        if (typeof lines[2] !== "undefined") {
                            timedTextEvent +=
                                '<div><span style="color:red;">' + lines[2] +
                                '</span></div></pre>'
                        } else {
                            timedTextEvent += "</pre>"
                        }
                        for (var each_issue of issue.issues) {
                            var issueWithImg =
                                '<div style="vertical-align:middle;float:left;">' +
                                "<span class='issue'>" + each_issue +
                                "</span></span></div>"
                            timedTextEvent += issueWithImg + "<br />"
                        }
                        reportHtml += timedTextEvent +
                            "</div></div></div></div></div>"
                        evTotal++
                    }
                    var withSC = ''
                    if (shotChanges) {
                        withSC = "_withShotChanges"
                    }
                    var fixesFilename = srtName("Fixes_" + LANG + "_" +
                        fps_ + withSC)
                    var fixedSrtFull = parsed2srt(fSRT)
                    fixedSrtFull = fixedSrtFull.replace(/ <b><\/b>/g,
                        '<b></b>')
                    var suggestedFixesTxt =
                        '<a id="FixedTaskSRT" download="' + fixesFilename +
                        '" href="data:text/plain;charset=utf-8,' +
                        encodeURIComponent(fixedSrtFull) +
                        '"><button>✎</button></a>'
                    qcMeta.results = {
                        totalEventsAffected: evTotal,
                        majorIssuesFound: majTotal,
                        minorIssuesFound: minTotal,
                        shotChangeViolations_found: scTotal,
                        autoFixesDone: afTotal
                    }

                    function getUnnamed() {
                        function n(n) {
                            for (let e = n.length - 1; e > 0; e--) {
                                let i = Math.floor(Math.random() * (e + 1));
                                [n[e], n[i]] = [n[i], n[e]]
                            }
                        }
                        var e = ["Beaver", "Koala", "Chipmunk", "Goat",
                            "Duckling", "Cheetah", "Platypus", "Eagle",
                            "Mongoose", "Butterfly"
                        ];
                        n(e);
                        var i = ["An Intrepid", "A Meek", "A Feisty",
                            "A Lazy", "A Sly", "An Unperturbed",
                            "An Amused", "A Rabid", "A Very", "A Really"
                        ];
                        n(i);
                        var t = [" Little ", " Humongous ", " Tiny ",
                            " Vain ", " Finicky ", " Cunning ", " Exotic ",
                            " Weary ", " Opinionated ", " Conniving "
                        ];
                        return n(t), i[7] + t[7] + e[7]
                    }
                    localStorage.removeItem("shotChanges:" + qcMeta.clq)
                    var qcMetaStr = "`" + JSON.stringify(qcMeta, null, 2) +
                        "`"
                    if (typeof userName == "undefined") {
                        userName = getUnnamed()
                    }
                    reportHtml = reportHtml.replace("DLFIXSRTTOKEN",
                            suggestedFixesTxt)
                        .replace(
                            /WATERMARKPLACEHOLDER/g, userIp)
                        .replace(
                            "TITLEINFOTOKEN", titleInfo)
                        .replace(
                            "TITLEINFOTOKEN", titleInfo)
                        .replace(
                            "LINGUISTNAME", userName)
                        .replace("METADATATOKEN",
                            qcMetaStr)
                    console.log(qcMeta.results)
                    download(srtName("Auto_QC_Log_" + LANG + '_' + fps_ +
                        withSC, ".html"), reportHtml)
                }
                return runAutoQC
            })));
            (function(global, factory) {
                typeof exports === 'object' && typeof module !== 'undefined' ?
                    module.exports = factory() : typeof define === 'function' &&
                    define.amd ? define(factory) : (global.parseSRT = factory());
            }(this, (function() {
                'use strict';

                function toSeconds(time) {
                    var t = time.split(':');
                    try {
                        var s = t[2].split(',');
                        if (s.length === 1) {
                            s = t[2].split('.');
                        }
                        return parseFloat(t[0], 10) * 3600 + parseFloat(t[1],
                            10) * 60 + parseFloat(s[0], 10) + parseFloat(s[
                            1], 10) / 1000;
                    } catch (e) {
                        return 0;
                    }
                }

                function nextNonEmptyLine(linesArray, position) {
                    var idx = position;
                    while (!linesArray[idx]) {
                        idx++;
                    }
                    return idx;
                }

                function lastNonEmptyLine(linesArray) {
                    var idx = linesArray.length - 1;
                    while (idx >= 0 && !linesArray[idx]) {
                        idx--;
                    }
                    return idx;
                }

                function parseSRT() {
                    var data = arguments.length > 0 && arguments[0] !==
                        undefined ? arguments[0] : '';
                    var subs = [];
                    var lines = data.split(/(?:\r\n|\r|\n)/gm);
                    var endIdx = lastNonEmptyLine(lines) + 1;
                    var idx = 0;
                    var time = void 0;
                    var text = void 0;
                    var sub = void 0;
                    for (var i = 0; i < endIdx; i++) {
                        sub = {};
                        text = [];
                        i = nextNonEmptyLine(lines, i);
                        sub.id = parseInt(lines[i++], 10);
                        time = lines[i++].split(/[\t ]*-->[\t ]*/);
                        sub.start = toSeconds(time[0]);
                        idx = time[1].indexOf(' ');
                        if (idx !== -1) {
                            time[1] = time[1].substr(0, idx);
                        }
                        sub.end = toSeconds(time[1]);
                        while (i < endIdx && lines[i]) {
                            text.push(lines[i++]);
                        }
                        sub.text = text.join('\\N')
                            .replace(/{.an8}/,
                                'POSToppyTAG')
                            .replace(
                                /\{(\\[\w]+\(?([\w\d]+,?)+\)?)+\}/gi, '');
                        sub.text = sub.text.replace(/</g, '&lt;')
                            .replace(
                                />/g, '&gt;');
                        sub.text = sub.text.replace(
                            /&lt;(\/?(font|b|u|i|s))((\s+(\w|\w[\w\-]*\w)(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)(\/?)&gt;/gi,
                            '<$1$3$7>');
                        sub.text = sub.text.replace(/\\N/gi, "\n");
                        sub.text = sub.text.replace('POSToppyTAG', '{\\an8}')
                        subs.push(sub);
                    }
                    return subs;
                }
                return parseSRT;
            })));
            setShotChanges()
            defer(runAutoQC)
        })()
    }

    function imarunettuDoubleExportSRT() {
        (function() {
            var our_clq = document.location.href.toString()
                .split("=")[1].split(
                    ":")[2]
            var clq_pattern = new RegExp(
                '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
                'i');
            if (!our_clq || !clq_pattern.test(our_clq)) {
                alert("You must be in a started, saved Originator task!");
                throw new Error
            }
            if (!clq_pattern.test(our_clq)) {
                alert("The CLQ is invalid: " + our_clq + "\n" +
                    "Please report me to the developer.");
                throw new Error
            }
            var bilingualHtml = `
        var prevScrollpos=window.pageYOffset;
window.onscroll=function() {
    var currentScrollPos=window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top="0";
    }
    else {
        document.getElementById("navbar").style.top="-50px";
    }
    prevScrollpos=currentScrollPos;
}


function loadScript(src){
var jScript = document.createElement('script')
jScript.type = "text/javascript";
jScript.src = src.trim();
document.body.appendChild(jScript)
}

document.addEventListener('DOMContentLoaded', function load() {
    if (!window.jQuery) return setTimeout(load, 50);
        console.log("jQuery and JsDiff are loaded! Executing main.");
    main();
}, false);

function main(){
document.addEventListener('paste', function(e) {
  var pasteStatus = document.getElementById("pasteReady");
  pasteStatus.innerText = "got paste!";
  pasteStatus.style.opacity = 0.01;
  fade("in",500,pasteStatus);
  var earlier_html = e.clipboardData.getData('text/html');
  //console.log(earlier_html);
  proceedWithCompare(earlier_html);
}, {once: true} ); console.log("Listening for paste!");

var oldRows = document.getElementsByTagName("tr")

function fade(type, ms, el, remove = false) {
    var isIn = type === 'in',
        opacity = isIn ? 0 : 1,
        interval = 20,
        duration = ms,
        gap = interval / duration

    if (isIn) {
        el.style.display = 'inline'
        el.style.opacity = opacity
    }

    function func() {

        opacity = isIn ? opacity + gap : opacity - gap
        el.style.opacity = opacity

        if (opacity <= 0) { remove ? el.remove() : el.style.display = 'none' }
        if (opacity <= 0 || opacity >= 1) window.clearInterval(fading)
    }

    var fading = window.setInterval(func, interval)
}


var b = document.querySelector("#the-button")
b.innerText = "DIFF ENGINE ON";
b.style.color = "gold";
b.style.fontWeight = "bold";
b.style.backgroundColor = "brightgreen";
fade("in",700,b,false);
var p = document.createElement('span');
p.innerText = "paste it!";
p.style = "position: relative; top: 1px; left: 13px; font-weight: bold; color: ivory; opacity: 0.5;"
p.id = "pasteReady";
b.insertAdjacentElement("afterEnd",p);


function proceedWithCompare(document_html){

    function createTextSheetFromRows(rows,childNumber){
    var text = ""
        for(row of rows){
        text += row.children[childNumber].innerText+"\\n\\r\\r\\r\\n\\r\\n"
        }
    return text
    }

var document_new = new DOMParser().parseFromString(document_html, "text/html");

newRows = document_new.body.getElementsByTagName("tr")

 var pasteStatus = document.getElementById("pasteReady");

if(newRows.length == 0)
{
 pasteStatus.innerText = "paste error!";
 pasteStatus.style.opacity = 0.01;
 pasteStatus.style.color = "red";
 fade("in",500,pasteStatus,false);   
} else {
pasteStatus.innerText = "use Alt+Z";
 pasteStatus.style.opacity = 0.01;
 pasteStatus.style.color = "green";
  b.innerText = "DIFF SUCCESS";
 b.style.opacity = 0.3;
 fade("in",500,pasteStatus,false);   
}


function diffAndPopulateCell(oldRows,newRows,dmethod,cellNumber)
{
    
oldRowsText = createTextSheetFromRows(oldRows, cellNumber) 

newRowsText = createTextSheetFromRows(newRows, cellNumber) 

switch(dmethod) {
    case "1" : diff = JsDiff.diffWords(oldRowsText, newRowsText); break;
    case "2" : diff = JsDiff.diffLines(oldRowsText, newRowsText); break;
    case "3" : diff = JsDiff.diffChars(oldRowsText, newRowsText); break;
    case "4" : diff = JsDiff.diffWordsWithSpace(oldRowsText, newRowsText); break;
    case "5" : diff = JsDiff.diffTrimmedLines(oldRowsText, newRowsText); break;
    case "6" : diff = JsDiff.diffSentences(oldRowsText, newRowsText); break;
    default: diff = JsDiff.diffWordsWithSpace(oldRowsText, newRowsText);}

textHolder = document.createElement("pre")
fragment = document.createDocumentFragment();

diff.forEach((part) => { const color = part.added ? "#26ff00" :   part.removed ? 'red' : '#808080';
    var class_name = part.added ? "goody" : part.removed ? 'bady' : 'neutry';
    var font_weight = part.added ? "bold" : part.removed ? "lighter" : "normal";
    span = document.createElement('span'); 
    span.style.color = color;
    span.className = class_name;
    span.style.fontWeight = font_weight;
    part.removed && (span.style.textDecoration = "line-through");
    part.removed && (span.style.opacity=0.9);
  span.appendChild(document.createTextNode(part.value));
  fragment.appendChild(span); 
});

textHolder.appendChild(fragment)
eval("c" + cellNumber + ".appendChild(textHolder)")
}



var table = document.querySelector("table")

var newTable = document.createElement("table")
var row = newTable.insertRow(0)
var c0 = row.insertCell(0)
var c1 = row.insertCell(1)
var c2 = row.insertCell(2)
newTable.style.width = "80%"; 
newTable.style.margin = "auto";
newTable.style.contenteditable =true;

var dMeth = prompt("Select comparison mode: 1. Words, 2. Lines, 3. Characters\\n4. Words-and-Whitespace, 5. Trimmed-Lines, 6. Sentences","1");


diffAndPopulateCell(oldRows,newRows,3,0)
var cues = [];
cues = c0.innerHTML.split("\\n\\r\\r\\r\\n\\r\\n")

diffAndPopulateCell(oldRows,newRows,dMeth,1)
var originals = [];
originals = c1.innerHTML.split("\\n\\r\\r\\r\\n\\r\\n")

diffAndPopulateCell(oldRows,newRows,dMeth,2)
var translations = [];
translations = c2.innerHTML.split("\\n\\r\\r\\r\\n\\r\\n")

if(originals.length > translations.length) {var lim=originals.length} else {var lim=translations.length};  var newHtml='<table><tbody>'; for(a=1; a<lim; a++){ newHtml += '<tr><td><pre>' + cues[a] + '</pre></td><td><pre>' + originals[a] + '</pre></td><td><pre>' + translations[a] +'</pre></td></tr>'; } newHtml += "</tbody></table>"

document.querySelector("table").outerHTML = newHtml
var visibility = "both";

document.onkeydown = function(event){
      if (event.altKey && event.keyCode == 90) {
        //Alt+Z, simultaneously.

      switch (visibility) {
      case "both":  for(ea of document.getElementsByClassName("bady")) { fade('out',100,ea,false) }; visibility = "only_goodies";
                    break;
      case "only_goodies": for(ea of document.getElementsByClassName("bady")) { fade('in',100,ea,false) }
                           for(ea of document.getElementsByClassName("goody")) { fade('out',100,ea,false) }
                           visibility = "only_mistakes"
                           break;
      case "only_mistakes":  for(ea of document.getElementsByClassName("goody")) { fade('in',100,ea,false) }
                           visibility = "both"
                            break;
      default: for(ea of document.getElementsByClassName("bady")) { fade('in',100,ea,false) }
                           for(ea of document.getElementsByClassName("goody")) { fade('in',100,ea,false) }
                            visibility = "both"}}}}}</script>
  <style>#navbar {
      background-color: #333;
      top: 0;
      position: fixed;
      width: 80%;
      left: 10%;
      transition: top 0.5s;
      margin-left: auto;
      margin-right: auto;
      opacity: 0.7;
  }

  #navbar a {
      float: left;
      display: block;
      color: white;
      text-align: center;
      padding: 5px;
      text-decoration: none;
  }

  #navbar a:hover {
      background-color: #ddd;
      color: black;
  }

  body {
      background: #212121;
      color: grey;
  }

  table {
      width: 80%;
      table-layout: fixed;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      margin-top: 60px;
          border-collapse: collapse;

  }

  thead,
  tbody,
  td,
  tr
   {
      display: block;
      font-family: monospace; 

  }

  tr {

  background-image: linear-gradient(to right, darkgrey 30%, rgba(255,255,255,0) 0%);
  background-position: bottom;
  background-size: 3px 1px;
  background-repeat: repeat-x;
  }

  tr:after {
      content: ' ';
      display: block;
      visibility: hidden;
      clear: both;
          border-bottom: 1px solid #ccc;

  }

    #titleinfo {
              color: #fffff0;
              font-weight: bolder;
              font-style: normal;
              font-family: Roboto;
              font-size: 150%;
              margin-left: 55px;
              margin-top: 8px;
              flex-shrink: 1;
              width: 800px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              }


  thead th {
      height: 30px;
      /*text-align: left;*/
  }


  thead {
      /* fallback */
  }

  tbody td,
  thead th {
      width: 33%;
      float: left;
  }

  tr:hover {
      color: darkgrey;
  }


      </style>
  <head><body>
           <div id="navbar">
                <a href="TITLELINK"><img id="logonetflix" width="auto" height="32" src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" title="Backup made on TITLEDATE"></a>
                <span id="titleinfo" title="TITLEINFO">TITLEINFO (TITLEDATE)</span>              <button type="button" id="the-button" class="btn btn-raised" style="background-color: darkgreen; color: white; opacity: 0.3; position: relative; top: -18px; left: 105px;" onclick="loadScript('https://katzurki.github.io/nettufurikusu/diff.js')">DIFF ENGINE OFF</button></div>
  <table>
      <thead>
      <tr>
          <th><b><u>In-cue/Out-cue</b></u></th>
          <th><b><u>Source</b></u></th>
          <th><b><u>Translation</b></u></th>
      </tr>
      </thead>
      <tbody>
      `
            var lsJson = localStorage["clq:origination:" + our_clq]
            if (!lsJson) {
                alert("Timed text events not found in localStorage\nfor CLQ: " +
                    our_clq + "\n" + "If the CLQ is correct and" + "\n" +
                    "\"Save to local storage\" is enabled in Settings," + "\n" +
                    "save the task and try again.");
                throw new Error
            }
            var json_obj = JSON.parse(lsJson)
            var src = json_obj["events"]
            var fps_ = json_obj["meta"]["fps"]
            var fps = fps_.split("_")[1] / 100
            //From {"fps":"FPS_2500"}
            var proposed_fps = prompt(
                "DOUBLE EXPORT SRT reports…\n\nPress Enter to accept framerate of " +
                fps + " or enter new as 2400 or 2997:");
            if (proposed_fps !== "") {
                var int_fps = proposed_fps.substring(0, 2);
                var decimal_fps = proposed_fps.substring(2, proposed_fps.length);
                fps_ = "FPS" + "_" + int_fps + decimal_fps
                fps = (int_fps + "." + decimal_fps) * 1;
            }
            var mid = json_obj["meta"]["movieId"]
            var pid = json_obj["meta"]["packageId"]
            var which_url = prompt(
                "DOUBLE EXPORT SRT reports…\n\nPress Enter to try the template. Enter anything to go for CC."
            )
            var which_lang = prompt(
                "DOUBLE EXPORT SRT reports…\n\nPress Enter to go for English. Enter a language code to try that (es/fr/ru/etc).",
                "en");
            if (which_lang == "") {
                which_lang = "en"
            }
            if (which_url == "") {
                var template_url =
                    "https://originator.backlot.netflix.com/api/request/timedText/" +
                    our_clq + '/' + pid + '/' + mid + '/' + which_lang + '/TEMPLATE/PRIMARY/' +
                    fps_ + '?source=ORIGINATOR'
            } else {
                var template_url =
                    "https://originator.backlot.netflix.com/api/request/timedText/" +
                    our_clq + '/' + pid + '/' + mid + '/' + which_lang + '/CC/PRIMARY/' + fps_ +
                    '?source=ARCHIVE'
            }
            var targetFilename = srtName(fps_ + "_TRANSLATION")
            var sourceFilename = srtName(fps_ + "_SOURCE")
            var backupFilename = srtName(fps_ + "_BILINGUAL_TABLE")
                .replace(".srt",
                    ".html")
            var frms = 1000 / fps
            async function getSourceColumnEvents() {
                var result = await (await fetch(template_url))
                    .json();
                return result;
            }
            async function delayedDownload() {
                var result = await getSourceColumnEvents();
                download(sourceFilename, array2srt(result))
                //  download(backupFilename, arrays2html(result, src),"html" )
            }
            delayedDownload()
            download(targetFilename, array2srt(src))

            function srtName(suffix = "") {
                var s = document.getElementsByClassName("cpe-page-menu-label")[0]
                    .innerText
                var srtName = (s.replace(/[ ]/g, '_')
                        .replace(/[^a-z0-9_]/gi, '') +
                        suffix + ".srt"
                    ) //This gets rid of all punctuation, spaces and non-English letters
                    .trim() //resulting in a name like 14545_El_Burrito_A_Breaking_Fat_Movie_FPS_2500.srt
                if (!srtName) srtName = our_clq + "_" + suffix +
                    ".srt" //Fallback measure. Useful for debugging later
                return srtName
            }

            function frames2timecode(frames) { //frames to 00:01:02,000 format
                var milliseconds = Math.round(frames * frms)
                var srt_timecode = TimeConversion(milliseconds)
                return srt_timecode
            }

            function merge_same(array) {
                var merged = []
                var skip_next = false
                for (i = 0; i < array.length - 1; i++) {
                    if (!skip_next) {
                        thisEvent = array[i]
                        nextEvent = array[i + 1]
                        if (thisEvent[5] == nextEvent[5]) {
                            skip_next = true
                            thisEvent[2] = thisEvent[2] + "\n" + nextEvent[2]
                            thisEvent[1] = nextEvent[1]
                        }
                        merged.push(thisEvent)
                    } else {
                        skip_next = false
                    }
                }
                return merged
            }

            function arrays2html(events_object, events_object2) {
                var ordered_events = []
                var col = "SRC"
                for (var id in events_object) {
                    events_object[id]["column"] = col
                    try {
                        var type_fn = events_object[id]["type"]
                        if (type_fn === "fn") {
                            events_object[id]["txt"] += "<b></b>";
                            type_fn = undefined;
                        }
                    } catch (e) {}
                    ordered_events.push([
                        events_object[id]["start"], events_object[id]["end"],
                        events_object[id]
                        ["txt"],
                        events_object[id]
                        ["styles"],
                        events_object[id]
                        ["rgn"],
                        events_object[id]
                        ["column"],
                    ])
                }
                var col = "TRG"
                for (var id in events_object2) {
                    events_object2[id]["column"] = col
                    ordered_events.push([
                        events_object2[id]["start"], events_object2[id]["end"],
                        events_object2[id]
                        ["txt"],
                        events_object2[id]
                        ["styles"],
                        events_object2[id]
                        ["rgn"],
                        events_object2[id]
                        ["column"],
                    ])
                }
                ordered_events.sort(function(a, b) {
                    return a[0] - b[0];
                }); //Array sorted by in_cues, sequentially
                ordered_events = merge_same(ordered_events)
                //    ordered_events.sort(function (a
                //        , b) {
                //        return a[1] - b[1];
                //    }); //Array sorted by out_cues this time, because merge_same changes some, sequentially
                var index = 0
                var srt_txt = bilingualHtml;
                var eol = ""
                var source_content = ''
                for (event of ordered_events) {
                    var start = frames2timecode(event[0])
                    var end = frames2timecode(event[1])
                    var startend = start + "\n" + end
                    try {
                        if (typeof event[3][0]["type"] !== "undefined") {
                            if (event[3][0]["type"] == "italic") {
                                content = italicize(content, event[3])
                            }
                        }
                    } catch (e) {}
                    if (event[5] == "SRC") {
                        source_content += event[2]
                    } else {
                        tr = '<tr><td><pre>' + startend + '</pre></td><td><pre>' +
                            source_content + '</pre></td><td><pre>' + event[2] +
                            '</pre></td></tr>' + "\n";
                        srt_txt += tr;
                        tr = "";
                        source_content = ""
                    }
                }
                var titleinfo = document.getElementsByClassName(
                        "cpe-page-menu-label")[0].innerText.replace(/ "/, " “")
                    .replace(/"/, "”")
                var titlelink = document.location.href
                var titledate = new Date()
                    .toISOString()
                    .slice(0, 10)
                srt_txt = srt_txt.replace(/TITLEINFO/g, titleinfo)
                    .replace(
                        /TITLELINK/, titlelink)
                    .replace(/TITLEDATE/g, titledate)
                return srt_txt
            }

            function array2srt(events_object) {
                var ordered_events = []
                for (var id in events_object) {
                    try {
                        var type_fn = events_object[id]["type"]
                        if (type_fn === "fn") {
                            events_object[id]["txt"] += "<b></b>";
                            type_fn = undefined;
                        }
                    } catch (e) {}
                    ordered_events.push([
                        events_object[id]["start"], events_object[id]["end"],
                        events_object[id]
                        ["txt"],
                        events_object[id]
                        ["styles"],
                        events_object[id]
                        ["rgn"]
                    ])
                }
                ordered_events.sort(function(a, b) {
                    return a[0] - b[0];
                }); //Array sorted by in_cues, sequentially
                var index = 0
                var srt_txt = ''
                for (event of ordered_events) {
                    index++
                    var start = frames2timecode(event[0])
                    var end = frames2timecode(event[1])
                    var content = event[2]
                    try {
                        if (typeof event[3][0]["type"] !== "undefined") {
                            if (event[3][0]["type"] == "italic") {
                                content = italicize(content, event[3])
                            }
                        }
                    } catch (e) {}
                    try {
                        if (typeof event[4] !== "undefined") {
                            if (event[4] == "top") {
                                content = "{\\an8}" + content
                            }
                        }
                    } catch (e) {}
                    try {
                        if (event["type"] == "fn") {
                            content += '<b></b>'
                        }
                    } catch (e) {}
                    console.log(content)
                    var current_event = index + "\n" + start + " --> " + end + "\n" +
                        content + "\n"
                    srt_txt += current_event + "\n"
                }
                return srt_txt
            }

            function italicize(content, italics_array) {
                position_offset = 0
                for (var italic of italics_array) {
                    var position_from = italic["from"] + position_offset;
                    position_offset += 3
                    content = [content.slice(0, position_from), "<i>", content.slice(
                        position_from)].join('')
                    var position_to = italic["to"] + position_offset;
                    position_offset += 4
                    content = [content.slice(0, position_to), "</i>", content.slice(
                        position_to)].join('')
                }
                return content
            }

            function download(filename, text, type = "plain") {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/' + type +
                    ';charset=utf-8,%EF%BB%BF' + encodeURIComponent(text));
                element.setAttribute('download', filename);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }

            function TimeConversion(duration) {
                let time = parseDuration(duration)
                return formatTimeHMSS(time)
            }

            function parseDuration(duration) {
                let remain = duration
                let hours = Math.floor(remain / (1000 * 60 * 60))
                remain = remain % (1000 * 60 * 60)
                let minutes = Math.floor(remain / (1000 * 60))
                remain = remain % (1000 * 60)
                let seconds = Math.floor(remain / (1000))
                remain = remain % (1000)
                let milliseconds = remain
                return {
                    hours,
                    minutes,
                    seconds,
                    milliseconds
                }
            }

            function formatTimeHMSS(o) {
                let hours = o.hours.toString()
                if (hours.length === 1) hours = '0' + hours
                let minutes = o.minutes.toString()
                if (minutes.length === 1) minutes = '0' + minutes
                let seconds = o.seconds.toString()
                if (seconds.length === 1) seconds = '0' + seconds
                let milliseconds = o.milliseconds.toString()
                if (milliseconds.length === 1) milliseconds = '00' + milliseconds
                if (milliseconds.length === 2) milliseconds = '0' + milliseconds
                return hours + ":" + minutes + ":" +
                    //Example: 00:01:02,999 -- note that the SRT spec calls for a comma, not a period!
                    seconds + "," + milliseconds
            }
        })();
    }

    function imarunettuBilingualExportHTML() {
        (function() {
            var our_clq = document.location.href.toString()
                .split("=")[1].split(
                    ":")[2]
            var clq_pattern = new RegExp(
                '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
                'i');
            if (!our_clq || !clq_pattern.test(our_clq)) {
                alert("You must be in a started, saved Originator task!");
                throw new Error
            }
            if (!clq_pattern.test(our_clq)) {
                alert("The CLQ is invalid: " + our_clq + "\n" +
                    "Please report me to the developer.");
                throw new Error
            }
            var bilingualHtml = `<head>
      <script>
    console.log("Loading started...");
</script>
<script>
var prevScrollpos=window.pageYOffset;
window.onscroll=function() {
    var currentScrollPos=window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top="0";
    }
    else {
        document.getElementById("navbar").style.top="-50px";
    }
    prevScrollpos=currentScrollPos;
}


function loadScript(src){
var jScript = document.createElement('script')
jScript.type = "text/javascript";
jScript.src = src.trim();
document.body.appendChild(jScript)
}

document.addEventListener('DOMContentLoaded', function load() {
    if (!window.jQuery) return setTimeout(load, 50);
        console.log("jQuery and JsDiff are loaded! Executing main.");
    main();
}, false);

function main(){
document.addEventListener('paste', function(e) {
  var pasteStatus = document.getElementById("pasteReady");
  pasteStatus.innerText = "got paste!";
  pasteStatus.style.opacity = 0.01;
  fade("in",500,pasteStatus);
  var earlier_html = e.clipboardData.getData('text/html');
  //console.log(earlier_html);
  proceedWithCompare(earlier_html);
}, {once: true} ); console.log("Listening for paste!");

var oldRows = document.getElementsByTagName("tr")

function fade(type, ms, el, remove = false) {
    var isIn = type === 'in',
        opacity = isIn ? 0 : 1,
        interval = 20,
        duration = ms,
        gap = interval / duration

    if (isIn) {
        el.style.display = 'inline'
        el.style.opacity = opacity
    }

    function func() {

        opacity = isIn ? opacity + gap : opacity - gap
        el.style.opacity = opacity

        if (opacity <= 0) { remove ? el.remove() : el.style.display = 'none' }
        if (opacity <= 0 || opacity >= 1) window.clearInterval(fading)
    }

    var fading = window.setInterval(func, interval)
}


var b = document.querySelector("#the-button")
b.innerText = "DIFF ENGINE ON";
b.style.color = "gold";
b.style.fontWeight = "bold";
b.style.backgroundColor = "brightgreen";
fade("in",700,b,false);
var p = document.createElement('span');
p.innerText = "paste it!";
p.style = "position: relative; top: 1px; left: 13px; font-weight: bold; color: ivory; opacity: 0.5;"
p.id = "pasteReady";
b.insertAdjacentElement("afterEnd",p);


function proceedWithCompare(document_html){

    function createTextSheetFromRows(rows,childNumber){
    var text = ""
        for(row of rows){
        text += row.children[childNumber].innerText+"\\n\\r\\r\\r\\n\\r\\n"
        }
    return text
    }

var document_new = new DOMParser().parseFromString(document_html, "text/html");

newRows = document_new.body.getElementsByTagName("tr")

 var pasteStatus = document.getElementById("pasteReady");

if(newRows.length == 0)
{
 pasteStatus.innerText = "paste error!";
 pasteStatus.style.opacity = 0.01;
 pasteStatus.style.color = "red";
 fade("in",500,pasteStatus,false);   
} else {
pasteStatus.innerText = "use Alt+Z";
 pasteStatus.style.opacity = 0.01;
 pasteStatus.style.color = "green";
  b.innerText = "DIFF SUCCESS";
 b.style.opacity = 0.3;
 fade("in",500,pasteStatus,false);   
}


function diffAndPopulateCell(oldRows,newRows,dmethod,cellNumber)
{
    
oldRowsText = createTextSheetFromRows(oldRows, cellNumber) 

newRowsText = createTextSheetFromRows(newRows, cellNumber) 

switch(dmethod) {
    case "1" : diff = JsDiff.diffWords(oldRowsText, newRowsText); break;
    case "2" : diff = JsDiff.diffLines(oldRowsText, newRowsText); break;
    case "3" : diff = JsDiff.diffChars(oldRowsText, newRowsText); break;
    case "4" : diff = JsDiff.diffWordsWithSpace(oldRowsText, newRowsText); break;
    case "5" : diff = JsDiff.diffTrimmedLines(oldRowsText, newRowsText); break;
    case "6" : diff = JsDiff.diffSentences(oldRowsText, newRowsText); break;
    default: diff = JsDiff.diffWordsWithSpace(oldRowsText, newRowsText);}

textHolder = document.createElement("pre")
fragment = document.createDocumentFragment();

diff.forEach((part) => { const color = part.added ? "#26ff00" :   part.removed ? 'red' : '#808080';
    var class_name = part.added ? "goody" : part.removed ? 'bady' : 'neutry';
    var font_weight = part.added ? "bold" : part.removed ? "lighter" : "normal";
    span = document.createElement('span'); 
    span.style.color = color;
    span.className = class_name;
    span.style.fontWeight = font_weight;
    part.removed && (span.style.textDecoration = "line-through");
    part.removed && (span.style.opacity=0.9);
  span.appendChild(document.createTextNode(part.value));
  fragment.appendChild(span); 
});

textHolder.appendChild(fragment)
eval("c" + cellNumber + ".appendChild(textHolder)")
}



var table = document.querySelector("table")

var newTable = document.createElement("table")
var row = newTable.insertRow(0)
var c0 = row.insertCell(0)
var c1 = row.insertCell(1)
var c2 = row.insertCell(2)
newTable.style.width = "80%"; 
newTable.style.margin = "auto";
newTable.style.contenteditable =true;

var dMeth = prompt("Select comparison mode: 1. Words, 2. Lines, 3. Characters\\n4. Words-and-Whitespace, 5. Trimmed-Lines, 6. Sentences","1");


diffAndPopulateCell(oldRows,newRows,3,0)
var cues = [];
cues = c0.innerHTML.split("\\n\\r\\r\\r\\n\\r\\n")

diffAndPopulateCell(oldRows,newRows,dMeth,1)
var originals = [];
originals = c1.innerHTML.split("\\n\\r\\r\\r\\n\\r\\n")

diffAndPopulateCell(oldRows,newRows,dMeth,2)
var translations = [];
translations = c2.innerHTML.split("\\n\\r\\r\\r\\n\\r\\n")

if(originals.length > translations.length) {var lim=originals.length} else {var lim=translations.length};  var newHtml='<table><tbody>'; for(a=1; a<lim; a++){ newHtml += '<tr><td><pre>' + cues[a] + '</pre></td><td><pre>' + originals[a] + '</pre></td><td><pre>' + translations[a] +'</pre></td></tr>'; } newHtml += "</tbody></table>"

document.querySelector("table").outerHTML = newHtml
var visibility = "both";

document.onkeydown = function(event){
      if (event.altKey && event.keyCode == 90) {
        //Alt+Z, simultaneously.

      switch (visibility) {
      case "both":  for(ea of document.getElementsByClassName("bady")) { fade('out',100,ea,false) }; visibility = "only_goodies";
                    break;
      case "only_goodies": for(ea of document.getElementsByClassName("bady")) { fade('in',100,ea,false) }
                           for(ea of document.getElementsByClassName("goody")) { fade('out',100,ea,false) }
                           visibility = "only_mistakes"
                           break;
      case "only_mistakes":  for(ea of document.getElementsByClassName("goody")) { fade('in',100,ea,false) }
                           visibility = "both"
                            break;
      default: for(ea of document.getElementsByClassName("bady")) { fade('in',100,ea,false) }
                           for(ea of document.getElementsByClassName("goody")) { fade('in',100,ea,false) }
                            visibility = "both"}}}}}</script>
  <style>#navbar {
      background-color: #333;
      top: 0;
      position: fixed;
      width: 80%;
      left: 10%;
      transition: top 0.5s;
      margin-left: auto;
      margin-right: auto;
      opacity: 0.7;
  }

  #navbar a {
      float: left;
      display: block;
      color: white;
      text-align: center;
      padding: 5px;
      text-decoration: none;
  }

  #navbar a:hover {
      background-color: #ddd;
      color: black;
  }

  body {
      background: #212121;
      color: grey;
  }

  table {
      width: 80%;
      table-layout: fixed;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      margin-top: 60px;
          border-collapse: collapse;

  }

  thead,
  tbody,
  td,
  tr
   {
      display: block;
      font-family: monospace; 

  }

  tr {

  background-image: linear-gradient(to right, darkgrey 30%, rgba(255,255,255,0) 0%);
  background-position: bottom;
  background-size: 3px 1px;
  background-repeat: repeat-x;
  }

  tr:after {
      content: ' ';
      display: block;
      visibility: hidden;
      clear: both;
          border-bottom: 1px solid #ccc;

  }

    #titleinfo {
              color: #fffff0;
              font-weight: bolder;
              font-style: normal;
              font-family: Roboto;
              font-size: 150%;
              margin-left: 55px;
              margin-top: 8px;
              flex-shrink: 1;
              width: 800px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              }


  thead th {
      height: 30px;
      /*text-align: left;*/
  }


  thead {
      /* fallback */
  }

  tbody td,
  thead th {
      width: 33%;
      float: left;
  }

  tr:hover {
      color: darkgrey;
  }


      </style>
  <head><body>
           <div id="navbar">
                <a href="TITLELINK"><img id="logonetflix" width="auto" height="32" src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" title="Backup made on TITLEDATE"></a>
                <span id="titleinfo" title="TITLEINFO">TITLEINFO (TITLEDATE)</span>              <button type="button" id="the-button" class="btn btn-raised" style="background-color: darkgreen; color: white; opacity: 0.3; position: relative; top: -18px; left: 105px;" onclick="loadScript('https://katzurki.github.io/nettufurikusu/diff.js')">DIFF ENGINE OFF</button></div>
  <table>
      <thead>
      <tr>
          <th><b><u>In-cue/Out-cue</b></u></th>
          <th><b><u>Source</b></u></th>
          <th><b><u>Translation</b></u></th>
      </tr>
      </thead>
      <tbody>
      `
            var lsJson = localStorage["clq:origination:" + our_clq]
            if (!lsJson) {
                alert("Timed text events not found in localStorage\nfor CLQ: " +
                    our_clq + "\n" + "If the CLQ is correct and" + "\n" +
                    "\"Save to local storage\" is enabled in Settings," + "\n" +
                    "save the task and try again.");
                throw new Error
            }
            var json_obj = JSON.parse(lsJson)
            var src = json_obj["events"]
            var fps_ = json_obj["meta"]["fps"]
            var fps = fps_.split("_")[1] / 100
            //From {"fps":"FPS_2500"}
            var proposed_fps = prompt("Press Enter to accept framerate of " + fps +
                " or enter new as 2400 or 2997:");
            if (proposed_fps !== "") {
                var int_fps = proposed_fps.substring(0, 2);
                var decimal_fps = proposed_fps.substring(2, proposed_fps.length);
                fps_ = "FPS" + "_" + int_fps + decimal_fps
                fps = (int_fps + "." + decimal_fps) * 1;
            }
            var mid = json_obj["meta"]["movieId"]
            var pid = json_obj["meta"]["packageId"]
            var which_url = prompt(
                "Press Enter to try the template. Enter anything to go for CC.")
            var which_lang = prompt(
                "DOUBLE EXPORT SRT reports…\n\nPress Enter to go for English. Enter a language code to try that (es/fr/ru/etc).",
                "en");
            if (which_lang == "") {
                which_lang = "en"
            }
            if (which_url == "") {
                var template_url =
                    "https://originator.backlot.netflix.com/api/request/timedText/" +
                    our_clq + '/' + pid + '/' + mid + '/' + which_lang + '/TEMPLATE/PRIMARY/' +
                    fps_ + '?source=ORIGINATOR'
            } else {
                var template_url =
                    "https://originator.backlot.netflix.com/api/request/timedText/" +
                    our_clq + '/' + pid + '/' + mid + '/' + which_lang + '/CC/PRIMARY/' + fps_ +
                    '?source=ARCHIVE'
            }
            var targetFilename = srtName(fps_ + "_TRANSLATION")
            var sourceFilename = srtName(fps_ + "_SOURCE")
            var backupFilename = srtName(fps_ + "_BILINGUAL_TABLE")
                .replace(".srt",
                    ".html")
            var frms = 1000 / fps
            async function getSourceColumnEvents() {
                var result = await (await fetch(template_url))
                    .json();
                return result;
            }
            async function delayedDownload() {
                var result = await getSourceColumnEvents();
                //download(sourceFilename, array2srt(result))
                download(backupFilename, arrays2html(result, src), "html")
            }
            delayedDownload()
            //download(targetFilename,array2srt(src))
            function srtName(suffix = "") {
                var s = document.getElementsByClassName("cpe-page-menu-label")[0]
                    .innerText
                var srtName = (s.replace(/[ ]/g, '_')
                        .replace(/[^a-z0-9_]/gi, '') +
                        suffix + ".srt"
                    ) //This gets rid of all punctuation, spaces and non-English letters
                    .trim() //resulting in a name like 14545_El_Burrito_A_Breaking_Fat_Movie_FPS_2500.srt
                if (!srtName) srtName = our_clq + "_" + suffix +
                    ".srt" //Fallback measure. Useful for debugging later
                return srtName
            }

            function frames2timecode(frames) { //frames to 00:01:02,000 format
                var milliseconds = Math.round(frames * frms)
                var srt_timecode = TimeConversion(milliseconds)
                return srt_timecode
            }

            function merge_same(array) {
                var merged = []
                var skip_next = false
                for (i = 0; i < array.length - 1; i++) {
                    if (!skip_next) {
                        thisEvent = array[i]
                        nextEvent = array[i + 1]
                        if (thisEvent[5] == nextEvent[5]) {
                            skip_next = true
                            thisEvent[2] = thisEvent[2] + "\n" + nextEvent[2]
                            thisEvent[1] = nextEvent[1]
                        }
                        merged.push(thisEvent)
                    } else {
                        skip_next = false
                    }
                }
                return merged
            }

            function arrays2html(events_object, events_object2) {
                var ordered_events = []
                var col = "SRC"
                for (var id in events_object) {
                    events_object[id]["column"] = col
                    try {
                        var type_fn = events_object[id]["type"]
                        if (type_fn === "fn") {
                            events_object[id]["txt"] += "<b></b>";
                            type_fn = undefined;
                        }
                    } catch (e) {}
                    ordered_events.push([
                        events_object[id]["start"], events_object[id]["end"],
                        events_object[id]
                        ["txt"],
                        events_object[id]
                        ["styles"],
                        events_object[id]
                        ["rgn"],
                        events_object[id]
                        ["column"],
                    ])
                }
                var col = "TRG"
                for (var id in events_object2) {
                    events_object2[id]["column"] = col
                    ordered_events.push([
                        events_object2[id]["start"], events_object2[id]["end"],
                        events_object2[id]
                        ["txt"],
                        events_object2[id]
                        ["styles"],
                        events_object2[id]
                        ["rgn"],
                        events_object2[id]
                        ["column"],
                    ])
                }
                ordered_events.sort(function(a, b) {
                    return a[0] - b[0];
                }); //Array sorted by in_cues, sequentially
                ordered_events = merge_same(ordered_events)
                //    ordered_events.sort(function (a
                //        , b) {
                //        return a[1] - b[1];
                //    }); //Array sorted by out_cues this time, because merge_same changes some, sequentially
                var index = 0
                var srt_txt = bilingualHtml;
                var eol = ""
                var source_content = ''
                for (event of ordered_events) {
                    var start = frames2timecode(event[0])
                    var end = frames2timecode(event[1])
                    var startend = start + "\n" + end
                    try {
                        if (typeof event[3][0]["type"] !== "undefined") {
                            if (event[3][0]["type"] == "italic") {
                                content = italicize(content, event[3])
                            }
                        }
                    } catch (e) {}
                    if (event[5] == "SRC") {
                        source_content += event[2]
                    } else {
                        tr = '<tr><td><pre>' + startend + '</pre></td><td><pre>' +
                            source_content + '</pre></td><td><pre>' + event[2] +
                            '</pre></td></tr>' + "\n";
                        srt_txt += tr;
                        tr = "";
                        source_content = ""
                    }
                }
                var titleinfo = document.getElementsByClassName(
                        "cpe-page-menu-label")[0].innerText.replace(/ "/, " “")
                    .replace(/"/, "”")
                var titlelink = document.location.href
                var titledate = new Date()
                    .toISOString()
                    .slice(0, 10)
                srt_txt = srt_txt.replace(/TITLEINFO/g, titleinfo)
                    .replace(
                        /TITLELINK/, titlelink)
                    .replace(/TITLEDATE/g, titledate)
                return srt_txt
            }

            function array2srt(events_object) {
                var ordered_events = []
                for (var id in events_object) {
                    try {
                        var type_fn = events_object[id]["type"]
                        if (type_fn === "fn") {
                            events_object[id]["txt"] += "<b></b>";
                            type_fn = undefined;
                        }
                    } catch (e) {}
                    ordered_events.push([
                        events_object[id]["start"], events_object[id]["end"],
                        events_object[id]
                        ["txt"],
                        events_object[id]
                        ["styles"],
                        events_object[id]
                        ["rgn"]
                    ])
                }
                ordered_events.sort(function(a, b) {
                    return a[0] - b[0];
                }); //Array sorted by in_cues, sequentially
                var index = 0
                var srt_txt = ''
                for (event of ordered_events) {
                    index++
                    var start = frames2timecode(event[0])
                    var end = frames2timecode(event[1])
                    var content = event[2]
                    try {
                        if (typeof event[3][0]["type"] !== "undefined") {
                            if (event[3][0]["type"] == "italic") {
                                content = italicize(content, event[3])
                            }
                        }
                    } catch (e) {}
                    try {
                        if (typeof event[4] !== "undefined") {
                            if (event[4] == "top") {
                                content = "{\\an8}" + content
                            }
                        }
                    } catch (e) {}
                    try {
                        if (event["type"] == "fn") {
                            content += '<b></b>'
                        }
                    } catch (e) {}
                    console.log(content)
                    var current_event = index + "\n" + start + " --> " + end + "\n" +
                        content + "\n"
                    srt_txt += current_event + "\n"
                }
                return srt_txt
            }

            function italicize(content, italics_array) {
                position_offset = 0
                for (var italic of italics_array) {
                    var position_from = italic["from"] + position_offset;
                    position_offset += 3
                    content = [content.slice(0, position_from), "<i>", content.slice(
                        position_from)].join('')
                    var position_to = italic["to"] + position_offset;
                    position_offset += 4
                    content = [content.slice(0, position_to), "</i>", content.slice(
                        position_to)].join('')
                }
                return content
            }

            function download(filename, text, type = "plain") {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/' + type +
                    ';charset=utf-8,%EF%BB%BF' + encodeURIComponent(text));
                element.setAttribute('download', filename);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }

            function TimeConversion(duration) {
                let time = parseDuration(duration)
                return formatTimeHMSS(time)
            }

            function parseDuration(duration) {
                let remain = duration
                let hours = Math.floor(remain / (1000 * 60 * 60))
                remain = remain % (1000 * 60 * 60)
                let minutes = Math.floor(remain / (1000 * 60))
                remain = remain % (1000 * 60)
                let seconds = Math.floor(remain / (1000))
                remain = remain % (1000)
                let milliseconds = remain
                return {
                    hours,
                    minutes,
                    seconds,
                    milliseconds
                }
            }

            function formatTimeHMSS(o) {
                let hours = o.hours.toString()
                if (hours.length === 1) hours = '0' + hours
                let minutes = o.minutes.toString()
                if (minutes.length === 1) minutes = '0' + minutes
                let seconds = o.seconds.toString()
                if (seconds.length === 1) seconds = '0' + seconds
                let milliseconds = o.milliseconds.toString()
                if (milliseconds.length === 1) milliseconds = '00' + milliseconds
                if (milliseconds.length === 2) milliseconds = '0' + milliseconds
                return hours + ":" + minutes + ":" +
                    //Example: 00:01:02,999 -- note that the SRT spec calls for a comma, not a period!
                    seconds + "," + milliseconds
            }
        })();
    }

    function imarunettuImportBetterSrt() {
        (function() {
            document.querySelectorAll(
                    "#appView > div > div.cpe-page-menu > div > div.actions > button:nth-child(2)")[0]
                .click();
            var fps_ = document.querySelectorAll(".info-body")[0].children[9].innerText.replace(
                    /[^_0-9]{5}/g, '')
                .trim()
            document.querySelectorAll("#appView > div > div.InfoPopup > dialog > div.info-body")[0]
                .nextSibling.lastElementChild.click()
            window.open('https://katzurki.github.io/nettufurikusu/ImportBetterSRT.html#' + fps_)
        })()
    }

    function imarunettuAuxFade(type, ms, el, remove = false) {
        var isIn = type === 'in',
            opacity = isIn ? 0 : 1,
            interval = 50,
            duration = ms,
            gap = interval / duration
        if (isIn) {
            el.style.display = 'inline'
            el.style.opacity = opacity
        }

        function func() {
            opacity = isIn ? opacity + gap : opacity - gap
            el.style.opacity = opacity
            if (opacity <= 0) {
                remove ? el.remove() : el.style.display = 'none'
            }
            if (opacity <= 0 || opacity >= 1) window.clearInterval(fading)
        }
        var fading = window.setInterval(func, interval)
    }

    function imarunettuCleanup() {
        var menu = document.querySelector("div.popup")
        var itemButtons = document.getElementsByClassName("item-button")
        var dropdown = itemButtons[itemButtons.length -
            1] //this should always yield the More Actions dropdown trigger
        //if(!menu) {dropdown.click();} 
        for (byeButton of document.getElementsByClassName("mnfkbtn")) {
            imarunettuAuxFade('out', 100, byeButton, true)
        }
        dropdown.removeEventListener("click", imarunettuClickDropdown, {
            passive: false,
            capture: true
        })
    }

    function imarunettuAddButtonsToMenu(btnid, disabled = "") {
        var gonnaBeLast = false
        if (typeof btnid == 'undefined') {
            gonnaBeLast = true
            for (btnid in imarunettuButtons) {
                imarunettuAddButtonsToMenu(btnid)
            }
        }
        if (!gonnaBeLast && !document.getElementById(btnid)) {
            var btntext = imarunettuButtons[btnid]
            var menu = document.querySelector("div.popup")
            var button = document.createElement("button");
            button.className = "icon-button mnfkbtn" + disabled
            button.id = btnid
            button.setAttribute("title", btntext)
            button.innerHTML = ''
            var span = document.createElement("span")
            span.className = "label"
            var taskBeenSaved = document.getElementsByClassName("bh-check_circle")[0] ? true : false;
            if (btnid == "imarunettuRunAutoQC") {
                btntext = btntext + " for " + window.imarunettuLang
            }
            if (btnid == "imarunettuRunAutoQC" || btnid == "imarunettuDoubleExportSRT" || btnid ==
                "imarunettuBilingualExportHTML") {
                if (!taskBeenSaved) {
                    button.classList.add("disabled");
                    button.setAttribute("disabled", "");
                } else {
                    button.classList.remove("disabled");
                    button.removeAttribute("disabled");
                }
            }
            span.innerText = btntext
            button.onclick = function(event) {
                switch(btnid){
                    case "imarunettuCleanup":
                    event.stopImmediatePropagation();
                    imarunettuCleanup();
                        break;
                    case "imarunettuBilingualExportHTML":
                        imarunettuBilingualExportHTML();
                        break;
                    case "imarunettuExportMP4": 
                        imarunettuExportMP4();
                        break;
                    case "imarunettuDoubleExportSRT":
                        imarunettuDoubleExportSRT();
                        break;
                    case "imarunettuKNP2CSV":
                        imarunettuKNP2CSV();
                        break;
                    case "imarunettuExportSettings":
                        imarunettuExportSettings();
                        break;
                    case "imarunettuImportBetterSrt":
                        imarunettuImportBetterSrt();
                        break;
                    case "imarunettuRemoveClutter":
                        imarunettuRemoveClutter(); 
                        break;
                    case "imarunettuRunAutoQC":
                        imarunettuRunAutoQC();
                        break;
                    default:;
                }
                }
            button.append(span)
            menu.append(button)
        }
    }

    function imarunettuGetLang() {
        if (!window.imarunettuLang) {
            var taskTitle = document.getElementsByClassName("cpe-page-menu-label")[0]
                .innerText
            taskTitle = taskTitle.split(",")
            var lang = taskTitle[taskTitle.length - 2].trim()
                .toUpperCase()
            window.imarunettuLang = lang
        }
        return window.imarunettuLang
    }
} else { alert("The imaru•nettu script works in Originator or Lucid only.") }

function imarunettuKNP2CSV() {
    (function() {
        var host = window.location.hostname
        var clq = decodeURIComponent(window.location.href)
            .split(":")[3]
        var clq_pattern = new RegExp(
            '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
            'i'); //CLQ is a guid v4
        var lang_prompt =
            "Enter a 2-char language code, like ru or fr:\n(exception: zh-CN, zh-TW, pt-BR, pt-PT)"
        var getAllLanguages = false
        var oKnp = {}
        var majorEntities = ["PERSON", "LOCATION", "ORGANIZATION",
            "PHRASE"
        ] //types of KNP entries, at least one is always present
        var finalCsvArray = []
        var currentCsvRow = []
        var universalBOM = "\uFEFF";;

        if (!clq || !clq_pattern.test(clq)) {
            throw new Error(alert("Something went wrong. CLQ for debug: " + clq))
        }
        if (host == "originator.backlot.netflix.com") { //We can run both from Lucid and from Backlot
            var knpJsonLink =
                "https://originator.backlot.netflix.com/api/knp/clq:origination:" + clq
            var taskTitle = document.getElementsByClassName("cpe-page-menu-label")[0]
                .innerText
            var LANG = taskTitle.split(",")
            LANG = LANG[LANG.length - 2].trim()
        } else if (host == "localization-lucid.netflix.com") {
            var movieid = window.location.pathname.split("/")[3]
            var knpJsonLink =
                "https://localization-lucid.netflix.com/REST/v1/knp/getknp?appName=originator&movieid=" +
                movieid + "&requestReference=clq:origination:" + clq
            var taskTitle = document.querySelector("div.movie-title")
                .innerText.replace("Movie: ", "")
            var LANG = prompt(
                lang_prompt, "zh-CN"
            ) //but in Lucid, we can't guess what target language the user wants
        } else {
            throw new Error(alert(
                "You must be either in a started task,\nor in KNP Lucid for this task."
            ))
        }

        if (LANG == "zh-Hans") LANG = "zh-CN" //special case
        if (LANG == "en") {
            do {
                LANG = prompt("Target language cannot be \"en\".\n" + lang_prompt);
            } while (LANG == "en")
        }
        if (LANG == "") {
            throw new Error(alert("You must enter a language code."))}

        var getJSON = async url => {
            try {
                const response = await fetch(url, {
                    credentials: "same-origin"
                }); //cookie for authorization = no cross-site fetching!
                if (!response.ok)
                    throw new Error(alert(response.statusText));
                const data = await response.json();
                return data;
            } catch (error) {
                return error;
            }
        }

        function nameCsv(suffix = "") {
            if (suffix.length > 0) suffix = "_" + suffix
            var s = taskTitle
            var csvName = "KNP_" + (s.replace(/[ ]/g, '_')
                    .replace(
                        /[^a-z0-9_]/gi, '') + "_" + suffix + ".csv")
                .replace(/__/gi, "_")
                .trim()
            if (!csvName) csvName = "KNP_" + clq + "_" + suffix + ".csv"
            return csvName
        } //resulting in a name like KNP_18383223_El_Burrito_A_Breaking_Fat_Movie_ru.csv
        function getMovieIDFromOriginator() { //in Originator, movieId can be obtained from the info page, but it isn't loaded until clicked
            document.querySelectorAll(
                "#appView > div > div.cpe-page-menu > div > div.actions > button:nth-child(2)"
            )[0].click();
            movieid = document.querySelectorAll(".info-body")[0].children[2].innerText
                .replace(/[^0-9]/g, '')
                .trim()
            document.querySelectorAll(
                    "#appView > div > div.InfoPopup > dialog > div.info-body")[0].nextSibling
                .lastElementChild.click() //don't forget to close the popup!
            return movieid
        }
        var csvName = nameCsv(LANG.toUpperCase())

        function denull(value) {
            if (!value) {
                return ""
            } else {
                return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            }
        } //horrible hack since Netflix's internal logging was driving me bonkers
        function arrayToCsv(data) {
            return data.map(row => row
                    .map(String) //all to string
                    .map(v => v.replaceAll('"', '""')) //escape present double quotes
                    .map(v => `"${v}"`) //enclose the cell in double quotes
                    .map(v => v.replaceAll('"null"',
                        '""')) //catchall measure if we somehow do end up with a "null"
                    .join(',') //maybe tabs...
                )
                .join('\r\n');
        }
        getJSON(knpJsonLink)
            .then(data => {
                oKnp = data
                if (typeof oKnp.error !== "undefined") {
                    alert(oKnp.error.message +
                        "\nTry exporting from the Lucid KNP page.\nIf the KNP opens but doesn't export, report me to the developer."
                    );
                    var movieid = getMovieIDFromOriginator()
                    window.location.href =
                        "https://localization-lucid.netflix.com/knp/view/" + movieid +
                        "?appName=originator&requestReference=clq:origination:" + clq
                }
                if (oKnp.srcLocale == "en") {
                    var header = ["TYPE", "TEMPLATE (EN)", "NOTE", "TARGET (" + LANG
                        .toUpperCase() + ")", "NOTE (" + LANG.toUpperCase() + ")"
                    ]
                    finalCsvArray.push(header)
                    for (const Entity of majorEntities) {
                        if (typeof oKnp.mapKnpTermDTOs[Entity] !== "undefined") {
                            oKnp.mapKnpTermDTOs[Entity].forEach((v) => {
                                try {
                                    currentCsvRow.push(v.type, denull(v.srcValue.value),
                                        denull(
                                            v.srcValue.note), denull(v.localizedValues[
                                                LANG]
                                            .value), denull(v.localizedValues[LANG].note))
                                    finalCsvArray.push(currentCsvRow);
                                    currentCsvRow = [];
                                } catch (e) {
                                    console.log(e)
                                }
                            })
                        }
                    }
                    oKnp.titleDTOs.forEach((t) => {
                        try {
                            currentCsvRow.push(t.type, t.srcValue.value, t.srcValue.note, t
                                .localizedValues[LANG].value, t.localizedValues[LANG].note
                            )
                            finalCsvArray.push(currentCsvRow);
                            currentCsvRow = [];
                        } catch (e) {}
                    })
                } else {
                    var LANG_SRC = oKnp.srcLocale
                    var header = ["TYPE", "SOURCE (" + LANG_SRC.toUpperCase() + ")",
                        "TEMPLATE (EN)", "NOTE (EN)", "TARGET (" + LANG.toUpperCase() +
                        ")", "NOTE (" + LANG.toUpperCase() + ")"
                    ]
                    finalCsvArray.push(header)
                    for (const Entity of majorEntities) {
                        if (typeof oKnp.mapKnpTermDTOs[Entity] !== "undefined") {
                            oKnp.mapKnpTermDTOs[Entity].forEach((v) => {
                                try {
                                    currentCsvRow.push(v.type, denull(v.srcValue.value),
                                        denull(
                                            v.localizedValues["en"].value), denull(v
                                            .localizedValues["en"].note), denull(v
                                            .localizedValues[LANG].value), denull(v
                                            .localizedValues[LANG].note))
                                    finalCsvArray.push(currentCsvRow);
                                    currentCsvRow = [];
                                } catch (e) {}
                            })
                        }
                    }
                    for (g = 0; g < oKnp.titleDTOs.length - 1; g++) {
                        try {
                            currentCsvRow.push(oKnp.titleDTOs[g].type, denull(oKnp.titleDTOs[g]
                                    .srcValue.value), denull(oKnp.titleDTOs[g].localizedValues[
                                    "en"].value), denull(oKnp.titleDTOs[g].localizedValues["en"]
                                    .note), denull(oKnp.titleDTOs[g].localizedValues[LANG].value),
                                denull(oKnp.titleDTOs[g].localizedValues[LANG].note))
                            finalCsvArray.push(currentCsvRow);
                            currentCsvRow = [];
                        } catch (e) {}
                    }
                }
                let csv = arrayToCsv(finalCsvArray)
                var a = window.document.createElement('a');
                a.setAttribute('href', 'data:text/csv; charset=utf-8,' +
                    encodeURIComponent(universalBOM + csv));
                a.setAttribute('download', csvName);
                window.document.body.appendChild(a);
                a.click();
                a.remove();
                console.log("File " + csvName + " with " + finalCsvArray.length +
                    " rows successfully downloaded!\nThis page must be reloaded to avoid namespace conflicts."
                );
            })
            .catch(error => {
                console.error(error);
            });
    })()
}
