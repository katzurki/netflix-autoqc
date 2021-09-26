# Originator AutoQC, Etc. 
### Chrome extension for Netflix Originator. Current version: 0.0.1

![Adds features to More Actions](https://lh3.googleusercontent.com/GNwhXfqNOuDq9n8CKescghQqeBmb1yGwRaOA_t4VjOxkO1NiyYN8pQAwuGmk-hdERiAlpOBRww8DgsxhDQAEPZtgkQ=w640-h400-e365-rj-sc0x00ffffff)
 
This is the source code for the [Originator AutoQC extension](https://chrome.google.com/webstore/detail/originator-autoqc-etc/fmdlmdfceiaaljfpdkbpfhoppcklkopo "Originator AutoQC for Netflix") published in Chrome Web Store. In most cases, this is the preferred way to install and use it. If you want to install it from here, you need to clone the repo, go to chrome://extensions, enable Developer mode, click Load Unpacked and point it to the folder you cloned the repository to. This is useful if you want to add features of your own and/or customize/review code to suit your needs.

For a description of features, please see the Chrome Web Store page or the video tutorial available from the Originator.

For support, bug reports, feedback or collaborative work please contact me at katzurki@gmail.com

TODO (priority):
* AutoFix that implements confident AutoQC findings
* AutoQC Timings-Only mode, most useful if you need to snap/extend a bad SRT or CC source to shot changes
* write proper documentation and tutorials
* TTML support to export/import subtitles to properly store attributes like FN tags or annotations.
* run Vendor's Pre-Submission Checklist automatically, instead of copying/pasting each regex (what flavor regexes are they anyway?)
* turns out many 3rd-party SRTs can come with 3 or even 4 lines, which breaks Import SRT--fix ASAP

TODO (someday):
* migrate to manifest v3
* package diff.js, Save Shortcuts, ImportBetterSRT in the extension--right now they're standalone pages, which should not be a permanent solution
* make a much better icon! Literally anything would be an improvement
* for user input, migrate from prompt() and alert() to something more 21st century
* figure out FN tagging when importing from 3rd-party SRT files--linguist input needed here. How can you tell if an event should definitely be an FN?
* add RTL support to AutoQC for Hebrew, Arabic (at least)
* figure out a way to unload extension code without refreshing the page
* optionally export KNP directly to Google Spreadsheets or figure out how to generate xlsx with js
* figure out if it's possible to highlight differences between Target and Source columns directly in Originator (currently only possible in Bilingual Table)
* reminds me to add an option to save the resulting highlighted file, because right now it's not persistent
