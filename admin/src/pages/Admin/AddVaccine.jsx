import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AddVaccine = () => {
    const [vaccineId, setVaccineId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ageGroup, setAgeGroup] = useState('0-1 Years');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [doctors, setDoctors] = useState([]);
    
    const { backendUrl } = useContext(AppContext);
    const { aToken, getAllDoctors } = useContext(AdminContext);
    
    // Fetch doctors when component mounts
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } });
                if (data.success) {
                    setDoctors(data.doctors);
                    if (data.doctors.length > 0) {
                        setDoctorId(data.doctors[0]._id);
                    }
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
                console.log(error);
            }
        };
        
        if (aToken) {
            fetchDoctors();
        }
    }, [aToken, backendUrl]);
    
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        try {
            if (!vaccineId || !name || !description || !ageGroup || !stock || !category || !doctorId) {
                return toast.error('All fields are required');
            }
            
            // Find doctor data using doctorId
            const selectedDoctor = doctors.find(doctor => doctor._id === doctorId);
            if (!selectedDoctor) {
                return toast.error('Selected doctor not found');
            }
            
            const vaccineData = {
                vaccineId,
                name,
                description,
                ageGroup,
                stock: Number(stock),
                category,
                doctorId,
                doctorData: {
                    name: selectedDoctor.name,
                    image: selectedDoctor.image,
                    speciality: selectedDoctor.speciality
                },
                date: Date.now()
            };
            
            const { data } = await axios.post(backendUrl + '/api/admin/add-vaccine', vaccineData, { headers: { aToken } });
            
            if (data.success) {
                toast.success(data.message);
                // Reset form
                setVaccineId('');
                setName('');
                setDescription('');
                setAgeGroup('0-1 Years');
                setStock('');
                setCategory('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };
    
    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Vaccine</p>
            
            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Vaccine ID</p>
                            <input 
                                onChange={e => setVaccineId(e.target.value)} 
                                value={vaccineId} 
                                className='border rounded px-3 py-2' 
                                type="text" 
                                placeholder='Vaccine ID' 
                                required 
                            />
                        </div>
                        
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Vaccine Name</p>
                            <input 
                                onChange={e => setName(e.target.value)} 
                                value={name} 
                                className='border rounded px-3 py-2' 
                                type="text" 
                                placeholder='Vaccine Name' 
                                required 
                            />
                        </div>
                        
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Age Group</p>
                            <select 
                                onChange={e => setAgeGroup(e.target.value)} 
                                value={ageGroup} 
                                className='border rounded px-2 py-2'
                            >
                                <option value="0-1 Years">0-1 Years</option>
                                <option value="1-5 Years">1-5 Years</option>
                                <option value="5-12 Years">5-12 Years</option>
                                <option value="12-18 Years">12-18 Years</option>
                                <option value="18+ Years">18+ Years</option>
                                <option value="65+ Years">65+ Years</option>
                            </select>
                        </div>
                        
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Stock</p>
                            <input 
                                onChange={e => setStock(e.target.value)} 
                                value={stock} 
                                className='border rounded px-3 py-2' 
                                type="number" 
                                placeholder='Available Stock' 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Category</p>
                            <input 
                                onChange={e => setCategory(e.target.value)} 
                                value={category} 
                                className='border rounded px-3 py-2' 
                                type="text" 
                                placeholder='Vaccine Category' 
                                required 
                            />
                        </div>
                        
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Assign Doctor</p>
                            <select 
                                onChange={e => setDoctorId(e.target.value)} 
                                value={doctorId} 
                                className='border rounded px-2 py-2'
                            >
                                {doctors.map(doctor => (
                                    <option key={doctor._id} value={doctor._id}>
                                        {doctor.name} - {doctor.speciality}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                
                <div>
                    <p className='mt-4 mb-2'>Vaccine Description</p>
                    <textarea 
                        onChange={e => setDescription(e.target.value)} 
                        value={description} 
                        className='w-full px-4 pt-2 border rounded' 
                        rows={5} 
                        placeholder='Write about vaccine, its benefits, and potential side effects'
                        required
                    ></textarea>
                </div>
                
                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>
                    Add Vaccine
                </button>
            </div>
        </form>
    );
};

export default AddVaccine;