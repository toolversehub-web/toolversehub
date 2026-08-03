/* ==========================================
   ELEMENTS
========================================== */

const dropArea =
document.getElementById("dropArea");

const pdfInput =
document.getElementById("pdfInput");

const fileName =
document.getElementById("fileName");

const pageCount =
document.getElementById("pageCount");

const startPage =
document.getElementById("startPage");

const endPage =
document.getElementById("endPage");

const splitBtn =
document.getElementById("splitBtn");

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

        const totalPages=

        pdfDocument.getPageCount();

        fileName.textContent=

        file.name;

        pageCount.textContent=

        totalPages;

        startPage.value=1;

        endPage.value=totalPages;

    }

    catch(error){

        console.error(error);

        alert(

        "Unable to read this PDF file."

        );

    }

}

/* ==========================================
   VALIDATE PAGE RANGE
========================================== */

function isValidRange(){

    if(!pdfDocument){

        alert(

        "Please upload a PDF first."

        );

        return false;

    }

    const start=

    parseInt(startPage.value);

    const end=

    parseInt(endPage.value);

    const total=

    pdfDocument.getPageCount();

    if(

        isNaN(start) ||

        isNaN(end)

    ){

        alert(

        "Please enter both page numbers."

        );

        return false;

    }

    if(

        start<1 ||

        end>total ||

        start>end

    ){

        alert(

        "Invalid page range."

        );

        return false;

    }

    return true;

}
/* ==========================================
   SPLIT PDF
========================================== */

splitBtn.addEventListener(

"click",

async()=>{

    if(!isValidRange()){

        return;

    }

    try{

        const start=

        parseInt(startPage.value)-1;

        const end=

        parseInt(endPage.value)-1;

        const newPdf=

        await PDFLib.PDFDocument.create();

        const pages=

        await newPdf.copyPages(

            pdfDocument,

            Array.from(

                {

                    length:end-start+1

                },

                (_,i)=>start+i

            )

        );

        pages.forEach(page=>{

            newPdf.addPage(page);

        });

        const pdfBytes=

        await newPdf.save();

        const blob=

        new Blob(

        [pdfBytes],

        {

            type:"application/pdf"

        }

        );

        const url=

        URL.createObjectURL(blob);

        const link=

        document.createElement("a");

        link.href=url;

        link.download=

        "split.pdf";

        link.click();

        URL.revokeObjectURL(url);

    }

    catch(error){

        console.error(error);

        alert(

        "Something went wrong while splitting the PDF."

        );

    }

}

/* ==========================================
   RESET
========================================== */

);

resetBtn.addEventListener(

"click",

()=>{

    selectedFile=null;

    pdfDocument=null;

    pdfInput.value="";

    fileName.textContent="None";

    pageCount.textContent="0";

    startPage.value="";

    endPage.value="";

}

);
