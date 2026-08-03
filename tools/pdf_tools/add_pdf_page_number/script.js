/* ==========================================
   ELEMENTS
========================================== */

const dropArea =
document.getElementById("dropArea");

const pdfInput =
document.getElementById("pdfInput");

const fileName =
document.getElementById("fileName");

const fileSize =
document.getElementById("fileSize");

const pageCount =
document.getElementById("pageCount");

const startNumber =
document.getElementById("startNumber");

const position =
document.getElementById("position");

const fontSize =
document.getElementById("fontSize");

const fontSizeValue =
document.getElementById("fontSizeValue");

const fontColor =
document.getElementById("fontColor");

const margin =
document.getElementById("margin");

const marginValue =
document.getElementById("marginValue");

const fontStyle =
document.getElementById("fontStyle");

const numberFormat =
document.getElementById("numberFormat");

const addNumbersBtn =
document.getElementById("addNumbersBtn");

const resetBtn =
document.getElementById("resetBtn");

/* ==========================================
   VARIABLES
========================================== */

let selectedFile = null;

let pdfDocument = null;

/* ==========================================
   FILE INPUT
========================================== */

pdfInput.addEventListener(

"change",

(event)=>{

    if(event.target.files.length){

        loadPDF(

        event.target.files[0]

        );

    }

}

);

/* ==========================================
   DRAG & DROP
========================================== */

dropArea.addEventListener(

"dragover",

(event)=>{

    event.preventDefault();

    dropArea.style.borderColor="#60a5fa";

}

);

dropArea.addEventListener(

"dragleave",

()=>{

    dropArea.style.borderColor="#38bdf8";

}

);

dropArea.addEventListener(

"drop",

(event)=>{

    event.preventDefault();

    dropArea.style.borderColor="#38bdf8";

    if(event.dataTransfer.files.length){

        loadPDF(

        event.dataTransfer.files[0]

        );

    }

}

);

dropArea.addEventListener(

"click",

()=>{

    pdfInput.click();

}

);
/* ==========================================
   LOAD PDF
========================================== */

async function loadPDF(file){

    if(file.type !== "application/pdf"){

        alert("Please select a valid PDF file.");

        return;

    }

    try{

        selectedFile = file;

        const bytes = await file.arrayBuffer();

        pdfDocument = await PDFLib.PDFDocument.load(bytes);

        fileName.textContent = file.name;

        fileSize.textContent =
        (file.size / 1024 / 1024).toFixed(2) + " MB";

        pageCount.textContent =
        pdfDocument.getPageCount();

    }

    catch(error){

        console.error(error);

        alert("Unable to open this PDF.");

    }

}

/* ==========================================
   FONT SIZE
========================================== */

fontSize.addEventListener(

    "input",

    ()=>{

        fontSizeValue.textContent =
        fontSize.value + " px";

    }

);

/* ==========================================
   PAGE MARGIN
========================================== */

margin.addEventListener(

    "input",

    ()=>{

        marginValue.textContent =
        margin.value + " px";

    }

);

/* ==========================================
   VALIDATION
========================================== */

function validateInputs(){

    if(!selectedFile){

        alert("Please upload a PDF first.");

        return false;

    }

    if(startNumber.value < 1){

        alert("Starting number must be at least 1.");

        startNumber.focus();

        return false;

    }

    return true;

}
/* ==========================================
   ADD PAGE NUMBERS
========================================== */

addNumbersBtn.addEventListener(

"click",

async()=>{

    if(!validateInputs()) return;

    try{

        const pdfBytes =
        await selectedFile.arrayBuffer();

        const pdf =
        await PDFLib.PDFDocument.load(pdfBytes);

        let font;

        switch(fontStyle.value){

            case "Helvetica-Bold":

                font =
                await pdf.embedFont(
                PDFLib.StandardFonts.HelveticaBold
                );

                break;

            case "Courier":

                font =
                await pdf.embedFont(
                PDFLib.StandardFonts.Courier
                );

                break;

            case "TimesRoman":

                font =
                await pdf.embedFont(
                PDFLib.StandardFonts.TimesRoman
                );

                break;

            default:

                font =
                await pdf.embedFont(
                PDFLib.StandardFonts.Helvetica
                );

        }

        const pages =
        pdf.getPages();

        let number =
        parseInt(startNumber.value);

        const size =
        parseInt(fontSize.value);

        const space =
        parseInt(margin.value);

        const hex =
        fontColor.value.replace("#","");

        const r =
        parseInt(hex.substring(0,2),16)/255;

        const g =
        parseInt(hex.substring(2,4),16)/255;

        const b =
        parseInt(hex.substring(4,6),16)/255;

        for(const page of pages){

           const width =
page.getWidth();

const height =
page.getHeight();

let text;

switch(numberFormat.value){

    case "page":

        text = `Page ${number}`;

        break;

    case "dash":

        text = `- ${number} -`;

        break;

    case "total":

        text = `${number} / ${pages.length}`;

        break;

    case "pageOf":

        text = `Page ${number} of ${pages.length}`;

        break;

    default:

        text = number.toString();

}

const textWidth =
font.widthOfTextAtSize(text,size);


            let x = 0;

            let y = 0;

            switch(position.value){

                case "bottomCenter":

                    x = (width-textWidth)/2;

                    y = space;

                    break;

                case "bottomLeft":

                    x = space;

                    y = space;

                    break;

                case "bottomRight":

                    x = width-textWidth-space;

                    y = space;

                    break;

                case "topCenter":

                    x = (width-textWidth)/2;

                    y = height-space-size;

                    break;

                case "topLeft":

                    x = space;

                    y = height-space-size;

                    break;

                case "topRight":

                    x = width-textWidth-space;

                    y = height-space-size;

                    break;

            }

            page.drawText(

                text,

                {

                    x:x,

                    y:y,

                    size:size,

                    font:font,

                    color:PDFLib.rgb(r,g,b)

                }

            );

            number++;

        }
        /* ==========================================
   SAVE & DOWNLOAD
========================================== */

        const outputBytes =
        await pdf.save();

        const blob =
        new Blob(
            [outputBytes],
            {
                type:"application/pdf"
            }
        );

        const url =
        URL.createObjectURL(blob);

        const link =
        document.createElement("a");

        link.href = url;

        link.download =
        selectedFile.name.replace(
            ".pdf",
            "_numbered.pdf"
        );

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }

    catch(error){

        console.error(error);

        alert(
            "Something went wrong while adding page numbers."
        );

    }

});

/* ==========================================
   RESET
========================================== */

resetBtn.addEventListener(

    "click",

    ()=>{

        selectedFile = null;

        pdfDocument = null;

        pdfInput.value = "";

        fileName.textContent = "None";

        fileSize.textContent = "0 MB";

        pageCount.textContent = "0";

        startNumber.value = 1;

        position.value = "bottomCenter";

        fontSize.value = 16;

        fontSizeValue.textContent = "16 px";

        fontColor.value = "#000000";

        margin.value = 25;

        marginValue.textContent = "25 px";

        fontStyle.value = "Helvetica";

        numberFormat.value = "number";

    }

);

/* ==========================================
   INITIALIZE
========================================== */

fontSizeValue.textContent =
fontSize.value + " px";

marginValue.textContent =
margin.value + " px";