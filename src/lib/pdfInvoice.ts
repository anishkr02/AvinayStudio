import { jsPDF } from 'jspdf';
import { Invoice } from '@/types';
import { SITE_CONFIG } from '@/lib/siteConfig';

export function generateInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Background Header Styling
  doc.setFillColor(15, 15, 18);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Gold Accent Top Stripe
  doc.setFillColor(197, 168, 128); // #C5A880
  doc.rect(0, 0, pageWidth, 3, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(245, 242, 237);
  doc.text('AvinayStudio', margin, 22);

  // Brand Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(197, 168, 128);
  doc.text('BUILD  •  CREATE  •  GROW', margin, 28);

  // Agency Contact Details (Right Aligned Header)
  doc.setFontSize(8);
  doc.setTextColor(184, 179, 171);
  const agencyInfo = [
    'Founder: Avinay Sharma',
    `Phone: ${SITE_CONFIG.phoneDisplay}`,
    'Email: sharmaavinay0@gmail.com',
    'Location: Assam, India',
  ];
  agencyInfo.forEach((info, i) => {
    doc.text(info, pageWidth - margin, 18 + i * 5, { align: 'right' });
  });

  // Invoice Title & Meta Box
  let currentY = 58;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 24);
  doc.text('TAX INVOICE', margin, currentY);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Invoice Number: ${invoice.invoice_number}`, margin, currentY + 7);
  doc.text(`Issue Date: ${invoice.issue_date}`, margin, currentY + 13);
  doc.text(`Due Date: ${invoice.due_date}`, margin, currentY + 19);

  // Bill To Box (Right side)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 24);
  doc.text('BILLED TO:', pageWidth / 2 + 10, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(invoice.client_name, pageWidth / 2 + 10, currentY + 7);
  if (invoice.client_phone) {
    doc.text(`Phone: ${invoice.client_phone}`, pageWidth / 2 + 10, currentY + 13);
  }
  if (invoice.client_email) {
    doc.text(`Email: ${invoice.client_email}`, pageWidth / 2 + 10, currentY + 19);
  }
  if (invoice.client_address) {
    doc.text(`Address: ${invoice.client_address}`, pageWidth / 2 + 10, currentY + 25);
  }

  // Table Header
  currentY = 95;
  doc.setFillColor(245, 242, 237);
  doc.rect(margin, currentY, pageWidth - margin * 2, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 45);
  doc.text('DESCRIPTION', margin + 4, currentY + 5.5);
  doc.text('QTY', pageWidth - margin - 60, currentY + 5.5, { align: 'center' });
  doc.text('RATE (INR)', pageWidth - margin - 35, currentY + 5.5, { align: 'right' });
  doc.text('AMOUNT (INR)', pageWidth - margin - 4, currentY + 5.5, { align: 'right' });

  // Items List
  currentY += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);

  invoice.items.forEach((item) => {
    // Description
    const splitDesc = doc.splitTextToSize(item.description, 85);
    doc.text(splitDesc, margin + 4, currentY);

    // Qty
    doc.text(String(item.quantity), pageWidth - margin - 60, currentY, { align: 'center' });

    // Rate
    doc.text(`Rs. ${Number(item.rate).toLocaleString('en-IN')}`, pageWidth - margin - 35, currentY, { align: 'right' });

    // Amount
    doc.text(`Rs. ${Number(item.amount).toLocaleString('en-IN')}`, pageWidth - margin - 4, currentY, { align: 'right' });

    const itemHeight = Math.max(splitDesc.length * 5, 8);
    currentY += itemHeight;

    // Subtle divider
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, currentY - 2, pageWidth - margin, currentY - 2);
  });

  // Summary Totals
  currentY += 6;
  const summaryX = pageWidth - margin - 65;

  doc.setFontSize(9);
  doc.text('Subtotal:', summaryX, currentY);
  doc.text(`Rs. ${Number(invoice.subtotal).toLocaleString('en-IN')}`, pageWidth - margin - 4, currentY, { align: 'right' });

  if (invoice.discount > 0) {
    currentY += 6;
    doc.text('Discount:', summaryX, currentY);
    doc.text(`- Rs. ${Number(invoice.discount).toLocaleString('en-IN')}`, pageWidth - margin - 4, currentY, { align: 'right' });
  }

  // Total Highlight
  currentY += 8;
  doc.setFillColor(15, 15, 18);
  doc.rect(summaryX - 5, currentY - 5, pageWidth - margin - summaryX + 9, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(223, 192, 143);
  doc.text('Total Amount Due:', summaryX, currentY + 1.5);
  doc.text(`Rs. ${Number(invoice.total_amount).toLocaleString('en-IN')}`, pageWidth - margin - 4, currentY + 1.5, { align: 'right' });

  // Payment Instructions & Notes
  currentY += 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 24);
  doc.text('PAYMENT DETAILS & INSTRUCTIONS', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 70);
  const paymentNotes = [
    `• UPI Payment ID: ${SITE_CONFIG.upiId} (PhonePe / Google Pay)`,
    '• Account Name: Avinay Sharma / AvinayStudio',
    '• Bank Transfer: Details available upon direct confirmation.',
    '• Note: Please share screenshot or transaction reference after transfer.',
  ];
  paymentNotes.forEach((line, idx) => {
    doc.text(line, margin, currentY + 6 + idx * 5);
  });

  // Client Custom Notes
  if (invoice.notes) {
    currentY += 32;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const splitNotes = doc.splitTextToSize(`Notes: ${invoice.notes}`, pageWidth - margin * 2);
    doc.text(splitNotes, margin, currentY);
  }

  // Footer Signature Line
  const footerY = 270;
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - margin - 50, footerY, pageWidth - margin, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 30, 30);
  doc.text('Authorized Signatory', pageWidth - margin - 25, footerY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('AvinayStudio • Assam, India', pageWidth - margin - 25, footerY + 9, { align: 'center' });

  // Save the PDF
  doc.save(`${invoice.invoice_number}_AvinayStudio.pdf`);
}
