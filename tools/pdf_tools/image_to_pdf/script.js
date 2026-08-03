/* ======================================================
                    ELEMENTS
====================================================== */

const uploadBox = document.getElementById("uploadBox");
const browseBtn = document.getElementById("browseBtn");
const imageInput = document.getElementById("imageInput");

const previewContainer = document.getElementById("previewContainer");

const totalImages = document.getElementById("totalImages");
const totalSize = document.getElementById("totalSize");

const pageSize = document.getElementById("pageSize");
const margin = document.getElementById("margin");

const convertBtn = document.getElementById("convertBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");


/* ======================================================
                    VARIABLES
====================================================== */

let imageFiles = [];

let generatedPdf = null;


/* ======================================================
                    BROWSE
====================================================== */

browseBtn.addEventListener("click", () => {

    imageInput.click();

});


/* ======================================================
                    IMAGE SELECT
====================================================== */

imageInput.addEventListener("change", (event) => {

    addImages(event.target.files);

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

uploadBox.addEventListener("drop", (event) => {

    event.preventDefault();

    uploadBox.classList.remove("drag");

    addImages(event.dataTransfer.files);

});


/* ======================================================
                    ADD IMAGES
====================================================== */

function addImages(files){

    [...files].forEach(file=>{

        if(
            file.type==="image/jpeg" ||
            file.type==="image/png" ||
            file.type==="image/webp"
        ){

            imageFiles.push(file);

        }

    });

    updateInfo();

    renderPreview();

}


/* ======================================================
                    UPDATE INFO
====================================================== */

function updateInfo(){

    totalImages.textContent=imageFiles.length;

    let size=0;

    imageFiles.forEach(file=>{

        size+=file.size;

    });

    totalSize.textContent=

    (size/1024/1024).toFixed(2)+" MB";

}


/* ======================================================
                    PREVIEW
====================================================== */

function renderPreview(){

    previewContainer.innerHTML="";

    imageFiles.forEach((file,index)=>{

        const reader=new FileReader();

        reader.onload=function(e){

            const card=document.createElement("div");

            card.className="preview-item";

            card.innerHTML=`

                <img src="${e.target.result}">

                <div class="preview-content">

                    <div class="preview-name">

                        ${file.name}

                    </div>

                    <div class="preview-size">

                        ${(file.size/1024).toFixed(1)} KB

                    </div>

                    <button
                        class="remove-btn"
                        data-index="${index}">

                        Remove

                    </button>

                </div>

            `;

            previewContainer.appendChild(card);

        };

        reader.readAsDataURL(file);

    });

}


/* ======================================================
                    REMOVE IMAGE
====================================================== */

previewContainer.addEventListener("click",(event)=>{

    if(!event.target.classList.contains("remove-btn")){

        return;

    }

    const index=

    Number(event.target.dataset.index);

    imageFiles.splice(index,1);

    updateInfo();

    renderPreview();

});
/* ======================================================
                    CONVERT TO PDF
====================================================== */

convertBtn.addEventListener("click", async () => {

    if (imageFiles.length === 0) {

        alert("Please upload at least one image.");

        return;

    }

    convertBtn.disabled = true;

    convertBtn.textContent = "Converting...";

    try {

        const pdfDoc = await PDFLib.PDFDocument.create();

        const orientation =
            document.querySelector(
                'input[name="orientation"]:checked'
            ).value;

        const fitMode =
            document.querySelector(
                'input[name="fitMode"]:checked'
            ).value;

        const marginSize =
            Number(margin.value);

        let pageWidth;
        let pageHeight;

        if (pageSize.value === "A4") {

            pageWidth = 595.28;
            pageHeight = 841.89;

        } else {

            pageWidth = 612;
            pageHeight = 792;

        }

        if (orientation === "landscape") {

            [pageWidth, pageHeight] =
                [pageHeight, pageWidth];

        }

        for (const file of imageFiles) {

            const bytes =
                await file.arrayBuffer();

            let image;

            if (file.type === "image/png") {

                image =
                    await pdfDoc.embedPng(bytes);

            } else {

                image =
                    await pdfDoc.embedJpg(bytes);

            }

            const page =
                pdfDoc.addPage([
                    pageWidth,
                    pageHeight
                ]);

            const imgWidth =
                image.width;

            const imgHeight =
                image.height;

            const scaleX =
                (pageWidth - marginSize * 2) /
                imgWidth;

            const scaleY =
                (pageHeight - marginSize * 2) /
                imgHeight;

            const scale =
                fitMode === "fill"
                ? Math.max(scaleX, scaleY)
                : Math.min(scaleX, scaleY);

            const width =
                imgWidth * scale;

            const height =
                imgHeight * scale;

            const x =
                (pageWidth - width) / 2;

            const y =
                (pageHeight - height) / 2;

            page.drawImage(image, {

                x,

                y,

                width,

                height

            });

        }

        generatedPdf =
            await pdfDoc.save();

        downloadBtn.disabled = false;

        alert("PDF created successfully.");

    }

    catch (error) {

        console.error(error);

        alert("Failed to create PDF.");

    }

    convertBtn.disabled = false;

    convertBtn.textContent =
        "Convert to PDF";

});
/* ======================================================
                    DOWNLOAD PDF
====================================================== */

downloadBtn.addEventListener("click", () => {

    if (!generatedPdf) {

        alert("Please convert your images first.");

        return;

    }

    const blob = new Blob(
        [generatedPdf],
        {
            type: "application/pdf"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "ToolVerseHub-Image-to-PDF.pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});


/* ======================================================
                    CLEAR ALL
====================================================== */

clearBtn.addEventListener("click", () => {

    imageFiles = [];

    generatedPdf = null;

    imageInput.value = "";

    previewContainer.innerHTML = "";

    totalImages.textContent = "0";

    totalSize.textContent = "0 MB";

    pageSize.value = "A4";

    margin.value = "40";

    document.querySelector(
        'input[name="orientation"][value="portrait"]'
    ).checked = true;

    document.querySelector(
        'input[name="fitMode"][value="fit"]'
    ).checked = true;

    downloadBtn.disabled = true;

});


/* ======================================================
                    INITIALIZE
====================================================== */

downloadBtn.disabled = true;

console.log("Image to PDF Tool Loaded Successfully");