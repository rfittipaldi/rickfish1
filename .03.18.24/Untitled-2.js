function onFormSubmit(event) { //this works as intended, 03.15.24 (but just the one email, need to add the tech to this)

  record_array = [];
  var forms = FormApp.openById("1zw210QOsGmlVC-ybjMB_sqUb8tpCMkgwFc5ankLkrdY");
  var formResponses = forms.getResponses();
  Logger.log("Number of form responses: " + formResponses.length);
  if (formResponses.length === 0) {
    Logger.log("No form responses found");
    return;
  }
  var formResponse = formResponses[formResponses.length -1];
  Logger.log("Form response: " + formResponse);
  var itemResponses = formResponse.getItemResponses();
  for (var j = 0; j < itemResponses.length; j++){
    var itemResponse = itemResponses[j];
    var answer = itemResponse.getResponse();
    
    Logger.log("Answer #" + j + ": " + answer);
    record_array.push(answer);
  }
  // Calculate formatted dates
  var formattedDob = Utilities.formatDate(new Date(record_array[7]), "EST", 'MM/dd/yyyy');
  var formattedStart = Utilities.formatDate(new Date(record_array[10]), "EST", 'MM/dd/yyyy');
  var formattedEnd = Utilities.formatDate(new Date(record_array[11]), "EST", 'MM/dd/yyyy');
  var docId = AddRecord(
    record_array[0],  //   school
    record_array[1],  //   category
    record_array[2],  //   position
    record_array[3],  //   fname
    record_array[4],  //   lname
    record_array[5],  //   mmname
    record_array[6],  //   ssn
    formattedDob,     //   dob
    record_array[8],  //   cell
    record_array[9],  //   email
    formattedStart,   //  start
    formattedEnd,     //  end
    record_array[12], //  fulltime
    record_array[13], //  newposition
    record_array[14], //  replacing 
    record_array[15], //  covering
    record_array[16], //  degree
    record_array[17], //  tracking
    record_array[18], //  certs1
    record_array[19], //  certs2
    record_array[20], //  certType
    record_array[21], //  exp1
    record_array[22], //  exp2
    record_array[23], //  exp3
    record_array[24], //  preps
    record_array[25], //  expectation
    record_array[26], //  mentor1
    record_array[27], //  mentor2
    record_array[28], //  college1
    record_array[29], //  college2
    record_array[30], //  applied
    record_array[31], //  interviewed
    record_array[32], //  summary
    record_array[33], //  demo
    record_array[34], //  notes
  );
  emailDocPDF(docId, formattedDob, formattedStart, formattedEnd);
}
function AddRecord(
  school,
  category,
  position,
  fname,
  lname,
  mmname,
  ssn,
  dob,
  cell,
  email,
  start,
  end,
  fulltime,
  newposition,
  replacing,
  covering,
  degree,
  tracking,
  certs1,
  certs2,
  certType,
  exp1,
  exp2,
  exp3,
  preps,
  expectation,
  mentor1,
  mentor2,
  college1,
  college2,
  applied,
  interviewed,
  summary,
  demo,
  notes
)
{
  var templateFile = DriveApp.getFileById('1pO1cNkMvMnZCjsN4Q6qMabZcBCOBf9kWrNXLjWXMvlI'); // certified to district
  var folder = DriveApp.getFolderById('1CE6CPnWxujXbhAr54AvjF6ztg7yK7tqV')
  var copy = templateFile.makeCopy('new certified hire ' + lname + ', ' + fname +'  |  ' + position + ' at ' + school);
  var docId = copy.getId();
  var doc = DocumentApp.openById(copy.getId());
  var docpage = doc.getBody();
  docpage.replaceText("{{school}}",             school);
  docpage.replaceText("{{category}}",           category);
  docpage.replaceText("{{position}}",           position);
  docpage.replaceText("{{fname}}",              fname);
  docpage.replaceText("{{lname}}",              lname);
  docpage.replaceText("{{mname}}",              mmname);
  docpage.replaceText("{{ssn}}",                ssn);
  docpage.replaceText("{{dob}}",                dob);
  docpage.replaceText("{{cell#}}",              cell);
  docpage.replaceText("{{per_email}}",          email);
  docpage.replaceText("{{effective}}",          start);
  docpage.replaceText("{{end_date}}",           end);
  docpage.replaceText("{{full_time}}",          fulltime);
  docpage.replaceText("{{new_position}}",       newposition);
  docpage.replaceText("{{replacing}}",          replacing);
  docpage.replaceText("{{covering}}",           covering);
  docpage.replaceText("{{degree}}",             degree);
  docpage.replaceText("{{tracking}}",           tracking);
  docpage.replaceText("{{cert1}}",              certs1);
  docpage.replaceText("{{cert2}}",              certs2);
  docpage.replaceText("{{cert_type}}",          certType);
  docpage.replaceText("{{exp_pub_ed}}",         exp1);
  docpage.replaceText("{{exp_ed}}",             exp2);
  docpage.replaceText("{{exp_prof}}",           exp3);
  docpage.replaceText("{{preps}}",              preps);
  docpage.replaceText("{{salary}}",             expectation);
  docpage.replaceText("{{mentor1}}",            mentor1);
  docpage.replaceText("{{mentor2}}",            mentor2);
  docpage.replaceText("{{spec_ed_college}}",    college1);
  docpage.replaceText("{{alt_route_college}}",  college2);
  docpage.replaceText("{{applicants}}",         applied);
  docpage.replaceText("{{interviewed}}",        interviewed);
  docpage.replaceText("{{summary}}",            summary);
  docpage.replaceText("{{demo}}",               demo);
  docpage.replaceText("{{notes}}",              notes);
doc.saveAndClose()
Utilities.sleep(1000);
return docId;
}
function emailDocPDF(docId, formattedDob, formattedStart, formattedEnd) {
  var document = DocumentApp.openById(docId);
  var blob = document.getBlob().getAs('application/pdf');
  blob.setName(document.getName() + '.pdf');
var table = 
'<table style = "border-collapse: collapse; width: 60%;">' + 
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">School</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[0] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Category</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[1] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Position</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[2] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">First Name</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[3] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Last Name</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[4] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">MM Name</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[5] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">SSN</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[6] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">DOB</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + formattedDob + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Cell#</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[8] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Email</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[9] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Effective</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">'+ formattedStart + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">End Date</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + formattedEnd + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Fulltime?</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[12] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">New Position?</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[13] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Replacing</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[14] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Covering</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[15] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Degree Status</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[16] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Tracking</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[17] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Certs Held</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[18] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Certs Used</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[19] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Type</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[20] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Cert Years</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[21] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Ed. Exp.</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[22] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Prof. Exp. Years</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[23] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Preps</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[24] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Salary Expectation</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[25] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Primary Mentor</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[26] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Secondary Mentor</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[27] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">College - Sp Ed</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[28] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">College - Alt Rte</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[29] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">No. Applicants</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[30] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">No. interviewed</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[31] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Pool Summary</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[32] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Demo Info</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[33] + '</th></tr>' +
'<tr><td style="padding:.5em;font-size:1em; width:20%;border: 1px solid #dddddd;text-align: right;">Notes</td><th style="background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px;">' + record_array[34] + '</th></tr></td></table>'
;
var recipients = ['rfittipaldi@gehrhsd.net','gehrhsd@gehrhsd.net'];
var subject = 'To District - New Certified Hire - ' + record_array[3] + ' ' + record_array[4] + '  |  ' + record_array[2] + '  |  Starting on ' + formattedStart + ' at ' + record_array[0];
var body = record_array[4] + ', <strong style="font-size: 2em; ">' + record_array[3] + '</strong><br><br>' + table;
var body = '<strong style="font-size: 2em; ">' + record_array[4] + ', ' + record_array[3] + '</strong><br><br>' + table;
GmailApp.sendEmail(
  recipients.join(','),
  subject,
  body,
  {htmlBody: body, attachments:[blob]}
);
}