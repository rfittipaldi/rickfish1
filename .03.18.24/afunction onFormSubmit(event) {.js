function onFormSubmit(event) {
  var forms = FormApp.openById("1zw210QOsGmlVC-ybjMB_sqUb8tpCMkgwFc5ankLkrdY");
  var formResponses = forms.getResponses();
  if (formResponses.length === 0) {
    Logger.log("No form responses found");
    return;
  }
  
  var formResponse = formResponses[formResponses.length - 1];
  var itemResponses = formResponse.getItemResponses();
  var distArray = []; // Rename record_array to distArray
  for (var j = 0; j < itemResponses.length; j++){
    var itemResponse = itemResponses[j];
    var answer = itemResponse.getResponse();
    distArray.push(answer); // Push form responses into distArray
  }
  
  var formattedDob = Utilities.formatDate(new Date(distArray[7]), "EST", 'MM/dd/yyyy');
  var formattedStart = Utilities.formatDate(new Date(distArray[10]), "EST", 'MM/dd/yyyy');
  var formattedEnd = Utilities.formatDate(new Date(distArray[11]), "EST", 'MM/dd/yyyy');
  
  var distDocId = distRecord(distArray); // Call distRecord with distArray
  var techDocId = distRecord(distArray); // Call distRecord for tech, or use the same function if they're similar
  
  emailDistDocPDF(distDocId, formattedDob, formattedStart, formattedEnd);
  emailTechDocPDF(techDocId, formattedDob, formattedStart, formattedEnd);
}

function distRecord(distArray) {
  var templateFile = DriveApp.getFileById('1pO1cNkMvMnZCjsN4Q6qMabZcBCOBf9kWrNXLjWXMvlI');
  var folder = DriveApp.getFolderById('1CE6CPnWxujXbhAr54AvjF6ztg7yK7tqF');
  var copy = templateFile.makeCopy('new certified hire ' + distArray[4] + ', ' + distArray[3] +'  |  ' + distArray[2] + ' at ' + distArray[0]);
  var docId = copy.getId();
  var doc = DocumentApp.openById(copy.getId());
  var docpage = doc.getBody();
  
  // Replace placeholders with form responses
  for (var i = 0; i < distArray.length; i++) {
    docpage.replaceText("{{" + i + "}}", distArray[i]);
  }
  
  doc.saveAndClose();
  Utilities.sleep(1000);
  return docId;
}

function emailDistDocPDF(docId, formattedDob, formattedStart, formattedEnd) {
  var document = DocumentApp.openById(docId);
  var blob = document.getBlob().getAs('application/pdf');
  blob.setName(document.getName() + '.pdf');
  
  var recipients = ['rfittipaldi@gehrhsd.net','gehrhsd@gehrhsd.net'];
  var subject = 'To District - New Certified Hire - ' + distArray[3] + ' ' + distArray[4] + '  |  ' + distArray[2] + '  |  Starting on ' + formattedStart + ' at ' + distArray[0];
  var body = '<strong style="font-size: 2em; ">' + distArray[4] + ', ' + distArray[3] + '</strong><br><br>' + generateTable(distArray);
  
  GmailApp.sendEmail(
    recipients.join(','),
    subject,
    body,
    {htmlBody: body, attachments:[blob]}
  );
}

function emailTechDocPDF(docId, formattedDob, formattedStart, formattedEnd) {
  // Similar to emailDistDocPDF but for tech document
}

// If you have a generateTable function, you can include it here.
