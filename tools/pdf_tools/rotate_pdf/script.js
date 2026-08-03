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
const rotateModes = document.querySelectorAll('input[name="rotateMode"]');

const angleButtons = document.querySelectorAll(".angle-btn");

const previewMode = document.getElementById("previewMode");
const previewPages = document.getElementById("previewPages");
const previewAngle = document.getElementById("previewAngle");
const previewTotal = document.getElementById("previewTotal");

const rotateBtn = document.getElementById("rotateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");


/* ======================================================
                    VARIABLES
====================================================== */

let pdfFile = null;
let pdfDoc = null;
let pdfBytes = null;
let rotatedPdfBytes = null;

let pageCount = 0;
let selectedAngle = 90;


/* ======================================================
                    BROWSE
====================================================== */

browseBtn.addEventListener("click", () => {

    pdfInput.click();

});


/* ======================================================
                    FILE SELECT
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

async function loadPDF(file) {

    if (file.type !== "application/pdf") {

        alert("Please select a valid PDF file.");

        return;

    }

    pdfFile = file;

    pdfBytes = await file.arrayBuffer();

    pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

    pageCount = pdfDoc.getPageCount();

    fileName.textContent = file.name;

    fileSize.textContent =
        (file.size / 1024 / 1024).toFixed(2) + " MB";

    totalPages.textContent = pageCount;

    updatePreview();

}


/* ======================================================
                    ROTATE MODE
====================================================== */

rotateModes.forEach(mode => {

    mode.addEventListener("change", () => {

        pageInput.disabled = mode.value !== "selected" || !mode.checked;

        if (pageInput.disabled) {

            pageInput.value = "";

        }

        updatePreview();

    });

});


/* ======================================================
                    PAGE INPUT
====================================================== */

pageInput.addEventListener("input", () => {

    updatePreview();

});


/* ======================================================
                    ANGLE BUTTONS
====================================================== */

angleButtons.forEach(button => {

    button.addEventListener("click", () => {

        angleButtons.forEach(item => {

            item.classList.remove("active");

        });

        button.classList.add("active");

        selectedAngle =
            Number(button.dataset.angle);

        updatePreview();

    });

});


/* ======================================================
                    PREVIEW
====================================================== */

function updatePreview() {

    const mode =
        document.querySelector(
            'input[name="rotateMode"]:checked'
        ).value;

    previewMode.textContent =
        mode === "all"
            ? "All Pages"
            : "Selected Pages";

    previewPages.textContent =
        mode === "all"
            ? "All Pages"
            : (pageInput.value || "-");

    previewTotal.textContent =
        mode === "all"
            ? (pageCount || "-")
            : (pageInput.value || "-");

    if (selectedAngle === 90)
        previewAngle.textContent = "90° Right";

    if (selectedAngle === -90)
        previewAngle.textContent = "90° Left";

    if (selectedAngle === 180)
        previewAngle.textContent = "180°";

    if (selectedAngle === 270)
        previewAngle.textContent = "270°";

}

updatePreview(); 
/* ======================================================
                    PAGE PARSER
====================================================== */

function getSelectedPages(input, totalPages) {

    const pages = new Set();

    if (!input.trim()) {

        return [];

    }

    const items = input.split(",");

    items.forEach(item => {

        item = item.trim();

        if (item.includes("-")) {

            let [start, end] = item.split("-").map(Number);

            if (isNaN(start) || isNaN(end)) {

                return;

            }

            if (start > end) {

                [start, end] = [end, start];

            }

            for (let i = start; i <= end; i++) {

                if (i >= 1 && i <= totalPages) {

                    pages.add(i - 1);

                }

            }

        }

        else {

            const page = Number(item);

            if (!isNaN(page) && page >= 1 && page <= totalPages) {

                pages.add(page - 1);

            }

        }

    });

    return [...pages].sort((a, b) => a - b);

}


/* ======================================================
                    ROTATE PDF
====================================================== */

rotateBtn.addEventListener("click", async () => {

    if (!pdfFile) {

        alert("Please upload a PDF first.");

        return;

    }

    rotateBtn.disabled = true;

    rotateBtn.textContent = "Rotating...";

    try {

        const sourcePdf = await PDFLib.PDFDocument.load(pdfBytes);

        const pages = sourcePdf.getPages();

        const mode = document.querySelector(
            'input[name="rotateMode"]:checked'
        ).value;

        let selectedPages = [];

        if (mode === "all") {

            selectedPages = pages.map((page, index) => index);

        }

        else {

            selectedPages = getSelectedPages(
                pageInput.value,
                pages.length
            );

            if (selectedPages.length === 0) {

                alert("Please enter valid page numbers.");

                rotateBtn.disabled = false;

                rotateBtn.textContent = "Rotate PDF";

                return;

            }

        }

        selectedPages.forEach(index => {

            const page = pages[index];

            const currentAngle =
                page.getRotation().angle;

            page.setRotation(
                PDFLib.degrees(
                    currentAngle + selectedAngle
                )
            );

        });

        rotatedPdfBytes =
            await sourcePdf.save();

        downloadBtn.disabled = false;

        alert("PDF rotated successfully.");

    }

    catch (error) {

        console.error(error);

        alert("Failed to rotate PDF.");

    }

    rotateBtn.disabled = false;

    rotateBtn.textContent = "Rotate PDF";

});
/* ======================================================
                    DOWNLOAD PDF
====================================================== */

downloadBtn.addEventListener("click", () => {

    if (!rotatedPdfBytes) {

        alert("Please rotate the PDF first.");

        return;

    }

    const blob = new Blob(
        [rotatedPdfBytes],
        {
            type: "application/pdf"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const file =
        pdfFile.name.replace(/\.pdf$/i, "");

    link.href = url;

    link.download =
        `${file}-rotated.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});


/* ======================================================
                    RESET
====================================================== */

resetBtn.addEventListener("click", () => {

    pdfFile = null;

    pdfDoc = null;

    pdfBytes = null;

    rotatedPdfBytes = null;

    pageCount = 0;

    selectedAngle = 90;

    pdfInput.value = "";

    fileName.textContent = "-";

    fileSize.textContent = "-";

    totalPages.textContent = "-";

    pageInput.value = "";

    pageInput.disabled = true;

    document.querySelector(
        'input[value="all"]'
    ).checked = true;

    angleButtons.forEach(button => {

        button.classList.remove("active");

    });

    document.querySelector(
        '.angle-btn[data-angle="90"]'
    ).classList.add("active");

    downloadBtn.disabled = true;

    updatePreview();

});


/* ======================================================
                    INITIALIZE
====================================================== */

downloadBtn.disabled = true;

updatePreview();

console.log(
    "Rotate PDF Tool Loaded Successfully"
);