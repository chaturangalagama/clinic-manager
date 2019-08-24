export const medicalCertificateTemplate = `
<!DOCTYPE html>
<html>
    <head>
        <title>
            HEALTHWAY MEDICAL CLINIC
        </title>
        <link rel="stylesheet" href="/lib/bootstrap/bootstrap.min.css">
        <style>
            body {
                background: rgb(204,204,204);
                font-size: 12px;
            }
            page {
                background: white;
                display: block;
                margin: 6.35mm;
                box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
                page-break-after: always;
                page-break-inside: avoid;
            }
            page[size="A5"][layout="landscape"] {
                width: 21cm;
                height: 14.8cm;
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
            }
            .margin {
                margin-left: 10px;
                margin-right: 10px;
            }
            .footer {
                position: absolute;
                bottom: 0;
                width: 97.5%;
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
                           <div class="col-4 pr-0" style="margin-top: 4px;">
                                <img src="/assets/img/new_hmc_logo.png" class="img-fluid" height="70%">
                            </div>
                            <div class="col-8 pt-2 address">
                                <strong><span class="text-size-m">HEALTHWAY MEDICAL</span></strong><br>
                                <span class="text-size-s">COMPANY REGISTRATION NO: {{companyRegistrationNumber}}<br>
                                GST REGISTRATION NO: {{gstRegistrationNumber}}<br>
                                {{clinicAddress}}<br> 
                                TEL {{clinicTel}} / FAX {{clinicFax}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-3">
                        <h4 class="pt-2 float-right" style="font-weight:600">
                            <span class="float-right">MEDICAL</span><br> 
                            <span class="float-right">CERTIFICATE</span>
                        </h4>
                    </div>
                </div>
                <br>

                <div class="row">
                    <div class="col-6">
                        <div class="row">
                            <div class="col-4"><strong>NAME: </strong></div>
                            <div class="col-8">{{patientName}}</div>
                        </div>
                    </div>
                    <div class="col-6">
                        <strong>IDENTIFICATION: </strong>{{patientUserId}}
                    </div>
                </div>
                <div class="row">
                    <div class="col-2"><strong>VISIT DATE: </strong></div>
                    <div class="col-10">{{visitDate}}</div>
                </div>
                <hr>

                <div class="row">
                    <div class="col-12">
                        This is to certify that the above mentioned has been given:
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-12">
                        <span>
                            <strong>{{purpose}} </strong>for {{numberOfDays}} day(s) from {{startDate}} to {{endDate}}
                        </span>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-12">
                        <span>
                            <strong>REMARKS: </strong> {{remark}}
                        </span>
                    </div>
                </div>

                <div class="footer">
                    <div class="row">
                        <div class="col-4">
                            <hr class="m-0">
                            <span><strong>{{doctorName}}</strong></span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            {{doctorOccupation}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <span class="float-right">
                                Ref No.: {{refNo}}
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            Not Valid for Absence from Court Attendance
                        </div>
                        <div class="col-6">
                            <span class="float-right">
                                Printed By: {{currentUserName}} ({{printDate}})
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </page>
    <body>
</html>
`;


// <!DOCTYPE html>
// <html>
//     <head>
//         <title>
//             HEALTHWAY MEDICAL CLINIC
//         </title>
//         <link rel="stylesheet" href="/lib/bootstrap/bootstrap.min.css">
//         <style>
//             body {
//                 background: rgb(204,204,204);
//                 font-size: 12px;
//             }
//             page {
//                 background: white;
//                 display: block;
//                 margin: 6.35mm;
//                 box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
//                 page-break-after: always;
//                 page-break-inside: avoid;
//             }
//             page[size="A5"][layout="landscape"] {
//                 width: 21cm;
//                 height: 14.8cm;
//                 position: relative;
//             }
//             @media print {
//                  @page {
//                     size: A5 landscape;
//                     margin: 4mm 5.5mm;
//                 }
//                 body {
//                     min-width: initial!important;
//                 }
//                 page{
//                     margin: 0mm;
//                 }
//             }
//             .margin {
//                 margin-left: 10px;
//                 margin-right: 10px;
//             }
//             .footer {
//                 position: absolute;
//                 bottom: 0;
//                 width: 97.5%;
//             }
//             .text-size-xl {
//               font-size: 1.5em;
//             }
//             .text-size-l {
//               font-size: 1.3em;
//             }
//             .text-size-m {
//               font-size: 1.15em;
//             }
//             .text-size-s {
//               font-size: 0.9em;
//             }
//             .text-size-xs {
//               font-size: 0.7em;
//             }
//             .address {
//               line-height: 1.3;
//             }
//         </style>
//     </head>
//     <body>
//         <page size="A5" layout="landscape">
//             <div class="margin">
//                 <div class="row">
//                     <div class="col-9">
//                         <div class="row">
//                            <div class="col-4 pr-0" style="margin-top: 4px;">
//                                 <img src="/assets/img/new_hmc_logo.png" class="img-fluid" height="70%">
//                             </div>
//                             <div class="col-8 pt-2 address">
//                                 <strong><span class="text-size-m">HEALTHWAY MEDICAL</span></strong><br>
//                                 <span class="text-size-s">COMPANY REGISTRATION NO: <br>
//                                 GST REGISTRATION NO: <br>
//                                 {{clinicAddress}}<br> 
//                                 TEL {{clinicTel}} / FAX {{clinicFax}}</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="col-3">
//                         <h4 class="pt-2 float-right" style="font-weight:600">
//                             <span class="float-right">MEDICAL</span><br> 
//                             <span class="float-right">CERTIFICATE</span>
//                         </h4>
//                     </div>
//                 </div>
//                 <br>

//                 <div class="row">
//                     <div class="col-6">
//                         <div class="row">
//                             <div class="col-4"><strong>NAME: </strong></div>
//                             <div class="col-8">{{patientName}}</div>
//                         </div>
//                     </div>
//                     <div class="col-6">
//                         <strong>IDENTIFICATION: </strong>{{patientUserId}}
//                     </div>
//                 </div>
//                 <div class="row">
//                     <div class="col-2"><strong>VISIT DATE: </strong></div>
//                     <div class="col-10">{{visitDate}}</div>
//                 </div>
//                 <hr>

//                 <div class="row">
//                     <div class="col-12">
//                         This is to certify that the above mentioned has been given:
//                     </div>
//                 </div>
//                 <br>
//                 <div class="row">
//                     <div class="col-12">
//                         <span>
//                             <strong>{{purpose}} </strong>for {{numberOfDays}} day(s) from {{startDate}} to {{endDate}}
//                         </span>
//                     </div>
//                 </div>
//                 <br>
//                 <div class="row">
//                     <div class="col-12">
//                         <span>
//                             <strong>REMARKS: </strong> {{remark}}
//                         </span>
//                     </div>
//                 </div>

//                 <div class="footer">
//                     <div class="row">
//                         <div class="col-4">
//                             <hr class="m-0">
//                             <span><strong>{{doctorName}}</strong></span>
//                         </div>
//                     </div>
//                     <div class="row">
//                         <div class="col-12">
//                             {{doctorOccupation}}
//                         </div>
//                     </div>
//                     <div class="row">
//                         <div class="col-12">
//                             <span class="float-right">
//                                 Ref No.: {{refNo}}
//                             </span>
//                         </div>
//                     </div>
//                     <div class="row">
//                         <div class="col-6">
//                             Not Valid for Absence from Court Attendance
//                         </div>
//                         <div class="col-6">
//                             <span class="float-right">
//                                 Printed By: {{currentUserName}} ({{printDate}})
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </page>
//     <body>
// </html>