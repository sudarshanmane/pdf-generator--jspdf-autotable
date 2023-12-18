import jsPDF from "jspdf";
import { AppImages } from "../globals/AppImages";

const generatePDF = (title, downloadFileName, tableHeaders, tableDetails) => {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold", 10);

  doc.autoTable({
    head: [tableHeaders],
    body: tableDetails,
    styles: {
      lineWidth: 0.001,
      lineColor: [0, 0, 0],
    },
    columnStyles: { europe: { halign: "center" }, theme: "striped" },
    margin: { horizontal: 10, vertical: 23 },
    bodyStyles: { valign: "top" },
    theme: "striped",
    showHead: "everyPage",

    didDrawPage: function (data) {
      doc.setFontSize(20);
      doc.setTextColor(40);

      doc.text(`${title}`, data.settings.margin.left, 10);

      let pageSize = doc.internal.pageSize;
      let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

      doc.addImage(
        AppImages.metaiImage,
        "JPEG",
        pageSize.getWidth() - 38,
        5,
        28,
        7
      );

      doc.setFontSize(10);
      doc.line(5, 15, pageSize.getWidth() - 7, 15);

      const today = new Date();
      const day = today.getDate();

      const month = today.getMonth();
      const year = today.getFullYear();

      doc.setFontSize(12);
      const formattedDate = `${day}/${month + 1}/${year}`;

      doc.text(`Date: ${formattedDate}`, pageSize.getWidth() - 39, 20);

      doc.addImage(
        AppImages.pdfFooterImage,
        "JPEG",
        0,
        pageHeight - 20,
        pageSize.getWidth() - 10,
        15
      );
    },
  });

  doc.setFont("Helvetica", "bold", 10);
  doc.save(`${downloadFileName}.pdf`);
};

export { generatePDF };
