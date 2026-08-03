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

const remainingPages =
    document.getElementById("remainingPages");

const removedPages =
    document.getElementById("removedPages");

const removeBtn = document.getElementById("removeBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const resetBtn = document.getElementById("resetBtn");


/* ======================================================
                    VARIABLES
====================================================== */

let pdfFile = null;

let originalPdfBytes = null;

let totalPageCount = 0;

let generatedPdf = null;


/* ======================================================
                    BROWSE PDF
====================================================== */

browseBtn.addEventListener("click", () => {

    pdfInput.click();

});


/* ======================================================
                    SELECT PDF
====================================================== */

pdfInput.addEventListener(
    "change",
    async (event) => {

        if (!event.target.files.length) {

            return;

        }

        await loadPDF(
            event.target.files[0]
        );

    }
);


/* ======================================================
                    DRAG & DROP
====================================================== */

uploadBox.addEventListener(
    "dragover",
    (event) => {

        event.preventDefault();

        uploadBox.classList.add("drag");

    }
);


uploadBox.addEventListener(
    "dragleave",
    () => {

        uploadBox.classList.remove("drag");

    }
);


uploadBox.addEventListener(
    "drop",
    async (event) => {

        event.preventDefault();

        uploadBox.classList.remove("drag");

        if (
            !event.dataTransfer.files.length
        ) {

            return;

        }

        await loadPDF(
            event.dataTransfer.files[0]
        );

    }
);


/* ======================================================
                    LOAD PDF
====================================================== */

async function loadPDF(file) {

    if (
        file.type !== "application/pdf"
    ) {

        alert(
            "Please select a valid PDF."
        );

        return;

    }

    try {

        pdfFile = file;

        generatedPdf = null;

        downloadBtn.disabled = true;

        remainingPages.textContent = "-";

        removedPages.textContent = "-";

        fileName.textContent =
            file.name;

        fileSize.textContent =
            (
                file.size /
                1024 /
                1024
            ).toFixed(2) + " MB";

        originalPdfBytes =
            await file.arrayBuffer();

        const pdfDocument =
            await PDFLib.PDFDocument.load(
                originalPdfBytes
            );

        totalPageCount =
            pdfDocument.getPageCount();

        totalPages.textContent =
            totalPageCount;

    }

    catch (error) {

        console.error(error);

        alert(
            "This PDF could not be loaded."
        );

        pdfFile = null;

        originalPdfBytes = null;

        totalPageCount = 0;

        fileName.textContent = "-";

        fileSize.textContent = "-";

        totalPages.textContent = "-";

    }

}
/* ======================================================
                    PAGE PARSER
====================================================== */

function getPagesToRemove(input, totalPages) {

    const pages = new Set();

    if (!input.trim()) {

        return [];

    }

    const items = input.split(",");

    items.forEach((item) => {

        item = item.trim();

        if (!item) {

            return;

        }

        if (item.includes("-")) {

            let [start, end] =
                item.split("-").map(Number);

            if (
                isNaN(start) ||
                isNaN(end)
            ) {

                return;

            }

            if (start > end) {

                [start, end] =
                    [end, start];

            }

            for (
                let i = start;
                i <= end;
                i++
            ) {

                if (
                    i >= 1 &&
                    i <= totalPages
                ) {

                    pages.add(i);

                }

            }

        }

        else {

            const page = Number(item);

            if (
                !isNaN(page) &&
                page >= 1 &&
                page <= totalPages
            ) {

                pages.add(page);

            }

        }

    });

    return [...pages].sort(
        (a, b) => a - b
    );

}


/* ======================================================
                    REMOVE PAGES
====================================================== */

removeBtn.addEventListener(
    "click",
    async () => {

        if (
            !pdfFile ||
            !originalPdfBytes ||
            totalPageCount === 0
        ) {

            alert(
                "Please upload a PDF first."
            );

            return;

        }

        const pagesToRemove =
            getPagesToRemove(
                pageInput.value,
                totalPageCount
            );

        if (
            pagesToRemove.length === 0
        ) {

            alert(
                "Please enter valid page numbers."
            );

            return;

        }

        if (
            pagesToRemove.length ===
            totalPageCount
        ) {

            alert(
                "You cannot remove all pages from the PDF."
            );

            return;

        }

        removeBtn.disabled = true;

        removeBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Removing...';

        try {

            const sourcePdf =
                await PDFLib.PDFDocument.load(
                    originalPdfBytes
                );

            const newPdf =
                await PDFLib.PDFDocument.create();

            const pagesToRemoveSet =
                new Set(
                    pagesToRemove
                );

            const pagesToKeep = [];

            for (
                let i = 1;
                i <= totalPageCount;
                i++
            ) {

                if (
                    !pagesToRemoveSet.has(i)
                ) {

                    pagesToKeep.push(
                        i - 1
                    );

                }

            }

            const copiedPages =
                await newPdf.copyPages(
                    sourcePdf,
                    pagesToKeep
                );

            copiedPages.forEach(
                (page) => {

                    newPdf.addPage(
                        page
                    );

                }
            );

            generatedPdf =
                await newPdf.save();

            remainingPages.textContent =
                pagesToKeep.length;

            removedPages.textContent =
                pagesToRemove.join(", ");

            downloadBtn.disabled = false;

            alert(
                "Pages removed successfully."
            );

        }

        catch (error) {

            console.error(error);

            alert(
                "Pages could not be removed."
            );

            generatedPdf = null;

            downloadBtn.disabled = true;

        }

        removeBtn.disabled = false;

        removeBtn.innerHTML =
            '<i class="fa-solid fa-trash"></i> Remove Pages';

    }
);
/* ======================================================
                    DOWNLOAD PDF
====================================================== */

downloadBtn.addEventListener(
    "click",
    () => {

        if (!generatedPdf) {

            alert(
                "Please remove pages first."
            );

            return;

        }

        const pdfBlob =
            new Blob(
                [generatedPdf],
                {
                    type:
                    "application/pdf"
                }
            );

        const pdfURL =
            URL.createObjectURL(
                pdfBlob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = pdfURL;

        link.download =
            "ToolVerseHub-Removed-Pages.pdf";

        document.body.appendChild(
            link
        );

        link.click();

        document.body.removeChild(
            link
        );

        URL.revokeObjectURL(
            pdfURL
        );

    }
);


/* ======================================================
                    RESET
====================================================== */

resetBtn.addEventListener(
    "click",
    () => {

        pdfFile = null;

        originalPdfBytes = null;

        totalPageCount = 0;

        generatedPdf = null;

        pdfInput.value = "";

        pageInput.value = "";

        fileName.textContent = "-";

        fileSize.textContent = "-";

        totalPages.textContent = "-";

        remainingPages.textContent = "-";

        removedPages.textContent = "-";

        downloadBtn.disabled = true;

        removeBtn.disabled = false;

        removeBtn.innerHTML =
            '<i class="fa-solid fa-trash"></i> Remove Pages';

    }
);


/* ======================================================
                    INITIALIZATION
====================================================== */

downloadBtn.disabled = true;

console.log(
    "Remove PDF Pages Tool Loaded Successfully"
);