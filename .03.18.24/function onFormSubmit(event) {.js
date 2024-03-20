function onFormSubmit(event) {
  // This part remains unchanged as it works as intended
  // ... your existing code to process form responses ...

  // Here's the new logic for the second document and email
  var truncatedRecordArray = record_array.slice(); // Create a copy to avoid modifying original data
  // Filter out private information (SSN) from the truncated array
  truncatedRecordArray.splice(6, 1);

  var truncatedTable = createTruncatedTable(truncatedRecordArray);

  var secondRecipientList = ['broader.recipient.list@example.com']; // Replace with your recipient list
  var secondSubject = 'New Certified Hire - ' + record_array[3] + ' ' + record_array[4] + ' - ' + record_array[2];
  var secondBody = 'Please see the attached document for details about the new certified hire.';

  // Create a new document from a template for the second email
  var templateFile = DriveApp.getFileById('1pO2_SecondTemplateId'); // Replace with your second template ID
  var folder = DriveApp.getFolderById('1qB3_SecondFolderId'); // Replace with your second folder ID
  var copy = templateFile.makeCopy('truncated certified hire ' + record_array[4] + ', ' + record_array[3]);
  var secondDocId = copy.getId();
  var secondDoc = DocumentApp.openById(secondDocId);
  var secondDocPage = secondDoc.getBody();

  // Fill out the placeholders in the second template document
  // ... (similar logic as you have for the first document)

  secondDoc.saveAndClose();
  Utilities.sleep(1000);

  // Send the second email with the truncated table and the new document
  var secondBlob = DriveApp.getFileById(secondDocId).getBlob().getAs('application/pdf');
  secondBlob.setName(secondDoc.getName() + '.pdf');
  GmailApp.sendEmail(
    secondRecipientList.join(','),
    secondSubject,
    secondBody,
    {
      htmlBody: secondBody,
      attachments: [secondBlob, truncatedTable] // Include both the table and the PDF attachment
    }
  );
}

// Function to create the HTML table with truncated data
function createTruncatedTable(tableData) {
  var table = '<table style="border-collapse: collapse; width: 60%;">';
  for (var i = 0; i < tableData.length; i++) {
    if (i === 6) continue; // Skip the SSN index (index 6)
    var label = '<td>' + (i % 2 === 0 ? '<b>' : '') + 'Record Field ' + (i + 1) + '</b>' + (i % 2 === 0 ? '</td>' : ':</td>');
    var value = '<th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + tableData[i] + '</th>';
    table += '<tr>' + label + value + '</tr>';
  }
  table += '</table>';
  return table;
}
