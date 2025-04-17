class Customer {
    constructor({ id, name, email, phone, address, available_credit, created_at, updated_at }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.available_credit = available_credit;
        this.created_at = created_at || new Date();
        this.updated_at = updated_at || new Date();
    }
}

module.exports = Customer;
