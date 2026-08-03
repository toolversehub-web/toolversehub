const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const app = express();

app.use(express.static(path.join(__dirname, "..")));

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "output");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadDir);

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);

    }

});

const upload = multer({

    storage,

    fileFilter: function (req, file, cb) {

        if (file.mimetype !== "application/pdf") {

            return cb(
                new Error("Only PDF files are allowed.")
            );

        }

        cb(null, true);

    }

});

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "..", "index.html")
    );

});
/* ======================================================
                PROTECT PDF API
====================================================== */

app.post("/protect", upload.single("pdf"), (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "No PDF uploaded."

            });

        }

        const password =
            req.body.password;

        if (!password) {

            fs.unlinkSync(req.file.path);

            return res.status(400).json({

                success: false,
                message: "Password is required."

            });

        }

        const inputFile =
            req.file.path;

        const outputFile =
            path.join(

                outputDir,

                "protected-" +
                Date.now() +
                ".pdf"

            );

        const args = [

            "--encrypt",
            password,
            password,
            "256",

            "--",

            inputFile,
            outputFile

        ];

const qpdfPath = "qpdf";

execFile(
    qpdfPath,
    args,
    (error, stdout, stderr) => {


        if (stderr) {
            console.log(stderr);
        }

                if (error) {

                    console.error(error);

                    if (fs.existsSync(inputFile)) {

                        fs.unlinkSync(inputFile);

                    }

                    return res.status(500).json({

                        success: false,
                        message: "Failed to protect PDF."

                    });

                }

                if (fs.existsSync(inputFile)) {

                    fs.unlinkSync(inputFile);

                }

                res.download(

                    outputFile,

                    "ToolVerseHub-Protected.pdf",

                    () => {

                        if (fs.existsSync(outputFile)) {

                            fs.unlinkSync(outputFile);

                        }

                    }

                );

            }

        );

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,
            message: "Server Error."

        });

    }

});
/* ======================================================
                    ERROR HANDLER
====================================================== */

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

});


/* ======================================================
                    START SERVER
====================================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("");

    console.log("======================================");

    console.log(" ToolVerseHub Protect PDF Server");

    console.log(" Running on: http://localhost:3000");

    console.log("======================================");

    console.log("");

});
