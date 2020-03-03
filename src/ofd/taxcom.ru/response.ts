export const TAXCOM_RESPONSE = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Сервис ОФД Такском для проверки кассовых чеков</title>
        <meta name="description" content="Сервис ОФД Такском для проверки кассовых чеков онлайн: полная информация о каждом чеке онлайн-кассы. Сервис экспресс проверки кассового чека с 2017 года.">
        <meta name="keywords" content="чек проверить чек через офд проверка чеков офд проверка чека офд сайт проверки чеков офд на сайте проверить чек онлайн сайт проверки чеков онлайн проверка чека на подлинность проверить чек">
        <meta name="viewport" content="width=550, target-densitydpi=device-dpi, initial-scale=0.6, maximum-scale=1, user-scalable=yes">
        <meta name="format-detection" content="telephone=no"/>
        <meta name="robots" content="noindex,nofollow">
        <link href="/Content/css/bundle_css?v=SmHAZN8eGyGfg05vc9ywUMBlwv8sZM1frhNeA58yIb41" rel="stylesheet"/>

        <link href="/Content/css/fontface.css" rel="stylesheet">
        <link href="/Content/css/font-awesome.min.css" rel="stylesheet">

        <script src="/bundles/modernizr?v=inCVuEFe6J4Q07A0AcRsbJic_UE5MwpRMNGcOtk94TE1"></script>

    
        <script src="/bundles/jquery?v=DilzeZuJxdbQsfc_JOwsWB4VFDhTPM73urYeggaKdL81"></script>

        <script src="/bundles/bootstrap?v=mAh4n4EUASqwe-wXRUl25xePEOj1qJVYjV9v2bbVUJo1"></script>

        
        <script src="/Scripts/JsBarcode.all.js"></script>
    </head>
    <body>
        <!-- Yandex.Metrika counter -->
        <script type="text/javascript">
            (function (d, w, c) {
                (w[c] = w[c] || []).push(function () {
                    try {
                        w.yaCounter49664989 = new Ya.Metrika2({
                            id: 49664989,
                            clickmap: true,
                            trackLinks: true,
                            accurateTrackBounce: true,
                            webvisor: true
                        });
                    } catch (e) { }
                });

                var n = d.getElementsByTagName("script")[0],
                    s = d.createElement("script"),
                    f = function () { n.parentNode.insertBefore(s, n); };
                s.type = "text/javascript";
                s.async = true;
                s.src = "https://mc.yandex.ru/metrika/tag.js";

                if (w.opera == "[object Opera]") {
                    d.addEventListener("DOMContentLoaded", f, false);
                } else { f(); }
            })(document, window, "yandex_metrika_callbacks2");
        </script>
        <noscript><div><img src="https://mc.yandex.ru/watch/49664989" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
        <!-- /Yandex.Metrika counter -->

        <header class="header">
            <div class="wrapper">
                <div class="grid-container justify-container">
                    <div class="justify-item" style="vertical-align: middle;">
                        <a class="header-logo" href="/">
                            <img src="/Content/images/logo-taxcom-check.png" width="36" height="48" alt="Такском Чек">
                        </a>
                        <div class="header-title">
                            Такском Чек
                        </div>
                    </div>
                    <div class="header-menu justify-item">
                        <table>
                            <tr>
                                <td id="printButtonPDF" style="display: none">
                                    <a href="/Reciept/Upload/4F8CCF79-5C99-478E-8314-21B315C255C5?FiscalSign=571333283&amp;Summ=322.50" target="_blank" class="btn btn-inverse">
                                        Печать
                                    </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td>
                                    <a href="http://kkt-taxcom.ru/" id="about_serv">О сервисе</a>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </header>

        <div class="main">
            <div class="wrapper">
                

<style>
    .invoice-box {
        max-width: 510px;
        margin: auto;
        /*
\t\tpadding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 5px 2px rgba(0,0,0,.3);
\t\t*/
        font-size: 18px;
        line-height: 20px;
        font-family: 'CourierNewPSMT', 'Courier New', monospace;
        color: black;
    }

    
    .app-badge{
        height: 50px;
        margin: 10px;
    }
    .footer-message {
        font-size: 22px !important;
        margin: 10px;
    }
    .jumbotron-small-padding {
        padding-top: 20px;
    }

    /*.invoice-box table {
        width: 100%;
        max-width: 470px;
        line-height: inherit;
        text-align: left;
        table-layout: fixed;
    }

    .invoice-box table td {
        vertical-align: top;
        overflow-wrap: break-word;  
        word-wrap: break-word;
        word-break: break-all;  
        white-space: normal;
    }

    .invoice-box table tr td:nth-child(2) {
        text-align: right;
        white-space: nowrap;
    }
    .invoice-box table tr td:nth-child(3) {
        text-align: right;
        white-space: nowrap;
    }
    .invoice-box table tr.total {
        font-size: 32px;
    }
    .invoice-box table tr.item {
        word-spacing: -7px;
    }
    .invoice-box table tr.total td {
        padding-top: 32px;
        padding-bottom: 32px;
    }*/

</style>

<div class="grid-container">
    <div class="main-content">
            <div class="jumbotron jumbotron-small-padding" >               

                <div class="container">


                    

                    <div class="invoice-box">
                        


<style>
    .print-servissce-receipt a { color: #0069b3; }

    .print-service-receipt {
        border-left: solid 1px #d4dae6;
        border-right: solid 1px #d4dae6;
        border-top: solid 1px #d4dae6;
        color: #45545e;
        font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
        font-size: 14px;
        font-stretch: normal;
        font-style: normal;
        font-weight: normal;
        letter-spacing: normal;
        /*background-color: #f0f3f5;*/

        line-height: 0;
        width: 508px;
        overflow-wrap: break-word;
    }

    table.print-service-receipt {
        border-spacing: 0;
        -premailer-cellspacing: 0;
        -premailer-cellpadding: 0;
        border-collapse: separate;
    }

    .print-service-receipt table {
        color: #45545e;
        width: 100%;
        min-width: 100%; /* gmail android */
        border-spacing: 0;
        -premailer-cellspacing: 0;
        -premailer-cellpadding: 0;
        -premailer-width: 100%;
        border-collapse: separate;
    }

    .print-service-receipt table td {
        padding: 0;
    }
    .receipt-row-1 {
        clear: both;
        text-align: center;
    }

    .receipt-name-1042, .receipt-value-1042, .receipt-name-1012, .receipt-value-1012, .receipt-value-1043
    ,.receipt-name-1129, .receipt-name-1130, .receipt-name-1131, .receipt-name-1132
    ,.receipt-name-1133, .receipt-name-1145, .receipt-name-1146, .receipt-name-1232, .receipt-name-1233 
    ,.receipt-name-1194, .receipt-name-1157, .receipt-name-1158
    {
        color: #0069b3;
        font-size: 16px;
        font-weight: bold;
        line-height: 1.38;
    }

    .receipt-row-2 .receipt-col1 {
        text-align: left;
        padding-top: 4px;
    }

    .receipt-row-2 .receipt-col2 {
        text-align: right;
        padding-top: 4px;
    }

    .receipt-value-1038, .receipt-value-1021 { font-weight: bold; }

    td.side-padding {
        width: 42px;
    }

    .receipt-header1, .receipt-header2, .receipt-body, .receipt-footer, .receipt-footer2, .print-service-receipt .banner {
        line-height: 1.57;
    }
    .receipt-header1-padding-top {
        height: 26px;
    }
    .receipt-header1-padding-bottom {
        height: 20px;
    }
    .receipt-header1-logo-text {
        vertical-align:bottom;
        width:120px
    }
    .receipt-header1-logo-text span {
        font-size:24px;
        color:#0069b3;
        display:inline-block;
        line-height:1;
    }
    .receipt-header1-sitetext {
        text-align: right;
    }
    .receipt-footer td.receipt-footer {
        padding-top: 10px;
        padding-bottom: 15px;
    }
    .receipt-footer2 td.receipt-footer2 {
        padding-bottom: 30px;
        padding-top: 10px;
    }
    .receipt-header2 td.receipt-header2, .receipt-body td.receipt-body {
        padding-bottom: 15px;
        padding-top: 22px;
    }
\t.receipt-name-1054, .receipt-value-1054 {
\t\tpadding-bottom: 20px
\t}

    .receipt-company-name {
        font-size: 16px;
        line-height: 1.38;
    }

    .receipt-company-name .receipt-row-1 { text-align: left; }
    .receipt-company-name-padding { height:30px; }

    .receipt-delimiter {
        background-position-x: center;
            background-image: url(http://files.taxcom.ru/files/cashdesk/images/background-copy-3.png);
        background-repeat: no-repeat;
        clear: both;
        height: 9px;
        margin-bottom: 30px;
        margin-top: 20px;
        width: 100%;
    }

    .receipt-value-1054 {
        color: #0069b3;
        display: inline-block;
        font-size: 24px;
        font-weight: bold;
        line-height: 1.17;
    }

    .receipt-value-1030 {
        color: #0069b3;
        display: block;
        font-size: 18px;
        font-weight: bold;
        line-height: 1.22;
        text-align: left;
    }

    .dropdown-1162 a {
        font-size: 12px;
        position: relative;
        right: -12px;
        color: #0069b3;
        cursor: pointer;
   }
    .dropdown-1162 a:after {
        content:'\\25BC';
    }
    .dropdown-1162[opened='true'] a:after {
        content:'\\25B2';
    }
    .dropdown-1162 div {
\t\tdisplay: none;
    }
    .dropdown-1162[opened='true'] div {
\t\tdisplay: block;
\t\tword-break: break-all;
        color: #45545e;
    }

    .receipt-delimiter2 {
        clear: both;
        margin-bottom: 13px;
        margin-top: 14px;
        width: 100%;
        border: 1px solid #d5dbe6;
   }

    .receipt-name-1020, .receipt-value-1020 {
        color: #0069b3;
        display: block;
        font-size: 20px;
        font-weight: bold;
        line-height: 1.4;
        margin-bottom: 30px;
    }


    .receipt-delimiter3 {
        background: white;
        height: 20px;
    }

    .receipt-title {
        display: block;
        font-size: 30px;
        font-weight: bold;
        line-height: 1;
    }

    .receipt-header1 {
        background-color: #ffffff;
    }

    .receipt-header1 table {
        background-color: #ffffff;
    }
    .receipt-header1-appeal span {
        text-align: center;
    }
    .receipt-header1-appeal-padding {
        height: 25px;
    }
    .receipt-header1-greeting-padding {
        height: 30px
    }

    .receipt-border1 {
        background-color: #f0f3f5;
    }

    .receipt-border1 table {
        background-color: #f0f3f5;
    }

    .receipt-thanks {
        font-size: 24px;
        font-weight: bold;
        line-height: 1;
    }

    .receipt-subtitle {
        display: block;
        font-size: 18px;
    }

    .receipt-footer2 {
        background-color: #ffffff;
    }
    .receipt-footer, .receipt-footer table {
        background-color: #ffffff;
    }
    .receipt-footer2 table{
        background-color: #ffffff;
    }
    .receipt-footer2-qr {
        vertical-align: bottom; 
        text-align: right;
    }
    .receipt-footer2-service {
        vertical-align: bottom;
    }

    .print-service-receipt td { vertical-align: middle; }

    .banner {
        padding-left: 42px;
        padding-right: 42px;
    }
    .banner-title {
        font-size: 24px;
        text-align: center;
    }
    .banner-text {
        text-align: center;
        width: 424px;
    }
    .banner-button {
        text-align: center;
    }
    .banner-button a {
        border: solid 1px #0069b3;
        padding: 10px;
        display: inline-block;
    }

    .receipt-banner-bottom-image {
        margin-top: -7px;
        border-bottom: solid 1px #d4dae6;
    }
    .receipt-content-width {
        max-width: 424px;
        text-align: center;
    }

</style>
<table cellspacing="0" cellpadding="0" class="print-service-receipt" lang="ru">
    <tr>
        <td>
            <table cellspacing="0" cellpadding="0" style="width:508px">
                <tr>
                    <td style="text-align: center;">
                        <div style="font-size:14px;width:400px;margin:5px auto;padding:0px">
                            <text>
                                <h2 style="font-size:21px;padding:7px 0px;margin:0px;margin-top:0px;display:block;">Уважаемый клиент!</h2>
                                <p style="font-size:14px;padding:11px 0px 14px 0px;margin:0px;line-height:1;">Получи подарок-скидку в магазинах наших партнеров!</p>
                                <a href="https://get4click.ru/ext/C4TBCVMZ" style="display:inline-block;background:#008cd7;width:160px;height:20px;;margin:0px;padding:0px;text-decoration:none;border-radius:3px;">
                                    <span style="font-size:14px;display:block;color:#fff;margin:0px;padding:0px;padding-top:3px;line-height:1;">Выбрать подарок</span>
                                </a>
                            </text>
                        </div>
                    </td>
                </tr>
            </table>
\t        
<table class="receipt-header1">
    <tr><td class="receipt-header1-padding-top"></td></tr>
    <tr>
        <td width="22"></td>
        <td class="receipt-header1">
            <table>
                <tr>
                        <td class="receipt-header1-logo" style="width:65px;">
                            <img src="http://files.taxcom.ru/files/cashdesk/images/kassa.png" />
                        </td>
                        <td class="receipt-header1-logo-text">
                            <span>Такском Касса</span>
                        </td>
                    <td class="receipt-header1-sitetext">
                        <a target="_blank" href=""></a>
                    </td>
                </tr>
            </table>
        </td>
        <td width="42"></td>
    </tr>
</table>
<table class="receipt-header1">
    <tr>
        <td class="side-padding"></td>
        <td class="receipt-header1">
            <div class="receipt-row-1">
                <table>
                    <tr>
                        <td class="receipt-header1-appeal-padding"></td>
                    </tr>
                    <tr>
                        <td class="receipt-header1-appeal receipt-content-width">
                            <span class="receipt-subtitle">
                                
                                    <b>ООО &quot;Алтфарм&quot;</b>
                            </span>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="receipt-row-1 receipt-company-name">
                <table>
                    <tr>
                        <td class="receipt-company-name-padding"></td>
                    </tr>
                    <tr>
                        <td style="padding-right: 0px">
                        </td>
                        <td style="width: 100%;">
                                <div class="receipt-row-1">
                                    <span class="value receipt-value-1018">ИНН 2221025247  </span>
                                </div>
                                                            <div class="receipt-row-1">
                                    <span class="value receipt-value-1009">656037, Алтайский край,г. Барнаул,ул.Чудненко,д. 13.</span>
                                </div>
                                                            <div class="receipt-row-1">
                                    <span class="value receipt-value-1187">
                <span style="word-break:break-all;">Аптека &nbsp;</span>

                                    </span>
                                </div>
                        </td>
                    </tr>
                </table>
            </div>
        </td>
        <td class="side-padding"></td>
    </tr>
    <tr><td class="receipt-header1-padding-bottom"></td></tr>
</table>


                            <svg xmlns="http://www.w3.org/2000/svg" height="17" viewBox="0 0 508 17" style="margin-top: -7px;">
                    <path fill="#f0f3f5" fill-rule="evenodd" d="M0 0l13.368 5.593L26.737 0l13.368 5.593L53.474 0l13.368 5.593L80.211 0l13.368 5.593L106.947 0l13.369 5.593L133.684 0l13.369 5.593L160.42 0l13.368 5.593L187.158 0l13.368 5.593L213.895 0l13.368 5.593L240.632 0 254 5.593 267.368 0l13.369 5.593L294.105 0l13.369 5.593L320.842 0l13.369 5.593L347.579 0l13.368 5.593L374.316 0l13.368 5.593L401.053 0l13.368 5.593L427.79 0l13.369 5.593L454.526 0l13.369 5.593L481.263 0l13.369 5.593L508 0v17.688H0z" />
                </svg>
        <div class="receipt-border1">
            <table class="receipt-header2">
                <tr>
                    <td class="side-padding"></td>
                    <td class="receipt-header2">
                        <table class="receipt-row-2">
                            <tr>
                                <td class="receipt-col1">
                                        <span class="name receipt-name-1042">КАССОВЫЙ ЧЕК №</span>
                                        <span class="value receipt-value-1042">70</span>
                                </td>
                                <td class="receipt-col2">
                                        <span class="value receipt-value-1012">12.05.2019 17:32</span>
                                </td>
                            </tr>
                        </table>
                            <table class="receipt-row-2">
                                <tr>
                                    <td class="receipt-col1">
                                        <span class="name receipt-name-1038">№ СМЕНЫ</span>
                                    </td>
                                    <td class="receipt-col2">
                                        <span class="value receipt-value-1038">5</span>
                                    </td>
                                </tr>
                            </table>
                                                    <table class="receipt-row-2">
                                <tr>
                                    <td class="receipt-col1">
                                        <span class="name receipt-name-1021">КАССИР</span>
                                    </td>
                                    <td class="receipt-col2">
                                        <span class="value receipt-value-1021">ПашковаЕЮ</span>
                                    </td>
                                </tr>
                            </table>
                    </td>
                    <td class="side-padding"></td>
                </tr>
            </table>

            <div class="receipt-delimiter"></div>
                <table class="receipt-body">
                    <tr>
                        <td class="side-padding"></td>
                        <td class="receipt-body" style="">
    <table class="receipt-row-1">
        <tr>
            <td>
                <span class="value receipt-value-1054">ПРИХОД</span>
            </td>
        </tr>
    </table>
<div class="items">

<div class="item">
    <table class="receipt-row-1">
        <tr>
            <td style="text-align: left">
                <span class="value receipt-value-1030">
                    СИРДАЛУД 4МГ ТБ №30
                </span>
            </td>
        </tr>
    </table>
<table class="receipt-row-2">
    <tr>
        <td class="receipt-col1">
                <span class="value receipt-value-1023">1</span>
                x
                <span class="value receipt-value-1079">322.50</span>
        </td>
        <td class="receipt-col2">
                <span class="value receipt-value-1043">322.50</span>
        </td>
    </tr>
</table>



    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1214">Признак способа расчета</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1214">ПОЛНЫЙ РАСЧЕТ</span>
            </td>
        </tr>
    </table>
    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1212">Признак предмета расчета</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1212">ТОВАР</span>
            </td>
        </tr>
    </table>
<div style="clear: both"></div>
<hr class="receipt-delimiter2">
</div>
                <table class="receipt-row-2">
            <tr>
                <td class="receipt-col1">
                    <span class="name receipt-name-1020">ИТОГ</span>
                </td>
                <td class="receipt-col2">
                    <span class="value receipt-value-1020">322.50</span>
                </td>
            </tr>
        </table>
</div>
                        </td>
                        <td class="side-padding"></td>
                    </tr>
                </table>

                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 508 20" style="margin-bottom: -7px;">
                    <path fill="#ffffff" fill-rule="evenodd" d="M0 0l13.368 8.198L26.737 0l13.368 8.198L53.474 0l13.368 8.198L80.211 0l13.368 8.198L106.947 0l13.369 8.198L133.684 0l13.369 8.198L160.42 0l13.368 8.198L187.158 0l13.368 8.198L213.895 0l13.368 8.198L240.632 0 254 8.198 267.368 0l13.369 8.198L294.105 0l13.369 8.198L320.842 0l13.369 8.198L347.579 0l13.368 8.198L374.316 0l13.368 8.198L401.053 0l13.368 8.198L427.79 0l13.369 8.198L454.526 0l13.369 8.198L481.263 0l13.369 8.198L508 0v19.5H0z" />
                </svg>
        </div>
            <table class="receipt-footer">
                <tr>
                    <td class="side-padding"></td>
                    <td class="receipt-footer">


    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1031">НАЛИЧНЫМИ</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1031">0.00</span>
            </td>
        </tr>
    </table>
    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1081">БЕЗНАЛИЧНЫМИ</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1081">322.50</span>
            </td>
        </tr>
    </table>



    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1105">СУММА БЕЗ НДС</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1105">322.50</span>
            </td>
        </tr>
    </table>
<div style="clear: both"></div>
    <hr class="receipt-delimiter2">

    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1117">ЭЛ. АДР. ОТПРАВИТЕЛЯ</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1117">
        <a href="mailto:noreply@taxcom.ru">noreply@taxcom.ru</a>

                </span>
            </td>
        </tr>
    </table>
<div style="clear: both"></div>
    <hr class="receipt-delimiter2">
    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1060">САЙТ ФНС</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1060">
www.nalog.ru
                </span>
            </td>
        </tr>
    </table>
    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1055">Система НО</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1055">ЕНВД</span>
            </td>
        </tr>
    </table>
    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1037">Рег.№ ККТ</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1037">0001764573032355    </span>
            </td>
        </tr>
    </table>
    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1041">Зав.№ ФН</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1041">9283440300110611</span>
            </td>
        </tr>
    </table>
    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1040">№ ФД</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1040">430</span>
            </td>
        </tr>
    </table>
    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1209">№ версии ФФД</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1209">1.05</span>
            </td>
        </tr>
    </table>
    <table class="receipt-row-2">
        <tr>
            <td class="receipt-col1">
                <span class="name receipt-name-1077">ФПД</span>
            </td>
            <td class="receipt-col2">
                <span class="value receipt-value-1077">571333283</span>
            </td>
        </tr>
    </table>
                    </td>
                    <td class="side-padding"></td>
                </tr>
            </table>
                <table class="receipt-footer2">
                    <tr>
                        <td class="side-padding"></td>
                        <td class="receipt-footer2">
                            <table>
                                <tr>
                                    <td class="receipt-footer2-service">
                                            <img src="http://files.taxcom.ru/files/cashdesk/images/taxcom-logo-2.png" />
                                        <br />Сервис проверки чеков:<br /> <a target="_blank" href="https://receipt.taxcom.ru">https://receipt.taxcom.ru</a>
                                    </td>
                                    <td class="receipt-footer2-qr">
<svg version="1.1" baseProfile="full" shape-rendering="crispEdges" width="176" height="176" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="176" height="176" fill="#FFFFFF" />
<rect x="0" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="0" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="4.75675675675676" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="61.8378378378378" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="9.51351351351351" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="14.2702702702703" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="19.027027027027" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="23.7837837837838" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="28.5405405405405" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="33.2972972972973" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="33.2972972972973" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="33.2972972972973" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="33.2972972972973" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="33.2972972972973" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="33.2972972972973" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="33.2972972972973" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="38.0540540540541" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="33.2972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="42.8108108108108" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="47.5675675675676" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="33.2972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="61.8378378378378" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="52.3243243243243" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="33.2972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="57.0810810810811" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="61.8378378378378" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="61.8378378378378" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="66.5945945945946" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="33.2972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="61.8378378378378" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="71.3513513513514" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="76.1081081081081" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="80.8648648648649" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="61.8378378378378" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="85.6216216216216" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="33.2972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="90.3783783783784" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="33.2972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="61.8378378378378" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="95.1351351351351" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="33.2972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="99.8918918918919" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="104.648648648649" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="109.405405405405" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="109.405405405405" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="109.405405405405" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="109.405405405405" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="109.405405405405" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="109.405405405405" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="109.405405405405" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="109.405405405405" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="109.405405405405" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="109.405405405405" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="109.405405405405" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="114.162162162162" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="61.8378378378378" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="118.918918918919" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="61.8378378378378" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="123.675675675676" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="33.2972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="61.8378378378378" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="128.432432432432" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="33.2972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="133.189189189189" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="137.945945945946" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="142.702702702703" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="61.8378378378378" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="147.459459459459" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="66.5945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="152.216216216216" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="61.8378378378378" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="123.675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="156.972972972973" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="52.3243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="161.72972972973" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="42.8108108108108" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="99.8918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="104.648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="109.405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="114.162162162162" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="133.189189189189" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="147.459459459459" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="156.972972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="166.486486486486" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="0" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="4.75675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="9.51351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="14.2702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="19.027027027027" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="23.7837837837838" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="28.5405405405405" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="38.0540540540541" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="47.5675675675676" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="57.0810810810811" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="71.3513513513514" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="76.1081081081081" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="80.8648648648649" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="85.6216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="90.3783783783784" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="95.1351351351351" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="118.918918918919" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="128.432432432432" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="137.945945945946" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="142.702702702703" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="152.216216216216" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="161.72972972973" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="166.486486486486" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
<rect x="171.243243243243" y="171.243243243243" width="4.75675675675676" height="4.75675675675676" fill="#000000" />
</svg>                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td class="side-padding"></td>
                    </tr>
                </table>
                    <div class="receipt-thanks" style="height: 126px; position: relative; text-align: center; margin-top: -7px;">
                        <svg xmlns="http://www.w3.org/2000/svg" height="126" viewBox="0 0 508 126">
                            <path fill="#0069b3" fill-rule="evenodd" d="M508 0v126l-13.368-6.71-13.369 6.71-13.368-6.71-13.369 6.71-13.368-6.71-13.369 6.71-13.368-6.71-13.368 6.71-13.369-6.71-13.368 6.71-13.369-6.71L347.58 126l-13.368-6.71-13.369 6.71-13.368-6.71-13.369 6.71-13.368-6.71-13.369 6.71L254 119.29 240.632 126l-13.369-6.71-13.368 6.71-13.369-6.71-13.368 6.71-13.369-6.71-13.368 6.71-13.368-6.71-13.369 6.71-13.368-6.71-13.369 6.71-13.368-6.71L80.21 126l-13.369-6.71L53.474 126l-13.369-6.71L26.737 126l-13.369-6.71L0 126V0l13.368 6.681L26.737 0l13.368 6.681L53.474 0l13.368 6.681L80.211 0l13.368 6.681L106.947 0l13.369 6.681L133.684 0l13.369 6.681L160.42 0l13.368 6.681L187.158 0l13.368 6.681L213.895 0l13.368 6.681L240.632 0 254 6.681 267.368 0l13.369 6.681L294.105 0l13.369 6.681L320.842 0l13.369 6.681L347.579 0l13.368 6.681L374.316 0l13.368 6.681L401.053 0l13.368 6.681L427.79 0l13.369 6.681L454.526 0l13.369 6.681L481.263 0l13.369 6.681z" />
                        </svg>
                        <div style="height: 126px; position: absolute; top: 0; width: 508px;">
                            <div style="max-width: 508px; color: #ffffff; display: table-cell; display: table-cell; height: 126px; text-align: center; vertical-align: middle; width: 508px;">
                                СПАСИБО
                            </div>
                        </div>
                    </div>
                    </td>
    </tr>
</table>




                    </div>

                        <script>
                            document.getElementById("printButtonPDF").style.display = "block";
                        </script>
<form action="/v01/show" class="form" method="post" style="max-width: 350px;"><input id="ReceiptId" name="ReceiptId" type="hidden" value="4F8CCF79-5C99-478E-8314-21B315C255C5" /><input data-val="true" data-val-required="The Found field is required." id="Found" name="Found" type="hidden" value="True" /><input data-val="true" data-val-maxlength="Слишком длинная строка" data-val-maxlength-max="13" data-val-minlength="Слишком короткая строка" data-val-minlength-min="3" data-val-regex="Допустимы только цифры" data-val-regex-pattern="^\\d+" data-val-required="Поле обязательно для заполнения" id="FiscalSign" name="FiscalSign" type="hidden" value="571333283" /><input data-val="true" data-val-maxlength="Слишком длинная строка" data-val-maxlength-max="10" data-val-regex="Допустимы только цифры" data-val-regex-pattern="^\\d+" id="DocumentFiscalNumber" name="DocumentFiscalNumber" type="hidden" value="430" /><input data-val="true" data-val-date="The field ReceiptDate must be a date." data-val-required="The ReceiptDate field is required." id="ReceiptDate" name="ReceiptDate" type="hidden" value="5/12/2019 5:32:00 PM" />                            <div class="form-group">
                                <label for="email">Вы можете отправить чек на свой email:</label>
                                <div class="row">
                                    <input class="form-control-inline  col-xs-12 col-md-8 col-lg-8" id="email" maxlength="255" name="Email" placeholder="Адрес вашей электронной почты" style="margin-bottom: 10px;" type="text" value="" />
                                    <div class="col-xs-12 col-md-4 col-lg-4">
                                        <button type="submit" class="btn btn-default  btn-send-slip">
                                            Отправить
                                        </button>
                                    </div>
                                    <label style="color: red;"></label>
                                </div>
                            </div>
</form><div class="receipt-notification">
    <p>
        Наличие чека в базе оператора фискальных данных подтверждает, что продавец при расчетах применил контрольно-кассовую технику в соответствии с требованиями Федерального закона от 22.05.2003 №54-ФЗ.
    </p>
    <p class="receipt-deltext">
        Важно! Если у Вас есть вопросы по чеку, нажмите <a href="/v01/customerInfo?id=4F8CCF79-5C99-478E-8314-21B315C255C5" target="_blank">сюда</a>.
    </p>
</div>                        <div class="form" style="max-width: 350px;">
                            <div class="form-group clearfix" style="margin-top: 60px">
                                <div class="row">
                                    <button onclick="location.href = '/'" class="btn btn-primary  col-xs-12 col-md-12 col-lg-12">
                                        Проверить другой чек
                                    </button>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
    </div>

</div><!--/.grid-container-->

<script src="/Scripts/ismobile.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function(e) {
        if (isMobile()) document.documentElement.classList.add("mobile");
    }, false);
</script>


            </div><!--/.wrapper-->
        </div><!--/.main-->
    
        <footer class="footer" id="footer_no_print">
            <div class="wrapper">
                <div class="grid-container justify-container">
                    <div class="footer-cont-1 justify-item">
                        <div class="footer-logo">
                            <a href="http://taxcom.ru" target="_blank"><img src="/Content/Images/logo-taxcom-2.png" width="55" height="22" alt="Такском"></a>
                        </div>
                        <div class="colophon">
                            <div class="copyright">2016 - 2020 © ООО «Такском»</div>
                            <div class="version">Версия 1.1</div>
                        </div>
                    </div>
                    <div class="footer-menu justify-item">
                        <ul>
                            <li><a href="http://kkt-taxcom.ru/" target="_blank">Помощь</a></li>
                            <li><a href="http://kkt-taxcom.ru/" target="_blank">О сервисе</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
        <script>
            if ($('#about_serv').length == 0) {
                $('#footer_no_print').hide();
            }
        </script>
    </body>
</html>`;