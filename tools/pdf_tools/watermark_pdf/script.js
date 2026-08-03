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

const watermarkText =
document.getElementById("watermarkText");

const fontSize =
document.getElementById("fontSize");

const fontSizeValue =
document.getElementById("fontSizeValue");

const textColor =
document.getElementById("textColor");

const opacity =
document.getElementById("opacity");

const opacityValue =
document.getElementById("opacityValue");

const rotation =
document.getElementById("rotation");

const position =
document.getElementById("position");

const watermarkBtn =
document.getElementById("watermarkBtn");

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

    if(file.type!=="application/pdf"){

        alert(

        "Please select a valid PDF file."

        );

        return;

    }

    try{

        selectedFile=file;

        const bytes=

        await file.arrayBuffer();

        pdfDocument=

        await PDFLib.PDFDocument.load(bytes);

        fileName.textContent=

        file.name;

        fileSize.textContent=

        (file.size/1024/1024).toFixed(2)+" MB";

        pageCount.textContent=

        pdfDocument.getPageCount();

    }

    catch(error){

        console.error(error);

        alert(

        "Unable to open this PDF."

        );

    }

}

/* ==========================================
   FONT SIZE
========================================== */

fontSize.addEventListener(

"input",

()=>{

    fontSizeValue.textContent=

    fontSize.value+" px";

}

);

/* ==========================================
   OPACITY
========================================== */

opacity.addEventListener(

"input",

()=>{

    opacityValue.textContent=

    opacity.value+"%";

}

);

/* ==========================================
   VALIDATION
========================================== */

function validateInputs(){

    if(!selectedFile){

        alert(

        "Please upload a PDF first."

        );

        return false;

    }

    if(

    watermarkText.value.trim()===""

    ){

        alert(

        "Please enter watermark text."

        );

        watermarkText.focus();

        return false;

    }

    return true;

}
/* ==========================================
   ADD WATERMARK
========================================== */

watermarkBtn.addEventListener(

"click",

async()=>{

    if(!validateInputs()) return;

    try{

        const pdfBytes=

        await selectedFile.arrayBuffer();

        const pdf=

        await PDFLib.PDFDocument.load(pdfBytes);

        const font=

        await pdf.embedFont(

        PDFLib.StandardFonts.HelveticaBold

        );

        const pages=

        pdf.getPages();

        const watermark=

        watermarkText.value.trim();

        const size=

        parseInt(fontSize.value);

        const alpha=

        parseInt(opacity.value)/100;

        const angle=

        PDFLib.degrees(

        parseInt(rotation.value)

        );

        const hex=

        textColor.value.replace("#","");

        const r=

        parseInt(hex.substring(0,2),16)/255;

        const g=

        parseInt(hex.substring(2,4),16)/255;

        const b=

        parseInt(hex.substring(4,6),16)/255;

        for(const page of pages){

            const width=

            page.getWidth();

            const height=

            page.getHeight();

            let x=0;

            let y=0;

            switch(position.value){

                case "center":

                   x = (width - font.widthOfTextAtSize(watermark, size)) / 2;

                    y=height/2;

                    break;

                case "topLeft":

                    x=30;

                    y=height-50;

                    break;

                case "topRight":

    x = width - font.widthOfTextAtSize(watermark, size) - 30;

    y = height - 50;

    break;

case "bottomRight":

    x = width - font.widthOfTextAtSize(watermark, size) - 30;

    y = 40;

    break;

            }

          page.drawText(
    watermark,
    {
        x: x,
        y: y,
        size: size,
        font: font,
        rotate: angle,
        color: PDFLib.rgb(r,g,b),
        opacity: alpha
    }
);

}

/* ==========================================
   SAVE & DOWNLOAD
========================================== */

        const outputBytes = await pdf.save();

        const blob = new Blob(
            [outputBytes],
            {
                type: "application/pdf"
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = selectedFile.name.replace(
            ".pdf",
            "_watermarked.pdf"
        );

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }

    catch(error){

        console.error(error);

        alert("Something went wrong while adding the watermark.");

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

        watermarkText.value = "";

        fontSize.value = 36;

        fontSizeValue.textContent = "36 px";

        textColor.value = "#ff0000";

        opacity.value = 40;

        opacityValue.textContent = "40%";

        rotation.value = "45";

        position.value = "center";

    }

);

/* ==========================================
   INITIALIZE
========================================== */

fontSizeValue.textContent =
fontSize.value + " px";

opacityValue.textContent =
opacity.value + "%";
