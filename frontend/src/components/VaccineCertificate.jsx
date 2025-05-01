import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const VaccineCertificate = () => {
  const [certificateData, setCertificateData] = useState(null);
  const certificateRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get certificate data from localStorage
    const storedData = localStorage.getItem('certificateData');
    if (storedData) {
      setCertificateData(JSON.parse(storedData));
    } else {
      // No certificate data found, redirect back to dashboard
      navigate('/child-dashboard');
    }
  }, [navigate]);

  const downloadAsPDF = () => {
    if (!certificateRef.current) return;
    
    html2canvas(certificateRef.current, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`vaccination_certificate_${certificateData.childName}.pdf`);
    });
  };

  if (!certificateData) {
    return <div className="flex justify-center items-center h-64">Loading certificate data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vaccination Certificate</h1>
        <div className="space-x-2">
          <button 
            onClick={downloadAsPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
          <button 
            onClick={() => navigate('/child-dashboard')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div 
          ref={certificateRef} 
          className="w-full max-w-3xl bg-white border-8 border-blue-100 rounded-lg shadow-lg p-8"
        >
          <div className="border-b-2 border-blue-500 pb-4 mb-6 text-center">
            <h2 className="text-2xl font-bold text-blue-800">Vaccination Certificate</h2>
            <p className="text-lg">Ministry of Health & Family Welfare</p>
            <p className="text-md">Government of India</p>
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-500">Certificate ID:</p>
              <p className="font-medium">{certificateData.certificateId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Issue Date:</p>
              <p className="font-medium">{certificateData.issueDate}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Beneficiary Name:</p>
                <p className="text-lg font-semibold">{certificateData.childName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aadhaar Number:</p>
                <p className="text-lg font-semibold">{certificateData.aadhaarNumber}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Vaccine Name:</p>
                  <p className="font-medium">{certificateData.vaccineName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vaccination Date:</p>
                  <p className="font-medium">{certificateData.vaccinatedDate}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">Vaccinated By:</p>
              <p className="font-medium">Dr. {certificateData.doctorName}</p>
              <p className="text-sm text-gray-600">{certificateData.doctorSpeciality}</p>
            </div>
            
            <div className="text-center border-t border-gray-200 pt-6 mt-8">
              <div className="bg-blue-800 text-white inline-block px-6 py-2 rounded-full">
                <p className="font-bold">VERIFIED DIGITAL CERTIFICATE</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This certificate verifies that the above individual has been vaccinated 
                according to the National Immunization Schedule.
              </p>
            </div>
            
            <div className="text-center mt-6">
              <div className="inline-block border-2 border-blue-800 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccineCertificate;