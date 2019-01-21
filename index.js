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

        breaches.forEach(breach => {
            const table = new Table({
                head: [`${chalk.yellow(chalk.underline("Domain"))}`, `${chalk.yellow(chalk.underline("Breach date"))}`],
                colWidths: [100, 50]
            });
            table.push(
                [`${chalk.yellow(breach["Domain"])}`, `${chalk.yellow(breach["BreachDate"])}`]
            );
            console.log(table.toString());
        });
    });
    

    




    // const test = `${chalk.red(chalk.underline("Domain"))}`.padEnd(10);
    // console.log((`${chalk.red(chalk.underline("Domain"))}`.padEnd(10)) + `${chalk.yellow(chalk.underline("Breach date"))}`);
    // data.forEach(breach => {
    //     console.log(`${chalk.red(breach["Domain"])} \t ${chalk.yellow(breach["BreachDate"])}`);
    // });
}

args.forEach(elem => {
    if(!ismail.validate(elem)) {
        // Addresse incorrecte
        console.log("caca");
        process.exit();
        // TODO: Proposer correction du mail invalide
    }

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
        // TODO: Gestion des erreurs
        console.log("error");
        process.exit();
    });
});