const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// setting employee ID to 1 to start
let ID = 1

// main function to create team and render to html file
async function main() {
    console.log(`[main] Starting...`)
    const team = []

    const managerData = await inquirer.prompt([
        { name: 'name', type: 'input', message: `What is the manager's name?` },
        { name: 'email', type: 'input', message: `What is the manager's email?`},
        { name: 'officeNumber', type: 'input', message: `What is their office number?` },
        { name: 'count', type: 'input', message: `How many people work under them?` }
    ])

    // create Manager object
    team.push( new Manager(managerData.name, ID++, managerData.email, managerData.officeNumber) )

    for( let userCount=1; userCount <= managerData.count; userCount++ ){

        const user = await inquirer.prompt([
            { name: 'type', type: 'list', message: `For person ${userCount}/${managerData.count}, what is the type of employee? `,
                choices: ["intern", "engineer" ] }
        ])

        if ( user.type=='engineer' ){
            const userData = await inquirer.prompt([
                { name: 'name', type: 'input', message: `What is the engineer's name?` },
                { name: 'email', type: 'input', message: `What is the engineer's email?`},
                { name: 'github', type: 'input', message: `What is their github?` }
            ])
            team.push( new Engineer( userData.name, ID++, userData.email, userData.github) )
        } else {
            const userData = await inquirer.prompt([
                { name: 'name', type: 'input', message: `What is the intern's name?` },
                { name: 'email', type: 'input', message: `What is the intern's email?`},
                { name: 'school', type: 'input', message: `What is their school?` }
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