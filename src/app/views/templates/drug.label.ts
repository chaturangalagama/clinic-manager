export const drugLabelTemplate = `
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
              font-family:Arial, Helvetica, sans-serif;
              line-height: 1.3;
            }
            page {
            /*border: 1px solid black;*/
              background: white;
              display: block;
              box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
              page-break-after: avoid;
              page-break-inside: avoid;
              margin: 4mm auto;
            }
            page[size="DrugLabel"] {
              width: 101mm;
              height: 56mm;  2mm height /*for bleeding */

           /*   width: 10cm;
              height: 5.6cm;*/
            }
            @media print {
              body, page {
                min-width: initial!important;
                margin: 0;

              }
              @page {
                size: landscape;
            /*    margin: 0mm 0mm 0mm 6mm; */
                 margin: 1mm 2mm 1mm 6mm;
              }


             .label-footer {
               position: fixed;
                left: 0;
                bottom: 0;
                right: 2mm;
                width: 100%;
                height: 3.5em;
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

      <page size="DrugLabel">
        <div class="row">
            <div class="col-3 pr-0" style="margin-top: 3px;"> <img src="./assets/img/new_hmc_logo.png" class="img-fluid"> </div>
            <div class="col-9 address float-left pt-2">
                <strong><span class="text-size-l ">HEALTHWAY MEDICAL</span></strong>
                <span class="text-size-s"><br>{{clinicAddress}}
                <br>TEL {{clinicTel}} / FAX {{clinicFax}}</span>
            </div>
        </div>
        <div class="row pt-1">
            <div class="col-9 text-size-xl overflow-text">
                <strong>
                    {{drugName}}
                 </strong>
            </div>
            <div class="col-3  text-size-xl ">
                <span class="float-right">
                    <strong>
                        {{drugQuantity}}
                    </strong>
                </span>
            </div>
        </div>
        <div class="row  text-size-m">
            <div class="col-6">
                BATCH NO {{drugBatchNo}}
            </div>
            <div class="col-6">
                <span class="float-right">
                    EXPIRY {{drugExpiryDate}}
                </span>
            </div>
        </div>
        <br>
        <div class="row">
            <div class="col-12">
                <div class="text-size-xl  overflow-text"> {{drugDosage}} {{drugInstruction}} </div>
                <div class="pt-2 text-size-l  overflow-text">{{drugCautionary}} {{drugRemarks}} </div>
            </div>
        </div>
        <br>
        <div class="label-footer">
            <div class="row">
                <div class="col-12 text-size-s">
                    {{patientId}}
                </div>
            </div>
            <div class="row">
                <div class="col-6 text-size-l">
                    <strong>
                        {{patientName}}
                    </strong>
                </div>
                <div class="col-6  text-size-l">
                    <span class="float-right pr-3">
                        DATE {{visitDate}}
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-12 text-center  text-size-s">
                    <small>
                        KEEP OUT OF THE REACH OF CHILDREN
                    </small>
                </div>
            </div>
        </div>
      </page>
</html>
`;
