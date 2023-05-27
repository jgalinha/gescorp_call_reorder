function sortTableByDate(order) {
  function convertToDate(dateTimeString) {
    var parts = dateTimeString.split(" ");
    var dateParts = parts[0].split("-");
    var timeParts = parts[1].split(":");
    var year = parseInt(dateParts[2], 10);
    var month = parseInt(dateParts[1], 10) - 1; // Months are zero-based
    var day = parseInt(dateParts[0], 10);
    var hour = parseInt(timeParts[0], 10);
    var minute = parseInt(timeParts[1], 10);

    return new Date(year, month, day, hour, minute);
  }
  var iframe = document.getElementById("listarPBXWindow_iframe");
  const iframeDoc = iframe.contentWindow.document;
  var table = iframeDoc.getElementById("myTable");
  var rows = Array.from(table.getElementsByTagName("tr"));

  // Remove the table header row from the sorting
  rows.shift();

  rows.sort(function (a, b) {
    var dateA = convertToDate(a.cells[5].textContent);
    var dateB = convertToDate(b.cells[5].textContent);

    return order === "ASC" ? dateA - dateB : dateB - dateA;
  });

  // Reinsert the sorted rows into the table
  rows.forEach(function (row) {
    table.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var button = document.getElementById("button");
  const toggleSwitch = document.getElementById("toggle");
  const switchLabel = document.getElementById("switch-label");
  var order = "ASC";

  if (toggleSwitch && switchLabel) {
    toggleSwitch.addEventListener("change", function () {
      if (this.checked) {
        switchLabel.textContent = "DESC";
        order = "DESC";
      } else {
        switchLabel.textContent = "ASC";
        order = "ASC";
      }
    });
  }
  if (button) {
    button.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: sortTableByDate,
          args: [order],
        });
      });
    });
  }
});
