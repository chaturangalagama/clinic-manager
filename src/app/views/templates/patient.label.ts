export const patientLabelTemplate = `
<!DOCTYPE html>
<html>

<head>
    <title>
        HEALTHWAY MEDICAL CLINIC
    </title>
    <link rel="stylesheet" href="./lib/bootstrap/bootstrap.min.css">
    <style>
         body {
            background: rgb(255, 255, 255);
            font-size: 12px;
            font-family:Arial, Helvetica, sans-serif;
        }

        .font-9{
            font-size: 9px;
        }

        page {
            /*border: 1px solid black;*/
            background: white;
            display: block;
            box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
            page-break-after: auto;
            page-break-inside: avoid;
            margin: 4mm auto;
            font-size: 11px;
            font-family:Arial, Helvetica, sans-serif;
        }

        page[size="DrugLabel"] {
            width: 10cm;
            height: 5.4cm;
        }

        @media print {
            body,
            page {
                min-width: initial!important;
                margin: 0;
            }
            @page {
                size: landscape;
                margin: 0mm 0mm 0mm 6mm;
            }
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
          font-size: 10px;
        }
        .text-size-s {
          font-size: 8px;
        }
        .text-size-xs {
          font-size: 7px;
        }

        .address {
          line-height: 0.9;
        }
    </style>
</head>
    <page size="DrugLabel" >
       <div class="row">
            <div class="col-3 pr-0" style="margin-top: 3px;"> <img src="./assets/img/new_hmc_logo.png" class="img-fluid"> </div>
            <div class="col-9 address float-left pt-2"> 
              <strong>HEALTHWAY MEDICAL</strong>
              <span class="text-size-s"><br>{{clinicAddress}}
              <br>TEL {{clinicTel}} / FAX {{clinicFax}}</span>
              </div>
            </div>
            <div class="row pt-2">
                <div class="col-12">
                    <span class="text-size-m">{{id}}</span>
                    <br>
                    <span class="text-size-xl overflow-text">
                    <strong>
                      {{name}}
                    </strong>
                </span>
                 </div>
            </div>

            <br>
            <div class="row">
                <div class="col-6">
                    <div class="row">
                        <div class="col-6">GENDER: </div>
                        <div class="col-6">{{gender}}</div>
                    </div>
                </div>
                <div class="col-6">
                     <div class="row">
                        <div class="col-2">DOB: </div>
                        <div class="col-10">{{dob}}</div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="row">
                        <div class="col-6">IDENTIFICATION: </div>
                        <div class="col-6">{{userId}}</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="row">
                        <div class="col-2">TEL: </div>
                        <div class="col-10">{{contact}}</div>
                    </div>
                </div>
            </div>
            <div class="row pt-2">
                <div class="col-3">ADDR: </div>
                <div class="col-9">{{address}}</div>
            </div>
            <div class="row">
                <div class="col-3"> <strong>ALLERGIES: </strong></div>
                <div class="col-9">{{allergies}}</div>
            </div>
        </div>
    </page>
</html>
`;
