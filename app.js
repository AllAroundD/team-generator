// requires
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");
const chalk = require("chalk")

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
// regular expressions to validate input
const regexName = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/
const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const regexPhone = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/
const regexNumber = /[1-9]/

// setting employee ID to 1 to start
let ID = 1

// function to validate name
function validateName(inputtxt)
{
    return (!regexName.test(inputtxt)) ? false : true
}

// function to validate phone number
function validatePhoneNumber(inputtxt)
{
    return (!regexPhone.test(inputtxt)) ? false : true
}

// function to validate number
function validateNumber(inputtxt)
{
    return (!regexNumber.test(inputtxt)) ? false : true
}

// function to validate email address
function validateEmail(inputtxt)
{
    return (!regexEmail.test(inputtxt)) ? false : true
}

// main function to create team and render to html file
async function main() {
    console.log(`[main] Starting...`)
    const team = []

    const managerData = await inquirer.prompt([
        { 
            name: 'name', 
            type: 'input', 
            message: `What is the Manager's Name?`,
            validate: (input) => {
                if (input == ""){
                    return `Error: Please enter the ${chalk.red("Manager's Name")}`
                }
                if (!validateName(input) ){
                    return `Error: Please enter a valid ${chalk.red("Manager's Name")}`
                }
                return true
            }
        },
        {
            name: 'email', 
            type: 'input', 
            message: `What is the Manager's email?`,
            validate: (input) => {
                if (input == ""){
                    return `Error: Please enter the ${chalk.red('email address')}`
                }
                if ( !validateEmail(input) ){
                    return `Error: Please enter a valid ${chalk.red("email address")}`
                }
                return true
              }
        },
        { 
            name: 'officeNumber', 
            type: 'input', 
            message: `What is their office phone number?`,
            validate: (input) => {
                if (input == ""){
                    return `Error: Please enter the ${chalk.red('phone number')}`
                }
                if ( !validatePhoneNumber(input) ){
                    return `Error: Please enter a valid ${chalk.red('phone number')}`
                }
                return true
            }
        },
        { 
            name: 'count', 
            type: 'input', 
            message: `How many people work under them?`,
            validate: (input) => {
                if (input == ""){
                    return `Error: Please enter the ${chalk.red('number of employees')}`
                }
                if ( !validateNumber(input) ){
                    return `Error: Please enter a valid ${chalk.red('number of employees')}`
                }
                return true
            }
        }
    ])
    // create Manager object
    team.push( new Manager(managerData.name, ID++, managerData.email, managerData.officeNumber) )
    // loop through object and start to prompt questions
    for( let userCount=1; userCount <= managerData.count; userCount++ ){
        const user = await inquirer.prompt([
            { name: 'type', type: 'list', message: `For person #${userCount} of ${managerData.count}, what is the type of employee? `,
                choices: ["intern", "engineer" ] }
        ])
        // If Engineer, prompt for the engineer questions
        if ( user.type=='engineer' ){
            const userData = await inquirer.prompt([
                { 
                    name: 'name', 
                    type: 'input', message: `What is the Engineer's name?`, 
                    validate: (input) => {
                        if (input == ""){
                            return `Error: Please enter the ${chalk.red("Engineer's Name")}`
                        }
                        if (!validateName(input) ){
                            return `Error: Please enter a valid ${chalk.red("Engineer's Name")}`
                        }
                        return true
                    }
                },
                { 
                    name: 'email', 
                    type: 'input', 
                    message: `What is the Engineer's email?`,
                    validate: (input) => {
                        if (input == ""){
                            return `Error: Please enter the ${chalk.red('email address')}`
                        }
                        if ( !validateEmail(input) ){
                            return `Error: Please enter a valid ${chalk.red("email address")}`
                        }
                        return true
                    }
                },
                { 
                    name: 'github', 
                    type: 'input', 
                    message: `What is their Github ID?` ,
                    validate: (input) => {
                        if (input == ""){
                            return `Error: Please enter the ${chalk.red('Github ID')}`
                        }
                        return true
                    }
                }
            ])
            team.push( new Engineer( userData.name, ID++, userData.email, userData.github) )
        } else {
            // If Intern, prompt for the intern questions
            const userData = await inquirer.prompt([
                { 
                    name: 'name', 
                    type: 'input', 
                    message: `What is the Intern's name?`, 
                    validate: (input) => {
                        if (input == ""){
                            return `Error: Please enter the ${chalk.red("Intern's Name")}`
                        }
                        if (!validateName(input) ){
                            return `Error: Please enter a valid ${chalk.red("Intern's Name")}`
                        }
                        return true
                    }
                },
                { 
                    name: 'email', 
                    type: 'input', 
                    message: `What is the Intern's email?`,
                    validate: (input) => {
                        if (input == ""){
                            return `Error: Please enter the ${chalk.red('email address')}`
                        }
                        if ( !validateEmail(input) ){
                            return `Error: Please enter a valid ${chalk.red("email address")}`
                        }
                        return true
                    }
                },
                { 
                    name: 'school', 
                    type: 'input', 
                    message: `What is their school?`, 
                    validate: (input) => {
                        if (input == ""){
                            return `Error: Please enter the ${chalk.red("School")}`
                        }
                        return true
                    }
                }
            ])
            team.push( new Intern( userData.name, ID++, userData.email, userData.school) )
        }
    }
    //now generate html and write file
    const html = render( team )
    // write to the file
    fs.writeFileSync( outputPath, html )
    console.log(`Finished writing the file, available in ${outputPath}` )

}
main()