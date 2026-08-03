/* ======================================================
                    ELEMENTS
====================================================== */

const uploadBox = document.getElementById("uploadBox");
const browseBtn = document.getElementById("browseBtn");
const pdfInput = document.getElementById("pdfInput");

const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const totalPages = document.getElementById("totalPages");

const pageInput = document.getElementById("pageInput");
const previewContainer = document.getElementById("previewContainer");

const convertBtn = document.getElementById("convertBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");


/* ======================================================
                    VARIABLES
====================================================== */

let pdfFile = null;
let pdfDocument = null;
let renderedImages = [];
let zipFile = null;


/* ======================================================
                    BROWSE PDF
====================================================== */

browseBtn.addEventListener("click", () => {

    pdfInput.click();

});


/* ======================================================
                    SELECT PDF
====================================================== */

pdfInput.addEventListener("change", async (event) => {

    if (!event.target.files.length) return;

    await loadPDF(event.target.files[0]);

});


/* ======================================================
                    DRAG & DROP
====================================================== */

uploadBox.addEventListener("dragover", (event) => {

    event.preventDefault();

    uploadBox.classList.add("drag");

});

uploadBox.addEventListener("dragleave", () => {

    uploadBox.classList.remove("drag");

});

uploadBox.addEventListener("drop", async (event) => {

    event.preventDefault();

    uploadBox.classList.remove("drag");

    if (!event.dataTransfer.files.length) return;

    await loadPDF(event.dataTransfer.files[0]);

});


/* ======================================================
                    LOAD PDF
====================================================== */

async function loadPDF(file){

    if(file.type!=="application/pdf"){

        alert("Please select a valid PDF.");

        return;

    }

    pdfFile=file;

    fileName.textContent=file.name;

    fileSize.textContent=

        (file.size/1024/1024).toFixed(2)+" MB";

    const buffer=await file.arrayBuffer();

    pdfDocument=

        await pdfjsLib.getDocument({

            data:buffer

        }).promise;

    totalPages.textContent=

        pdfDocument.numPages;

}


/* ======================================================
                    PAGE MODE
====================================================== */

document
.querySelectorAll(
'input[name="convertMode"]'
)
.forEach(radio=>{

    radio.addEventListener("change",()=>{

        pageInput.disabled=

        radio.value!=="selected" ||

        !radio.checked;

        if(pageInput.disabled){

            pageInput.value="";

        }

    });

});
/* ======================================================
                    PAGE PARSER
====================================================== */

function getSelectedPages(input, totalPages){

    const pages = new Set();

    if(!input.trim()){

        return [];

    }

    const items = input.split(",");

    items.forEach(item=>{

        item = item.trim();

        if(item.includes("-")){

            let [start,end] = item.split("-").map(Number);

            if(isNaN(start) || isNaN(end)){

                return;

            }

            if(start > end){

                [start,end] = [end,start];

            }

            for(let i=start;i<=end;i++){

                if(i>=1 && i<=totalPages){

                    pages.add(i);

                }

            }

        }

        else{

            const page = Number(item);

            if(!isNaN(page) && page>=1 && page<=totalPages){

                pages.add(page);

            }

        }

    });

    return [...pages].sort((a,b)=>a-b);

}


/* ======================================================
                    CONVERT TO JPG
====================================================== */

convertBtn.addEventListener("click", async()=>{

    if(!pdfDocument){

        alert("Please upload a PDF first.");

        return;

    }

    renderedImages = [];

    previewContainer.innerHTML = "";

    convertBtn.disabled = true;

    convertBtn.textContent = "Converting...";

    try{

        const quality = Number(
            document.querySelector(
                'input[name="quality"]:checked'
            ).value
        );

        const mode =
            document.querySelector(
                'input[name="convertMode"]:checked'
            ).value;

        let pages = [];

        if(mode === "all"){

            for(let i=1;i<=pdfDocument.numPages;i++){

                pages.push(i);

            }

        }

        else{

            pages = getSelectedPages(
                pageInput.value,
                pdfDocument.numPages
            );

            if(pages.length===0){

                alert("Please enter valid page numbers.");

                convertBtn.disabled = false;

                convertBtn.textContent = "Convert to JPG";

                return;

            }

        }

        for(const pageNumber of pages){

            const page =
                await pdfDocument.getPage(pageNumber);

            const viewport =
                page.getViewport({scale:2});

            const canvas =
                document.createElement("canvas");

            const ctx =
                canvas.getContext("2d");

            canvas.width = viewport.width;

            canvas.height = viewport.height;

            await page.render({

                canvasContext:ctx,

                viewport

            }).promise;

            const imageData =
                canvas.toDataURL(
                    "image/jpeg",
                    quality
                );

            renderedImages.push({

                page:pageNumber,

                data:imageData

            });

        }

        showPreview();

downloadBtn.disabled = false;

alert("PDF converted successfully.");

    }

    catch(error){

        console.error(error);

        alert("Conversion failed.");

    }

    convertBtn.disabled = false;

    convertBtn.textContent = "Convert to JPG";

});
/* ======================================================
                    SHOW PREVIEW
====================================================== */

function showPreview(){

    previewContainer.innerHTML = "";

    renderedImages.forEach((item,index)=>{

        const card = document.createElement("div");

        card.className = "preview-item";

        card.innerHTML = `

            <img src="${item.data}" alt="Page ${item.page}">

            <div class="preview-content">

                <div class="preview-title">

                    Page ${item.page}

                </div>

                <button
                    class="download-single"
                    data-index="${index}">

                    Download JPG

                </button>

            </div>

        `;

        previewContainer.appendChild(card);

    });

}



/* ======================================================
                    DOWNLOAD SINGLE JPG
====================================================== */

previewContainer.addEventListener("click",(event)=>{

    if(!event.target.classList.contains("download-single")){

        return;

    }

    const index = Number(event.target.dataset.index);

    const image = renderedImages[index];

    const link = document.createElement("a");

    link.href = image.data;

    link.download = `page-${image.page}.jpg`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

});


/* ======================================================
                    DOWNLOAD ZIP
====================================================== */

downloadBtn.addEventListener("click",async()=>{

    if(renderedImages.length===0){

        alert("Please convert the PDF first.");

        return;

    }

    const zip = new JSZip();

    renderedImages.forEach((item)=>{

        const base64 = item.data.split(",")[1];

        zip.file(

            `page-${item.page}.jpg`,

            base64,

            {base64:true}

        );

    });

    const content = await zip.generateAsync({

        type:"blob"

    });

    const url = URL.createObjectURL(content);

    const link = document.createElement("a");

    link.href = url;

    link.download = "ToolVerseHub-PDF-to-JPG.zip";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});


/* ======================================================
                    RESET
====================================================== */

resetBtn.addEventListener("click",()=>{

    pdfFile = null;

    pdfDocument = null;

    renderedImages = [];

    zipFile = null;

    pdfInput.value = "";

    fileName.textContent = "-";

    fileSize.textContent = "-";

    totalPages.textContent = "-";

    pageInput.value = "";

    pageInput.disabled = true;

    previewContainer.innerHTML = "";

    document.querySelector(

        'input[value="all"]'

    ).checked = true;

    document.querySelector(

        'input[name="quality"][value="1"]'

    ).checked = true;

    downloadBtn.disabled = true;

});


/* ======================================================
                    INITIALIZE
====================================================== */

downloadBtn.disabled = true;

console.log("PDF to JPG Tool Loaded Successfully");