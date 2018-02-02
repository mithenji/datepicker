const rollup = require('rollup')
const fs = require("fs");
const path = require("path");


const uglify = require('uglify-js');
const buble = require('rollup-plugin-buble');
const alias = require('rollup-plugin-alias');
const cjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const node = require('rollup-plugin-node-resolve');
const exec = require("shelljs").exec;

function logError(err) {
    if (err) {
        console.log(err)
    }
}


function buildOptions() {
    return {
        input: "./lib/index.js",
        output: [
            {

                file: {
                    compressed: path.resolve("dist", "datepicker.min.js"),
                    normal: path.resolve("dist", "datepicker.js")
                },
                format: "umd",
                name: "DatePicker",
                compress: true
            },
            {
                file: {
                    compressed: path.resolve("dist", "datepicker.esm.min.js"),
                    normal: path.resolve("dist", "datepicker.esm.js")
                },
                format: "es",
                name: "DatePicker",
                compress: false
            }


        ],

    }


}


function generate(config) {


    config.plugins = [
        buble(),
        cjs(),
        node(),
    ];
    console.log("> start building ...");
    config.output.forEach(item => {
        rollup.rollup(config)
            .then(bundle => bundle.generate(item))
            .then(({code}) => {
                const minified = uglify.minify(code, {
                    output: {
                        ascii_only: true
                    },
                    compress: {
                        pure_funcs: ['makeMap']
                    }
                }).code;
                fs.writeFile(item.file.normal, code, err => logError(err));
                fs.writeFile(item.file.compressed, minified, err => logError(err))
            });
    });
    console.log("> start compiling style ....");
    // exec("stylus ./src/style.styl -c -o ./dist");
    console.log("> build done !")
}

generate(buildOptions());
