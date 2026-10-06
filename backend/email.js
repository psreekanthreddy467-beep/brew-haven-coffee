const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderEmails(order) {

    console.log("========== EMAIL DEBUG ==========");
    console.log("Order received by email.js:");
    console.log(order);
    console.log("Customer email:", order.customer?.email);
    console.log("Admin email:", process.env.ADMIN_EMAIL);
    console.log("Resend API key loaded:", !!process.env.RESEND_API_KEY);
    console.log("=================================");

    // Check order
    if (!order || !order.customer) {
        throw new Error("Order/customer data is missing");
    }

    // Check customer email
    if (!order.customer.email) {
        throw new Error("Customer email is missing");
    }

    // Check admin email
    if (!process.env.ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL is missing");
    }

    // Check Resend API key
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is missing");
    }

    // Prepare items
    const itemsText = order.items
        .map(item => {
            return `${item.name} x ${item.quantity} - ₹${item.price}`;
        })
        .join("\n");


    // ==========================================
    // CUSTOMER EMAIL
    // ==========================================

    const customerEmail = await resend.emails.send({
        from: "Brew Haven Coffee <onboarding@resend.dev>",
        to: [order.customer.email],
        subject: "Brew Haven Coffee - Order Confirmation",

        text: `
Hello ${order.customer.name},

Thank you for ordering from Brew Haven Coffee!

Your order has been successfully placed.

Order ID:
${order._id}

Customer Details:
Name: ${order.customer.name}
Phone: ${order.customer.phone}
Address: ${order.customer.address}

Items:
${itemsText}

Payment Method:
${order.paymentMethod}

Subtotal:
₹${order.subtotal}

Delivery Fee:
₹${order.deliveryFee}

Total:
₹${order.total}

Thank you for choosing Brew Haven Coffee!

Brew Haven Coffee
`
    });

    if (customerEmail.error) {
        throw new Error(
            `Customer email failed: ${customerEmail.error.message}`
        );
    }

    console.log("✅ Customer email sent!");
    console.log("Customer email ID:", customerEmail.data?.id);


    // ==========================================
    // ADMIN EMAIL
    // ==========================================

    const adminEmail = await resend.emails.send({
        from: "Brew Haven Coffee <onboarding@resend.dev>",
        to: [process.env.ADMIN_EMAIL],
        subject: "New Brew Haven Coffee Order",

        text: `
NEW ORDER RECEIVED

Order ID:
${order._id}

Customer Details:
Name: ${order.customer.name}
Phone: ${order.customer.phone}
Email: ${order.customer.email}
Address: ${order.customer.address}

Items:
${itemsText}

Payment Method:
${order.paymentMethod}

Subtotal:
₹${order.subtotal}

Delivery Fee:
₹${order.deliveryFee}

Total:
₹${order.total}
`
    });

    if (adminEmail.error) {
        throw new Error(
            `Admin email failed: ${adminEmail.error.message}`
        );
    }

    console.log("✅ Admin email sent!");
    console.log("Admin email ID:", adminEmail.data?.id);

    console.log("=================================");
    console.log("✅ ORDER EMAILS SENT SUCCESSFULLY");
    console.log("=================================");

    return {
        customerEmailId: customerEmail.data?.id,
        adminEmailId: adminEmail.data?.id
    };
}

module.exports = sendOrderEmails;