function parseCalendar() {
  // stores the calendar data in objects
  const calendar = [];

  // stores the string to be written to the ics file
  var icsFile = null;

  // used to convert type codes to names
  const eventTypeCode = {
    LE: "Lecture",
    DI: "Discussion",
    LA: "Lab",
    SE: "Seminar",
    MI: "Midterm",
    FI: "Final",
  };

  function addToCalendar(
    classType,
    classDayCode,
    classTime,
    classBuilding,
    classRoomCode,
    specificDate,
    startDate,
    endDate
  ) {
    // create object to store extracted data
    var extractedListing = {
      classTitle: className + ": " + classType,
      classType: classType,
      classDayCode: classDayCode,
      classTime: classTime,
      classBuilding: classBuilding,
      classRoomCode: classRoomCode,
      specificDate: specificDate,
      startDate: startDate,
      endDate: endDate,
    };
    // push extracted data to array
    calendar.push(extractedListing);
  }

  // Creates a JS date object from a day code in the dayCodes format
  // for the specified day in the current week
  function getDateObjectFromCode(classDayCode) {
    //console.log("Class day code" + classDayCode);
    const dayCodes = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
    // index for day of week based on day code
    const dayCodeIndex = dayCodes.indexOf(classDayCode);
    // get current date
    var today = new Date();
    // get the first day of this week
    var firstDayOfWeekDate = today.getDate() - today.getDay();
    // create final date object by adding day code index to first day of week
    var dateObject = new Date(today.setDate(firstDayOfWeekDate + dayCodeIndex));

    return dateObject;
  }

  // takes in a date object and returns a string in the format for ICS files
  function convertDate(date) {
    var event = date.toISOString();
    event = event.split("-").join("").split(":").join("").split(".")[0] + "Z";
    console.log("Converted date: " + event);
    return event;
  }

  const table = document.getElementsByClassName("ui-jqgrid-btable")[0];
  const rows = table.getElementsByClassName(
    "ui-widget-content jqgrow ui-row-ltr wr-grid-en"
  );

  // saved values for listings that ommit class name
  var lastClass = "";
  for (var i = 0; i < rows.length; i++) {
    var listing = rows[i];
    console.log(listing);
    // extract listing data into variables
    var className = listing
      .querySelectorAll('[aria-describedby="list-id-table_colsubj"]')[0]
      .textContent.trim();
    //var classEvent = listing.querySelectorAll('[aria-describedby="list-id-table_CRSE_TITLE"]')[0].textContent.trim();
    var classType = listing
      .querySelectorAll(
        '[aria-describedby="list-id-table_FK_CDI_INSTR_TYPE"]'
      )[0]
      .textContent.trim();
    var classDayCode = listing
      .querySelectorAll('[aria-describedby="list-id-table_DAY_CODE"]')[0]
      .textContent.trim();
    var classTime = listing
      .querySelectorAll('[aria-describedby="list-id-table_coltime"]')[0]
      .textContent.trim();
    var classBuilding = listing
      .querySelectorAll('[aria-describedby="list-id-table_BLDG_CODE"]')[0]
      .textContent.trim();
    var classRoomCode = listing
      .querySelectorAll('[aria-describedby="list-id-table_ROOM_CODE"]')[0]
      .textContent.trim();
    var startDate = new Date();
    var endDate = new Date();

    // convert classType to full name based on eventTypeCode dictionary
    classType = eventTypeCode[classType];

    // test if class name is empty, if so use last class name
    var regExp = /[a-zA-Z]/g;
    if (regExp.test(className)) {
      lastClass = className;
    } else {
      className = lastClass;
    }

    // replace extra spaces in class name
    className = className.replace(/\s+/g, " ");

    // parse classTime into start and end times
    var classTimeArray = classTime.split("-");
    var startTime = classTimeArray[0].trim();
    var endTime = classTimeArray[1].trim();

    // parse startTime into hours and minutes
    var startTimeArray = startTime.split(":");
    var startHour = parseInt(startTimeArray[0].trim());
    var startMinute = parseInt(startTimeArray[1].trim());
    // add 12 hours if startTime is PM and not 12:00
    if (startTime.includes("p") && startHour != 12) {
      startHour += 12;
    }

    // parse endTime into hours and minutes
    var endTimeArray = endTime.split(":");
    var endHour = parseInt(endTimeArray[0].trim());
    var endMinute = parseInt(endTimeArray[1].trim());
    // add 12 hours if endTime is PM and not 12:00
    if (endTime.includes("p") && endHour != 12) {
      endHour += 12;
    }

    // check if day code includes specific date
    var specificDate = false;
    if (/\d/.test(classDayCode)) {
      specificDate = true;
      ddMMYYYYRegex = new RegExp(/\d{2}\/\d{2}\/\d{4}/g);
      // extracts DD/MM/YYYY from day code with specific date
      var extractedDate = classDayCode.match(ddMMYYYYRegex)[0];
      // create js date objects from extracted date
      startDate = new Date(extractedDate);
      endDate = new Date(extractedDate);

      // set hours and minuites for start and end date
      startDate.setHours(startHour);
      startDate.setMinutes(startMinute);
      endDate.setHours(endHour);
      endDate.setMinutes(endMinute);

      // add current listing to calendar
      addToCalendar(
        classType,
        classDayCode,
        classTime,
        classBuilding,
        classRoomCode,
        specificDate,
        startDate,
        endDate
      );
    } else {
      specificDate = false;

      // account for listings with multiple day codes (e.g. MWF) by creating an array
      // for each day code
      classDayCode = classDayCode.replace(/([A-Z])/g, " $1").trim();
      // console.log("class day code" + classDayCode);
      var classDayCodeArray = classDayCode.split(" ");
      // console.log("class day code array" + classDayCodeArray);

      // create js date objects from each day code in classDayCodeArray
      for (var j = 0; j < classDayCodeArray.length; j++) {
        // get date object from day code for the current week
        startDate = getDateObjectFromCode(classDayCodeArray[j]);
        endDate = getDateObjectFromCode(classDayCodeArray[j]);

        // set hours and minuites for start and end date
        console.log("start hour" + startHour);
        console.log("start minute" + startMinute);
        console.log("end hour" + endHour);
        console.log("end minute" + endMinute);
        startDate.setHours(startHour);
        startDate.setMinutes(startMinute);
        endDate.setHours(endHour);
        endDate.setMinutes(endMinute);

        // add current listing to calendar
        addToCalendar(
          classType,
          classDayCodeArray[i],
          classTime,
          classBuilding,
          classRoomCode,
          specificDate,
          startDate,
          endDate
        );
      }
    }
  }
  console.log(calendar);

  // create ics file from calendar
  // init icsString with file header
  var icsString =
    "BEGIN:VCALENDAR\n" + 
    "PRODID:-//Google Inc//Google Calendar 70.9054//EN\n" +
    "VERSION:2.0\n" +  
    "CALSCALE:GREGORIAN\n" + 
    "METHOD:PUBLISH\n" +
    "X-WR-CALNAME:UCSD\n" +
    "X-WR-TIMEZONE:UTC\n";

  for (var i = 0; i < calendar.length; i++) {
    calendarEvent = calendar[i];
    icsString +=
      "BEGIN:VEVENT\n" +
      "UID:" + calendarEvent.classTitle + "\n" +
      "DTSTART:" +
      convertDate(calendarEvent.startDate) +
      "\n" +
      "DTEND:" +
      convertDate(calendarEvent.endDate) +
      "\n" +
      "SUMMARY:" +
      calendarEvent.classTitle +
      "\n" +
      "DESCRIPTION:" +
      "Located in " +
      calendarEvent.classBuilding +
      ", Room " +
      calendarEvent.classRoomCode +
      "\n" +
      "END:VEVENT\n";
  }

  // add icsString ending
  icsString += "END:VCALENDAR";

  var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
      (blob = new Blob([data], { type: "text/plain" })),
        (url = window.URL.createObjectURL(blob));
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    };
  })();

  saveData(icsString, "calendar.ics");
  // // create link to ics file
  // let doc = URL.createObjectURL( new Blob ([icsString], {type: "text/plain"}) );
  // chrome.downloads.download({ url: doc, filename: filename, conflictAction: 'overwrite', saveAs: true });
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: parseCalendar,
  });
});
