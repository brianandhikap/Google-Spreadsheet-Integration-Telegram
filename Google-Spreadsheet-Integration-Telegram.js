var token = "YOUR_TOKEN"; //Your BOT Token
var SheetID = "ID_Spreadsheets"; //Your ID Spreadsheets
var UrlPublish = "URL_Publish"; //Your URL Publish
var telegramUrl = "https://api.telegram.org/bot" + token;


function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + UrlPublish;
  var response = UrlFetchApp.fetch(url);
}

function doPost(e) {
  var stringJson = e.postData.getDataAsString();
  var updates = JSON.parse(stringJson);

  if (updates.message.text) {
    var command = updates.message.text.trim().toLowerCase();
    if (command.startsWith('/data')) {
      var data = command.substring(6).trim();
      sendText(updates.message.chat.id, getDataFromSheet(data));
    } else {
      // Handle other commands or messages here
    }
  }
}

function AmbilSheet1() {
  var rangeSheet = 'Sheet1!A2:Z';
  var rows = Sheets.Spreadsheets.Values.get(SheetID, rangeSheet).values;
  return rows;
}

function getDataFromSheet(ID) {
  var dataIDPel = AmbilSheet1();
  for (var row = 0; row < dataIDPel.length; row++) {
    var cellValue = dataIDPel[row][0]; // Search from Column A
    if (cellValue.toLowerCase() == ID.toLowerCase()) {
      return "Data A: " + dataIDPel[row][0] + "\n" + // [0] refers to column A
             "Data B: " + dataIDPel[row][1];
    }
  }
  // Return a message if no matching ID is found
  return "Data not found";
}

function sendText(chatid, text, replymarkup) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatid),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(replymarkup)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}