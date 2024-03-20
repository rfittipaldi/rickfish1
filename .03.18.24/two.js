function onFormSubmit(event) {
    record_array = [];
    var forms = FormApp.openById("1zw210QOsGmlVC-ybjMB_sqUb8tpCMkgwFc5ankLkrdY");
    var formResponses = forms.getResponses();
    if (formResponses.length === 0) {
      Logger.log("No form responses found");
      return;
    }
    
    var formResponse = formResponses[formResponses.length - 1];
    var itemResponses = formResponse.getItemResponses();
    for (var j = 0; j < itemResponses.length; j++){
      var itemResponse = itemResponses[j];
      var answer = itemResponse.getResponse();
      record_array.push(answer);
    }
    
    var formattedDob    = Utilities.formatDate(new Date(record_array[7] ), "EST", 'MM/dd/yyyy');
    var formattedStart  = Utilities.formatDate(new Date(record_array[10]), "EST", 'MM/dd/yyyy');
    var formattedEnd    = Utilities.formatDate(new Date(record_array[11]), "EST", 'MM/dd/yyyy');
    
    var distDocId = AddDistRecord(distArray); // changed "AddRecord"
    var techDocId = AddTechRecord(techArray);
    
    emailDistDocPDF(distDocId, formattedDob, formattedStart, formattedEnd);
    emailTechDocPDF(techDocId, formattedDob, formattedStart, formattedEnd);
  }
  
  function AddRecord(record_array) {
    var templateFile = DriveApp.getFileById('1pO1cNkMvMnZCjsN4Q6qMabZcBCOBf9kWrNXLjWXMvlI');
    var folder = DriveApp.getFolderById('1CE6CPnWxujXbhAr54AvjF6ztg7yK7tqF');
    var copy = templateFile.makeCopy('new certified hire ' + record_array[4] + ', ' + record_array[3] +'  |  ' + record_array[2] + ' at ' + record_array[0]);
    var docId = copy.getId();
    var doc = DocumentApp.openById(copy.getId());
    var docpage = doc.getBody();
    
    // Replace placeholders with form responses
    for (var i = 0; i < record_array.length; i++) {
      docpage.replaceText("{{" + i + "}}", record_array[i]);
    }
    
    doc.saveAndClose();
    Utilities.sleep(1000);
    return docId;
  }
  
  function AddTechRecord(record_array) {
    // Your logic to add the tech record goes here
  }
  
  function emailDistDocPDF(docId, formattedDob, formattedStart, formattedEnd) {
    var document = DocumentApp.openById(docId);
    var blob = document.getBlob().getAs('application/pdf');
    blob.setName(document.getName() + '.pdf');
    
    var recipients = ['rfittipaldi@gehrhsd.net','gehrhsd@gehrhsd.net'];
    var subject = 'To District - New Certified Hire - ' + record_array[3] + ' ' + record_array[4] + '  |  ' + record_array[2] + '  |  Starting on ' + formattedStart + ' at ' + record_array[0];
    var body = '<strong style="font-size: 2em; ">' + record_array[4] + ', ' + record_array[3] + '</strong><br><br>' + generateTable(record_array);
    
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
  
  function generateTable(record_array) {
    // Generate HTML table from record_array
  }
  