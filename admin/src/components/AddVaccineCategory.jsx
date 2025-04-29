import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext'; // Assuming you already have this

const AddVaccineCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [ageRequired, setAgeRequired] = useState('');
  const [stock, setStock] = useState('');

  const { backendUrl } = useContext(AppContext); // Get backend URL from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${backendUrl}/api/vaccine-category/add`, {
        name,
        description,
        type,
        ageRequired,
        stock: Number(stock)
      });

      if (data.success) {
        toast.success(data.message);
        setName('');
        setDescription('');
        setType('');
        setAgeRequired('');
        setStock('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while adding the vaccine category.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Add Vaccine Category</h2>

      <input value={name} onChange={e => setName(e.target.value)} placeholder="Vaccine Name" className="input-field" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="input-field" />
      <input value={type} onChange={e => setType(e.target.value)} placeholder="Type (Live/Inactivated/etc.)" className="input-field" />
      <input value={ageRequired} onChange={e => setAgeRequired(e.target.value)} placeholder="Age Required" className="input-field" />
      <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="Stock" className="input-field" required />

      <button type="submit" className="mt-4 px-4 py-2 bg-primary text-white rounded">Add Vaccine</button>
    </form>
  );
};

export default AddVaccineCategory;
