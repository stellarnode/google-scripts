function sortKeywordsIntoLists() {
  
  // Put all your keywords into a Google Spreadsheet
  
  // Get the sharable link to the document you created.
  
  // The column with keywords should be named 'Keyword' (case sensitive)
  // Name the sheet containing the list of keywords as 'RAW' (case sensitive)
  
  // ATTENTION: ALL OTHER SHEETS IN THE FILE WILL BE DELETED BEFORE PROCESSING!
  
  // Example link to the document: https://docs.google.com/spreadsheets/d/1cOUNIHmUSnzmdFHVTvKEbn1ozKPsJ8kW7XGEB6EBFwA/edit?usp=sharing
  // The File ID is this part: 1cOUNIHmUSnzmdFHVTvKEbn1ozKPsJ8kW7XGEB6EBFwA
  // Insert this string into the fileId field of the options object below.
  
  // List identifiers for each keyword group. These identifiers will be used to search the provided keyword list.
  // Example of identifiers array for keyword lists related to 'шкаф': ['встроен', 'углов', 'недорог', 'дешев', 'москв', 'заказ', 'прихож', 'спальн', 'гостин', 'гардероб', 'больш']
  
  // Run the script.
  // Enjoy.
  
  Logger.log('Starting...');
  
  var options = {
    fileId: '1cOUNIHmUSnzmdFHVTvKEbn1ozKPsJ8kW7XGEB6EBFwA',
    // broadMatch: true,
    // broadMatchModified: true,
    // phraseMatch: true,
    // exactMatch: true,
    identifiers: ['встроен', 'углов', 'недорог', 'дешев', 'москв', 'заказ', 'прихож', 'спальн', 'гостин', 'гардероб', 'больш']
  };
  
  function getBroadModified(keyword) {
    var kwSplit = keyword.trim().split(' ');
    var newKwSplit = kwSplit.map(function(word) {
      return '+' + word;
    });
    return "'" + newKwSplit.join(' ');
  }
  
  var file = SpreadsheetApp.openById(options.fileId);
  
  // Ad group identifiers - words or parts of words by which the script will be sorting the list
  var identifiers = options.identifiers;
  
  var sheets = file.getSheets();
  
  sheets.forEach(function(sheet) {
    if (sheet.getName().toUpperCase() != 'RAW') {
      file.deleteSheet(sheet);
    }
  });
  
  var sheet = file.getSheetByName("RAW");
  if (sheet != null) {
    var sheetIndex = sheet.getIndex();
    Logger.log(sheet.getIndex());
  } else {
    Logger.log('Could not find sheet named RAW');
    exit();
  }
  
  var range = sheet.getDataRange();
  var values = range.getValues();
  var keywordColumnIndex;
  
  for (var i = 0; i < values[0].length; i++) {
    if (values[0][i].toLowerCase() == 'keyword' || values[0][i].toLowerCase() == 'keywords') {
      keywordColumnIndex = i;
    }
  }
  
  if (!keywordColumnIndex) {
    Logger.log('Could not find colunm named Keyword');
    exit();
  }
  
  var keywordList = [];
  
  values.forEach(function(val) {
    keywordList.push(val[keywordColumnIndex]);
  });
  
  identifiers.forEach(function(identifier) {
    var newSheet = file.insertSheet();
    newSheet.clear();
    newSheet.setName(identifier + ' Group');
    newSheet.appendRow(['Broad Match', 'Broad Modified', 'Phrase Match', 'Exact Match']);
    
    keywordList.forEach(function(keyword) {
      
      var keywordClean = '';
      
      if ((keyword[0] == '"' || keyword[0] == '[') && (keyword[keyword.length - 1] == '"' || keyword[keyword.length - 1] == ']')) {
        keywordClean = keyword.slice(1, keyword.length - 1);
      } else {
        keywordClean = keyword;
      }
      
      if (keywordClean.indexOf(identifier) > -1) {
        newSheet.appendRow([keywordClean.trim(), getBroadModified(keywordClean), '"' +  keywordClean.trim()+ '"', '[' + keywordClean.trim()+']']);
      }
    });
    
    var newRange = newSheet.getDataRange();
    newRange.setNumberFormat('TEXT FORMAT');
  
  });
  
  Logger.log('DONE');
  
}
