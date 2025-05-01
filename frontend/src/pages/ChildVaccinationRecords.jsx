import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Format date nicely
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ChildVaccinationRecords = () => {
  const { token, backendUrl } = useContext(AppContext);
  const { childId } = useParams(); // 👈 If you ever want to support /child/vaccination-records/:childId
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVaccinationRecords = async () => {
      setLoading(true);
      try {
        const url = `${backendUrl}/api/user/vaccination-records${childId ? `/${childId}` : ""}`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            token: token, // 👈 authUser middleware expects 'token' in headers, not 'Authorization: Bearer'
          },
        });

        const data = await response.json();

        if (response.ok && data.success && Array.isArray(data.records)) {
          setRecords(data.records);
          setError("");
        } else {
          setRecords([]);
          setError(data.message || "Failed to load vaccination records.");
        }
      } catch (error) {
        console.error("Error fetching vaccination records:", error);
        setRecords([]);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchVaccinationRecords();
    }
  }, [token, childId, backendUrl]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          My Vaccination Records
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 animate-pulse">
            Loading records...
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            {error}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center text-gray-500">
            No vaccination records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vaccine Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 relative">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.vaccineData?.name || "Unknown Vaccine"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.vaccineData?.type || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.doctorData?.name || "Unknown Doctor"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.doctorData?.speciality || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                          record.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : record.status === "missed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/child/vaccine-details/${record._id}`}
                        className="text-primary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChildVaccinationRecords;
