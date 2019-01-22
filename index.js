#!/usr/bin/env node

const [,, ...args] = process.argv;
const ismail = require("email-validator");
const axios = require("axios");
const ora = require("ora");
const chalk = require("chalk");
const Table = require("cli-table");
const figlet = require("figlet");

function displayResult(breaches, email) {
    // Affichage des résultats
    figlet(email, (err, data) => {
        if(err) {
            process.exit();
        }
        console.log(data);
        const table = new Table({
            head: [`${chalk.yellow(chalk.underline("Domain"))}`, `${chalk.yellow(chalk.underline("Breach date"))}`],
            colWidths: [100, 50]
        });
        breaches.forEach(breach => {
            table.push(
                [`${chalk.yellow(breach["Domain"])}`, `${chalk.yellow(breach["BreachDate"])}`]
            );
        });
        console.log(table.toString());
    });
}

args.forEach(elem => {
    if(!ismail.validate(elem)) {
        // Addresse incorrecte
        console.log("Invalid email");
    } else {
        // Addresse correcte
        const spinner = ora('Looking for breaches').start();
        axios(`https://haveibeenpwned.com/api/v2/breachedaccount/${elem}`, {
            headers: {
                "User-Agent": "request"
            }
        }).then(response => {
            spinner.stop();
            displayResult(response.data, elem);
        }).catch(err => {
            if(err.response.status === 404) console.log(`\nNo breach detected for ${chalk.yellow(chalk.underline(elem))}`);
            else console.log(`Error ${err.response.status}. Try again.`);
            process.exit();
        });
    }
});