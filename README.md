
# UCSD Calendar Extractor

<img src="https://github.com/trevorkw7/UCSD-Calendar-Extractor/blob/master/src/images/128x128.png?raw=true" align="right"
     alt="Logo" width="120" height="120">

UCSD Calendar Extractor is a JS based Chrome extension that helps students extract their schedules from
WebReg and import them to their personal calendars (Google Calendar, Outlook, etc.) by web scraping 
their schedule and encoding the data into an ICS file format.

## Installation

### Chrome Web Store

I'm planning to publish this extension to the webstore in the upcoming weeks.
This section will be updated with the link to the webstore listing for 1-click installation.

<details><summary><b>Sideload Instructions</b></summary>

1. Go to the extensions page of Google Chrome (or other Chromium based browser):
```chrome://extensions/```

2. Ensure the developer mode toggle is on.


3. Clone / Download this repository: `git clone https://github.com/trevorkw7/UCSD-Calendar-Extractor.git`

4. Click the `load unpacked` button in the extensions page of Google Chrome.

5. Select the `src` folder of the cloned repo.

6. The extension should now show up in the extensions page. Ensure the toggle to turn on the extension is enabled.

</details>

## Usage
<p align="center">
<img src="https://raw.githubusercontent.com/trevorkw7/UCSD-Calendar-Extractor/master/src/images/extension-screenshot.png" align="right"
     alt="Logo" width="140" height="174">
</p>
1. Head to https://act.ucsd.edu/webreg2 and login with your UCSD account. <br/>
2. Select the quarter you want to extract your class schedule from.<br/>
3. You should now see a list of your classes in the list view on this page. Click the Extract Calendar.ics button on the extension.<br/>
4. Select where you want to download the Calendar.ics file to. <br/>
5. Congrats! You now have an ics file that can be imported to pretty much any calendar application or website containing your entire class schedule from WebReg. Go Tritons!



## How It Works

1. Clicking the Extract Calendar.ics button while on the List view of the 
   WebReg portal prompts a web scraping script 
   to extract the class name, professor, location, and days of the week / time
   from each event.
2. Dates are parsed from each event and type codes are converted to 
   full text names using a dictionary. Extracted days of the week
   codes are converted to the format appropriate for ICS.
3. An ICS file is created with each event. If the event is reoccurring,
   ICS rules are set for the days they reoccur based on the extracted 
   days of the week the event occurs. These events are set to reoccur until
   the end of the quarter which is determined based on the date of the
   last final the student has.
4. The ICS string is encoded into a Blob object and a URL is generated 
   for the Calendar.ics file to be downloaded from.


