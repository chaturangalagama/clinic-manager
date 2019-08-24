export const billTemplate = `
<!DOCTYPE html>
<html>
   <head>
      <title>
         HEALTHWAY MEDICAL
      </title>
      <link rel="stylesheet" href="/lib/bootstrap/bootstrap.min.css">
      <style>
         body {
           background: rgb(204,204,204);
           font-size: 12px;
           font-family: Arial, Helvetica, sans-serif;
           line-height: 1.7;
         }
         page {
           background: white;
           display: block;
           margin: 6.35mm;
           box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
         }
         page[size="A5"][layout="landscape"] {
           width: 210mm;
           height: 148mm;
           position: relative;
         }
         @media print {
           @page {
             size: A5 landscape;
             margin: 4mm 5.5mm;
           }
           body {
             min-width: initial!important;
           }
           page{
            margin: 0mm;
           }
           .section-avoid-break {
            page-break-inside: avoid;
           }
         }
         .margin {
           margin-left: 10px;
           margin-right: 10px;
         }
         .footer {
           position: fixed;
           bottom: 0;
           width: 95%;
         }

         .text-size-xl {
           font-size: 1.5em;
         }
         .text-size-l {
          font-size: 1.3em;
         }
         .text-size-m {
           font-size: 1.15em;
         }
         .text-size-s {
          font-size: 0.9em;
         }
         .text-size-xs {
           font-size: 0.7em;
         }
         .address {
          line-height: 1.3;
         }
      </style>
   </head>
      <body>
        <page size="A5" layout="landscape">
         <div class="margin">
            <div class="row">
               <div class="col-9">
                  <div class="row">
                     <div class="col-4">
                        <img src="/assets/img/new_hmc_logo.png" class="img-fluid" height="70%">
                     </div>
                     <div class="col-8 pt-2 address">
                        <strong><b><span class="text-size-m">HEALTHWAY MEDICAL</span></b></strong><br>
                        <span class="text-size-s">COMPANY REGISTRATION NO: {{companyRegistrationNumber}}<br>
                        GST REGISTRATION NO: {{gstRegistrationNumber}}<br>
                        {{clinicAddress}}<br>
                        TEL {{clinicTel}} / FAX {{clinicFax}}</span>
                     </div>
                  </div>
               </div>
               <div class="col-3">
                  <div class="row">
                     <div class="col-12">
                        <h4 class="pt-2" style="font-weight:600">
                           <span class="float-right">{{receiptTitle}} </span><br>
                           <span class="float-right">RECEIPT</span>
                        </h4>
                     </div>
                  </div>
               </div>
            </div>
            <div class="row pt-3">
               <div class="col-2"><strong>NAME: </strong></div>
               <div class="col-4">{{patientName}}</div>
               <div class="col-2"><strong>IDENTIFICATION:</strong></div>
               <div class="col-4">{{patientUserId}}</div>
            </div>
            <div class="row">
               <div class="col-2"><strong>ATTENDING DR: </strong></div>
               <div class="col-4">{{doctorName}}</div>
               <div class="col-2"><strong>VISIT DATE: </strong></div>
               <div class="col-4">{{visitDate}}</div>
            </div>
            <div class="row">
               <div class="col-2 pr-0"><strong>PAYMENT MODE:</strong></div>
               <div class="col-4">{{paymentModes}}</div>
            </div>
            <hr>
            {{drugs}}
            {{medicalServices}}
            {{medicalTests}}
            {{immunizations}}
            {{consultation}}
            <hr>
            {{charges}}<br>
            <div class="footer">
               <div class="row">
                  <div class="col-12">
                     <span class="float-right">
                     {{billNo}}
                     </span>
                  </div>
               </div>
               <div class="row">
                  <div class="col-8">
                     <small>This is a computer generated document that does not require a signature</small>
                  </div>
                  <div class="col-4">
                     <span class="float-right">
                     <small>Printed By: {{assistantName}} ({{printDate}})</small>
                     </span>
                  </div>
               </div>
            </div> 
         </div>
        </page>
      </body>
  </html>
`;
