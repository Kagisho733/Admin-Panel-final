import type { Order } from "../types/Order";



/*
|--------------------------------------------------------------------------
| Generate Invoice
|--------------------------------------------------------------------------
| jsPDF is imported dynamically so the PDF library is only downloaded the
| first time an invoice is actually generated, instead of being bundled
| into the orders screen.
|--------------------------------------------------------------------------
*/

export async function generateInvoice(order: Order) {

  const { default: jsPDF } = await import("jspdf");

  const pdf = new jsPDF();


const invoiceNumber = `INV-${order.id?.slice(0, 8) ?? "00000000"}`;

const invoiceDate = new Date().toLocaleDateString("en-ZA", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

pdf.setProperties({
  title: `Invoice ${invoiceNumber}`,
  subject: "Customer Invoice",
  author: "Books & Bots ERP",
  creator: "Books & Bots Admin System",
  keywords: "invoice, books, bots, order",
});


const company = {
  name: "Books & Bots (Pty) Ltd",
  address: "Kimberley, Northern Cape, South Africa",
  email: "support@booksbots.co.za",
  phone: "+27 XX XXX XXXX",
};





pdf.setFont("helvetica", "bold");
pdf.setFontSize(24);

pdf.text("BOOKS & BOTS", 20, 20);

pdf.setFont("helvetica", "normal");
pdf.setFontSize(11);

pdf.text(company.name, 20, 30);
pdf.text(company.address, 20, 36);
pdf.text(company.email, 20, 42);
pdf.text(company.phone, 20, 48);

pdf.setFont("helvetica", "bold");
pdf.setFontSize(20);

pdf.text("INVOICE", 145, 20);

pdf.setFontSize(11);
pdf.setFont("helvetica", "normal");

pdf.text(`Invoice #: ${invoiceNumber}`, 145, 30);
pdf.text(`Date: ${invoiceDate}`, 145, 36);

pdf.line(20, 55, 190, 55);

pdf.setFont("helvetica", "bold");
pdf.setFontSize(13);

pdf.text("Bill To", 20, 70);

pdf.setFont("helvetica", "normal");
pdf.setFontSize(11);

pdf.text(order.customerName, 20, 80);
pdf.text(order.customerEmail, 20, 86);

pdf.line(20, 95, 190, 95);

pdf.setFont("helvetica", "bold");
pdf.setFontSize(12);

let y = 124;

pdf.setFont("helvetica", "normal");
pdf.setFontSize(11);

order.items.forEach((item) => {

  if (y > 260) {

  pdf.addPage();

  y = 20;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);

  pdf.text("Item", 20, y);
  pdf.text("Qty", 110, y);
  pdf.text("Price", 135, y);
  pdf.text("Total", 170, y);

  pdf.line(20, y + 4, 190, y + 4);

  y += 14;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

}

  const lineTotal = item.price * item.quantity;

  pdf.text(item.name, 20, y);

  pdf.text(
    item.quantity.toString(),
    112,
    y
  );

  pdf.text(
    `R${item.price.toFixed(2)}`,
    135,
    y
  );

  pdf.text(
    `R${lineTotal.toFixed(2)}`,
    170,
    y
  );

  y += 10;

});

pdf.line(20, y, 190, y);

y += 12;

pdf.setFont("helvetica", "bold");
pdf.setFontSize(12);

pdf.text("Subtotal", 120, y);

pdf.text(
  `R${order.totalAmount.toFixed(2)}`,
  170,
  y,
  {
    align: "right",
  }
);

y += 10;

pdf.text("Grand Total", 120, y);

pdf.text(
  `R${order.totalAmount.toFixed(2)}`,
  170,
  y,
  {
    align: "right",
  }
);

y += 18;

pdf.setFont("helvetica", "bold");

pdf.text("Payment Status", 20, y);

pdf.setFont("helvetica", "normal");

pdf.text("PAID", 70, y);

y += 10;

pdf.line(20, y, 190, y);

y += 18;

pdf.setFont("helvetica", "bold");
pdf.setFontSize(14);

pdf.text(
  "Thank you for your business!",
  105,
  y,
  {
    align: "center",
  }
);

y += 10;

pdf.setFont("helvetica", "normal");
pdf.setFontSize(10);

pdf.text(
  company.name,
  105,
  y,
  {
    align: "center",
  }
);

y += 6;

pdf.text(
  company.email,
  105,
  y,
  {
    align: "center",
  }
);

y += 6;

pdf.text(
  company.address,
  105,
  y,
  {
    align: "center",
  }
);


y += 8;

pdf.setFontSize(8);

pdf.text(
  `Generated on ${new Date().toLocaleString("en-ZA")}`,
  105,
  y,
  {
    align: "center",
  }
);

y += 5;

pdf.text(
  `Reference: ${invoiceNumber}`,
  105,
  y,
  {
    align: "center",
  }
);

y += 12;

pdf.setTextColor(120);

pdf.setFontSize(9);


pdf.text(
  "This invoice was generated electronically and does not require a signature.",
  105,
  y,
  {
    align: "center",
  }
);

pdf.setTextColor(0);

pdf.text("Item", 20, 110);
pdf.text("Qty", 110, 110);
pdf.text("Price", 135, 110);
pdf.text("Total", 170, 110);

pdf.line(20, 114, 190, 114);

  const customer = order.customerName
  .replace(/\s+/g, "-")
  .replace(/[^a-zA-Z0-9-]/g, "");

pdf.save(
  `Invoice-${invoiceNumber}-${customer}.pdf`
);

}

