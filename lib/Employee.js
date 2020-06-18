class Employee {
    constructor (name, id, email, role='Employee'){
        this.id = id // increase each employee creation
        this.name = name
        this.email = email
        this.role = role
    }
    
    getName(){
        return this.name
    }
    getId(){
        return this.id
    }
    getEmail(){
        return this.email
    }
    getRole(){
        return this.role
    }
}

module.exports = Employee