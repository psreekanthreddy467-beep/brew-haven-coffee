const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,

    // Force IPv4
    family: 4,

    auth: {
        user: process.env.psreekanthreddy467,
        pass: process.env.ghldrqbcfittjaxn
    }
});

async function sendOrderEmails(order) {

    console.log("========== EMAIL DEBUG ==========");
    console.log("Order received by email.js:");
    console.log(order);
    console.log("Customer email:", order.customer?.email);
    console.log("Admin email:", process.env.ADMIN_EMAIL);
    console.log("=================================");

    if (!order || !order.customer) {
        throw new Error("Order/customer data is missing");
    }

    if (!order.customer.email) {
        throw new Error("Customer email is missing");
    }

    if (!process.env.ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL is missing");
    }

    const itemsText = order.items
        .map(item => {
            return `${item.productId} x ${item.quantity}`;
        })
        .join("\n");

    // Email to customer
    await transporter.sendMail({
        from: `"Brew Haven Coffee" <${process.env.psreekanthreddy467}>`,
        to: order.customer.email,
        subject: "Brew Haven Coffee - Order Confirmation",

        text: `
Hello ${order.customer.name},

Thank you for ordering from Brew Haven Coffee!

Your order has been successfully placed.

Order ID: ${order._id}

Customer Details:
Name: ${order.customer.name}
Phone: ${order.customer.phone}
Address: ${order.customer.address}

Items:
${itemsText}

Payment Method:
${order.paymentMethod}

Total:
₹${order.total}

Thank you for choosing Brew Haven Coffee!
`
    });

    // Email to admin
    await transporter.sendMail({
        from: `"Brew Haven Coffee" <${process.env.psreekanthreddy467}>`,
        to: process.env.psreekanthreddy467,
        subject: "New Brew Haven Coffee Order",

        text: `
NEW ORDER RECEIVED

Order ID: ${order._id}

Customer:
Name: ${order.customer.name}
Phone: ${order.customer.phone}
Email: ${order.customer.email}
Address: ${order.customer.address}

Items:
${itemsText}

Payment Method:
${order.paymentMethod}

Total:
₹${order.total}
`
    });

    console.log("✅ Customer email sent!");
    console.log("✅ Admin email sent!");
}

module.exports = sendOrderEmails;