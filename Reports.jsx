import React, { useEffect, useRef } from "react";
import { Button, Divider, Spin, Table } from "antd";
import { useState } from "react";
import "../fileAllocation.scss";
import { useDispatch, useSelector } from "react-redux";
import { getDistrictwiseDocumentList } from "../../../store/Actions/BaseAction";
import { URLS } from "../../../globals/urls";
import "./allDocument.scss";
import "../../../style/tableStyle.scss";
import "../../../style/commonStyle.scss";
import { setTableHeight } from "../../../globals/healpers";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { AppImages } from "../../../globals/AppImages";

const Reports = () => {
  const dispatch = useDispatch();
  const componentRef = useRef({});

  const rectificationDetails = [
    {
      title: "District Name",
      dataIndex: "district_name",
    },
    {
      title: "Scan Uploaded",
      dataIndex: "scan_uploaded_count",
    },
    {
      title: "Rectify Completed",
      dataIndex: "rectify_completed_count",
    },
    {
      title: "Digitize Completed",
      dataIndex: "digitize_allocated_count",
    },
    {
      title: "QC Completed",
      dataIndex: "qc_completed_count",
    },
  ];

  const [tableData, settableData] = useState([]);

  useEffect(() => {
    dispatch(
      getDistrictwiseDocumentList({
        URL: URLS.GET_DISTRICT_WISE_DOCUMENT_LIST,
      })
    );
  }, []);

  let thisPageMainUrl = false;
  const selector = useSelector((state) => state.districtWiseDocumentList);
  if (selector && thisPageMainUrl === false) {
    thisPageMainUrl = selector.next;
  }

  useEffect(() => {
    if (selector) {
      settableData(selector);
    }
  }, [selector]);

  let columns = rectificationDetails;

  useEffect(() => {}, [tableData]);

  const lodingFromState = useSelector((state) => state.loading);

  const generatePDF = () => {
    const doc = new jsPDF();

    const tableHeaders = [
      "District Name",
      "Scan Uploaded",
      "Rectify Completed",
      "Digitize Completed",
      "QC Completed",
    ];

    let tableDetails = [];

    for (let index = 0; index < tableData.length; index++) {
      let row = [];
      row.push(tableData[index]["district_name"]);
      row.push(tableData[index]["scan_uploaded_count"]);
      row.push(tableData[index]["rectify_completed_count"]);
      row.push(tableData[index]["digitize_completed_count"]);
      row.push(tableData[index]["qc_completed_count"]);
      tableDetails.push(row);
    }

    tableDetails = [
      ...tableDetails,
      ...tableDetails,
      ...tableDetails,
      ...tableDetails,
      ...tableDetails,
    ];

    doc.setFont("Helvetica", "bold", 10);

    doc.autoTable({
      head: [tableHeaders],
      body: tableDetails,
      styles: {
        lineWidth: 0.001,
        lineColor: [0, 0, 0],
      },
      columnStyles: { europe: { halign: "center" }, theme: "striped" },
      margin: { horizontal: 10, vertical: 20 },
      bodyStyles: { valign: "top" },
      theme: "striped",
      showHead: "everyPage",
      didDrawPage: function (data) {
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text(
          "District Wise Completed Files ",
          data.settings.margin.left,
          10
        );

        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();

        doc.addImage(
          AppImages.metaiImage,

          "JPEG",
          pageSize.getWidth() - 40,
          5,
          30,
          7
        );

        doc.setFontSize(10);

        doc.line(5, 15, pageSize.getWidth() - 7, 15);

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
    doc.save("District_wise_completed_files.pdf");
  };

  return (
    <>
      <Spin spinning={lodingFromState}>
        <Divider orientation="left">Ditrict Wise Completed Files</Divider>
        <Button
          type="dashed"
          onClick={generatePDF}
          className="exporting-button"
        >
          Print
        </Button>
        <div ref={componentRef}>
          <div className="ant-table-container-wrapper"></div>
        </div>
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          scroll={setTableHeight()}
        />
      </Spin>
    </>
  );
};

export default Reports;
