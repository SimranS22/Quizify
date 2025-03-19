import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function ExcelToJson() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const title = data[0][1];
      const questions = data.slice(2).map(row => ({
        question: row[0],
        options: [row[1], row[2], row[3], row[4]],
        correctAnswer: row[5]
      }));

      const formattedJson = {
        title: title,
        questions: questions
      };

      setJsonData(formattedJson);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="container">
      <input type="file" onChange={handleFileUpload} />
      {jsonData && (
        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
      )}
    </div>
  );
}

export default ExcelToJson;