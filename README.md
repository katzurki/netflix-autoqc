This is the extension package for Chrome webstore. You can load it as an unpacked package in Developer mode (for example, if you want to customize the code), but for most users it's better to install the extension from its official [Chrome Web Store](https://chrome.google.com/webstore/detail/originator-autoqc-etc/fmdlmdfceiaaljfpdkbpfhoppcklkopo "Originator AutoQC for Netflix") page.

For support, bug reports or feedback please contact me at katzurki@gmail.com 

These are the issues/ideas I'm currently working on. Thanks everybody who provided their feedback and shared ideas. Let me know if I forgot anything.

TODO in no particular order:
* migrate to manifest v3
* include diff.js, Save Shortcuts, ImportBetterSRT in the extension
* make much better icons
* migrate from prompt() and alert() to something more 21st century
* figure out FN tagging when importing from 3rd-party SRT files 
* add RTL support to AutoQC for Hebrew, Arabic (at least)
* figure out a way to unload extension code without refreshing the page
* optionally export KNP directly to Google Spreadsheets
* figure out if it's possible to highlight differences between Target and Source columns directly in Originator (currently only possible in Bilingual Table)

TODO (important):
* finish the option to AutoFix found issues
* add a "timings-only" mode to AutoQC to snap to shot changes
* document everything and record tutorials (preliminary attempt here: https://www.youtube.com/watch?v=qTKuCNZfUII)
* add TTML support to export/import subtitles to properly store attributes like FN tags or annotations
* run Vendor's Pre-Submission Checklist automatically, instead of copying/pasting each regex (what flavor regexes are they anyway?)
* turns out many 3rd-party SRTs can come with 3 or even 4 lines, which breaks Import SRT--fix ASAP
