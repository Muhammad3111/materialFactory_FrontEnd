import jsPDF from "jspdf";

export const generatePdf = (item: InventoryProduct) => {
  const doc = new jsPDF();
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };
  doc.setFontSize(16);
  doc.text("Kirim Cheki", 20, 20);

  doc.setFontSize(12);
  doc.text(`Mahsulot: ${item.product.name}`, 20, 40);
  doc.text(`Hamkor: ${item.partner.name}`, 20, 50);
  doc.text(`Operator: ${item.user_name}`, 20, 60);
  doc.text(`Miqdori: ${item.quantity} ${item.product.unit}`, 20, 70);
  doc.text(`Kamomat: ${item.flaw} %`, 20, 80);
  doc.text(`Dona narx: ${item.price} $`, 20, 90);
  doc.text(`Umumiy narx: ${item.total_price} $`, 20, 100);
  doc.text(`Xarajat: ${item.expense} $`, 20, 110);
  doc.text(`Sana: ${formatDate(item.created_at || "")}`, 20, 120);

  return doc.output("blob");
};
