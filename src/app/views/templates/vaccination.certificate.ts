export const vaccinationCertificateTemplate = `
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
            }
            page {
                background: white;
                display: block;
                box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
            }
            page[size="A5"] {
              width: 210mm;
              height: 148mm;
                position: relative;
                page-break-after: avoid;
                page-break-inside: avoid;
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

            .overflow-text { 
              overflow: auto;
            }

            .footer {
                position: absolute;
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
        <page size="A5">
            <div class="margin">
                <div class="row">
                    <div class="col-8">
                        <div class="row">
                            <div class="col-3 pr-0" style="margin-top: 4px;">
                                <img src="/assets/img/new_hmc_logo.png" width="110%" height="auto">
                            </div>
                            <div class="col-9 address float-left pt-2">
                                <strong><span class="text-size-l">HEALTHWAY MEDICAL</span></strong>
                                <span class="text-size-s"><br>{{clinicAddress}}
                                <br>TEL {{clinicTel}} / FAX {{clinicFax}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <h6 class="pt-2 float-right" style="text-align: right">
                            <strong>CERTIFICATE OF VACCINATION</strong>
                        </h6>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-12">
                        <span><strong>Particulars of Patient Vaccinated: </strong></span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3"><strong>NAME: </strong></div>
                    <div class="col-9">{{patientName}}</span></div>
                </div>
                <div class="row">
                    <div class="col-3"><strong>IDENTIFICATION: </strong></div>
                    <div class="col-9">{{patientUserId}}</span></div>
                </div>
                <div class="row">
                    <div class="col-3"><strong>GENDER: </strong></div>
                    <div class="col-9">{{patientGender}}</span></div>
                </div>
                <div class="row">
                    <div class="col-3"><strong>DATE OF BIRTH: </strong></div>
                    <div class="col-9">{{patientDOB}}</span></div>
                </div>
                <br>

                <div class="row">
                    <div class="col-12">
                        <span><strong>Particulars of Vaccination: </strong></span>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-4">
                        TYPE
                    </div>
                    <div class="col-4">
                        DOSE
                    </div>
                    <div class="col-4">
                        DATE ADMINISTERED
                    </div>
                </div>
                <hr>
                {{immunizations}}

                <div class="footer">
                    <div class="row">
                        <div class="col-4">
                            <hr>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <span><strong>{{doctorName}}</strong></span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            {{doctorOccupation}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <small>This is the original Certificate of Vaccination</small>
                        </div>
                        <div class="col-6">
                            <span class="float-right">
                                <small>Printed By: {{currentUserName}} ({{printDate}})</small>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </page>
    </body>
</html>
`;
