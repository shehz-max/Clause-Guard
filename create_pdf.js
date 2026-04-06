const { jsPDF } = require("jspdf");
const fs = require("fs");

try {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text("NON-DISCLOSURE AGREEMENT", 105, 20, null, null, "center");

  doc.setFontSize(12);
  doc.text("This Non-Disclosure Agreement (the \"Agreement\") is entered into by and between", 20, 40);
  doc.text("ClauseGuard Inc. (\"Disclosing Party\") and the User (\"Receiving Party\").", 20, 48);

  doc.setFontSize(14);
  doc.text("1. Confidentiality obligations", 20, 65);
  doc.setFontSize(12);
  const text1 = "The Receiving Party shall hold all Confidential Information in strict confidence and shall not disclose any such information to any third party. The Receiving Party agrees to use highest possible standard of care in protecting the Disclosing Party's information.";
  doc.text(doc.splitTextToSize(text1, 170), 20, 73);

  doc.setFontSize(14);
  doc.text("2. Unlimited Liability", 20, 105);
  doc.setFontSize(12);
  const text2 = "The Receiving Party bears unlimited liability for any leak, breach, or transmission of data. The liability cap is expressly removed from this agreement. Termination does not forgive liability debts.";
  doc.text(doc.splitTextToSize(text2, 170), 20, 113);

  doc.setFontSize(14);
  doc.text("3. Termination with Notice", 20, 145);
  doc.setFontSize(12);
  const text3 = "Either party may terminate this agreement with a 30-day written notice. However, clauses pertaining to intellectual property, liability, and indemnity shall survive the termination indefinitely.";
  doc.text(doc.splitTextToSize(text3, 170), 20, 153);
  
  doc.save("Sample_Contract.pdf");
  console.log("PDF Created Successfully as Sample_Contract.pdf");
} catch (e) {
  console.error("Failed to make PDF:", e.message);
}
