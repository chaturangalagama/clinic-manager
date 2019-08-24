export const timeChitTemplate = `
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
            .overflow-text { 
              overflow: auto;
            }
            .text-size-xl {
              font-size: 14px;
            }
            .text-size-l {
              font-size: 11px;
            }
            .text-size-m {
              font-size: 10.5px;
            }
            .text-size-s {
              font-size: 8px;
            }
            .text-size-xs {
              font-size: 7px;
            }

            .address {
              line-height: 1.1;
            }
        </style>
    </head>
    <body>
        <page size="A5" layout="landscape">
            <div class="margin">
                <div class="row">
                    <div class="col-8">
                        <div class="row">
                            <div class="col-3 pr-0">
                                 <img src="/assets/img/new_hmc_logo.png" width="110%" height="auto">
                            </div>
                            <div class="col-9 address float-left pt-2">
                              <strong><span class="text-size-xl">HEALTHWAY MEDICAL</span></strong>
                              <span class="text-size-l"><br>{{clinicAddress}}
                              <br>TEL {{clinicTel}} / FAX {{clinicFax}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                    <h4 class="pt-2 float-right" style="text-align: right">
                        <strong>TIME CHIT</strong>
                    </h4>
                </div>
                </div>
                <br>

                <div class="row">
                    <div class="col-6">
                        <span><strong>NAME: </strong>{{patientName}}</span>
                    </div>
                    <div class="col-6">
                        <span><strong>IDENTIFICATION: </strong>{{patientUserId}}</span>
                    </div>
                </div>
                <hr>

                <div class="row">
                    <div class="col-12">
                        {{printDate}}
                    </div>
                </div>
                <br>

                <div class="row">
                    <div class="col-12">
                        <strong>TO WHOM IT MAY CONCERN</strong>
                    </div>
                </div>
                <br>

                <div class="row">
                    <div class="col-12">
                        Re: {{patientName}} ({{patientUserId}})
                    </div>
                </div>
                <br>

                <div class="row">
                    <div class="col-12">
                        This is to certify that the above patient visited our clinic on <strong>{{consultDate}}</strong> at <strong>{{consultStartTime}}</strong> for medical consultation and left the clinic at <strong>{{consultEndTime}}</strong>.
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-12">
                        Yours faithfully,
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
                        <div class="col-6">
                            {{doctorSpeciality}}
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
