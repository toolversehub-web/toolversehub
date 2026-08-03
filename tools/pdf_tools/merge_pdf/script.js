/* ==========================================
   ELEMENTS
========================================== */

const dropArea=

document.getElementById(

"dropArea"

);

const pdfInput=

document.getElementById(

"pdfInput"

);

const fileList=

document.getElementById(

"fileList"

);

const fileCount=

document.getElementById(

"fileCount"

);

const totalSize=

document.getElementById(

"totalSize"

);

const mergeBtn=

document.getElementById(

"mergeBtn"

);

const resetBtn=

document.getElementById(

"resetBtn"

);

/* ==========================================
   VARIABLES
========================================== */

let pdfFiles=[];

/* ==========================================
   FILE INPUT
========================================== */

pdfInput.addEventListener(

"change",

(event)=>{

    addFiles(

    [...event.target.files]

    );

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

    addFiles(

    [...event.dataTransfer.files]

    );

}

);

dropArea.addEventListener(

"click",

()=>{

    pdfInput.click();

}

);
/* ==========================================
   ADD FILES
========================================== */

function addFiles(files){

    files.forEach(file=>{

        if(file.type!=="application/pdf"){

            alert(file.name+" is not a PDF file.");

            return;

        }

        const exists=

        pdfFiles.some(

        pdf=>pdf.name===file.name &&

        pdf.size===file.size

        );

        if(!exists){

            pdfFiles.push(file);

        }

    });

    updateFileList();

}

/* ==========================================
   UPDATE FILE LIST
========================================== */

function updateFileList(){

    fileList.innerHTML="";

    if(pdfFiles.length===0){

        fileList.innerHTML=

        `<p class="empty-message">

        No PDF files selected.

        </p>`;

        fileCount.textContent="0";

        totalSize.textContent="0 MB";

        return;

    }

    let total=0;

    pdfFiles.forEach((file,index)=>{

        total+=file.size;

        const item=

        document.createElement("div");

        item.className="file-item";

        item.innerHTML=`

        <div class="file-info">

        <span class="file-icon">

        📄

        </span>

        <div>

        <div class="file-name">

        ${file.name}

        </div>

        <div class="file-size">

        ${(file.size/1024/1024).toFixed(2)} MB

        </div>

        </div>

        </div>

        <button

        class="remove-file"

        onclick="removeFile(${index})">

        ✖

        </button>

        `;

        fileList.appendChild(item);

    });

    fileCount.textContent=

    pdfFiles.length;

    totalSize.textContent=

    (total/1024/1024).toFixed(2)+" MB";

}

/* ==========================================
   REMOVE FILE
========================================== */

function removeFile(index){

    pdfFiles.splice(index,1);

    updateFileList();

}
/* ==========================================
   MERGE PDF
========================================== */

mergeBtn.addEventListener(

"click",

async()=>{

    if(pdfFiles.length<2){

        alert(

        "Please select at least 2 PDF files."

        );

        return;

    }

    try{

        const mergedPdf=

        await PDFLib.PDFDocument.create();

        for(const file of pdfFiles){

            const bytes=

            await file.arrayBuffer();

            const pdf=

            await PDFLib.PDFDocument.load(bytes);

            const pages=

            await mergedPdf.copyPages(

                pdf,

                pdf.getPageIndices()

            );

            pages.forEach(page=>{

                mergedPdf.addPage(page);

            });

        }

        const mergedBytes=

        await mergedPdf.save();

        const blob=

        new Blob(

        [mergedBytes],

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

        "merged.pdf";

        link.click();

        URL.revokeObjectURL(url);

    }

    catch(error){

        console.error(error);

        alert(

        "Something went wrong while merging PDFs."

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

    pdfFiles=[];

    pdfInput.value="";

    updateFileList();

}

);

/* ==========================================
   INITIALIZE
========================================== */

updateFileList();