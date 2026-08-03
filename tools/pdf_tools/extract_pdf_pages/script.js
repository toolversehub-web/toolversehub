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

const pageInput =
document.getElementById("pageInput");

const sortPages =
document.getElementById("sortPages");

const removeDuplicates =
document.getElementById("removeDuplicates");

const ignoreInvalid =
document.getElementById("ignoreInvalid");

const reverseRange =
document.getElementById("reverseRange");

const extractBtn =
document.getElementById("extractBtn");

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

    dropArea.style.borderColor =
    "#60a5fa";

}

);

dropArea.addEventListener(

"dragleave",

()=>{

    dropArea.style.borderColor =
    "#38bdf8";

}

);

dropArea.addEventListener(

"drop",

(event)=>{

    event.preventDefault();

    dropArea.style.borderColor =
    "#38bdf8";

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

        const bytes =
        await file.arrayBuffer();

        pdfDocument =
        await PDFLib.PDFDocument.load(bytes);

        fileName.textContent =
        file.name;

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
   VALIDATION
========================================== */

function validateInputs(){

    if(!selectedFile){

        alert("Please upload a PDF first.");

        return false;

    }

    if(pageInput.value.trim()===""){

        alert("Please enter page numbers.");

        pageInput.focus();

        return false;

    }

    return true;

}

/* ==========================================
   PAGE PARSER
========================================== */

function parsePages(input,totalPages){

    let pages=[];

    const parts=input.split(",");

    for(let item of parts){

        item=item.trim();

        if(item==="") continue;

        if(item.includes("-")){

            let[start,end]=
            item.split("-").map(Number);

            if(isNaN(start)||isNaN(end))
            continue;

            if(reverseRange.checked && start>end){

                [start,end]=[end,start];

            }

            for(let i=start;i<=end;i++){

                pages.push(i);

            }

        }

        else{

            const page=Number(item);

            if(!isNaN(page)){

                pages.push(page);

            }

        }

    }

    if(ignoreInvalid.checked){

        pages=pages.filter(

        p=>p>=1 && p<=totalPages

        );

    }

    if(removeDuplicates.checked){

        pages=[...new Set(pages)];

    }

    if(sortPages.checked){

        pages.sort((a,b)=>a-b);

    }

    return pages;

}
/* ==========================================
   EXTRACT PDF PAGES
========================================== */

extractBtn.addEventListener(

"click",

async()=>{

    if(!validateInputs()) return;

    try{

        const pdfBytes =
        await selectedFile.arrayBuffer();

        const sourcePdf =
        await PDFLib.PDFDocument.load(pdfBytes);

        const newPdf =
        await PDFLib.PDFDocument.create();

        const totalPages =
        sourcePdf.getPageCount();

        const selectedPages =
        parsePages(
            pageInput.value,
            totalPages
        );

        if(selectedPages.length===0){

            alert(
                "No valid pages found."
            );

            return;

        }

        for(const pageNumber of selectedPages){

            if(pageNumber<1 || pageNumber>totalPages){

                continue;

            }

            const copiedPages =
            await newPdf.copyPages(

                sourcePdf,

                [pageNumber-1]

            );

            newPdf.addPage(

                copiedPages[0]

            );

        }

        if(newPdf.getPageCount()===0){

            alert(
                "No valid pages were extracted."
            );

            return;

        }

        
        /* ==========================================
   SAVE & DOWNLOAD
========================================== */

        const outputBytes =
        await newPdf.save();

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

        link.href =
        url;

        link.download =
        selectedFile.name.replace(

            ".pdf",

            "_extracted.pdf"

        );

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }

    catch(error){

        console.error(error);

        alert(

            "Something went wrong while extracting pages."

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

        pageInput.value = "";

        sortPages.checked = true;

        removeDuplicates.checked = true;

        ignoreInvalid.checked = true;

        reverseRange.checked = true;

    }

);

/* ==========================================
   INITIALIZE
========================================== */

sortPages.checked = true;

removeDuplicates.checked = true;

ignoreInvalid.checked = true;

reverseRange.checked = true;