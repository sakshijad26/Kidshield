import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
    })
  }, [])

  // Carousel state and controls
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselItems = [
    {
      title: "Protect Your Child's Future",
      description: "Ensure your child receives all essential vaccines on time",
      image: "https://via.placeholder.com/800x400",
      color: "from-blue-400 to-indigo-600"
    },
    {
      title: "Expert Pediatricians",
      description: "Consult with experienced doctors specialized in child healthcare",
      image: "https://via.placeholder.com/800x400",
      color: "from-indigo-400 to-blue-600"
    },
    {
      title: "Easy Appointment Booking",
      description: "Schedule vaccinations quickly with our user-friendly platform",
      image: "https://via.placeholder.com/800x400",
      color: "from-blue-500 to-indigo-700"
    }
  ]

  // Auto carousel functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselItems.length])

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const handleBookNow = () => {
    navigate('/doctors')
    scrollTo(0, 0)
  }

  const handleLearnMore = (index) => {
    navigate('/about')
    scrollTo(0, 0)
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Enhanced Header and Animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm mb-8"
      >
        <Header />
      </motion.div>
      
      {/* Carousel Section */}
      <div className="relative mb-12 mx-4 md:mx-10 overflow-hidden rounded-xl shadow-lg" data-aos="fade-up">
        <div className="relative h-64 md:h-96">
          {carouselItems.map((item, index) => (
            <motion.div 
              key={index}
              className={`absolute inset-0 w-full h-full ${index === currentSlide ? 'block' : 'hidden'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-80`}></div>
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-white mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  {item.title}
                </motion.h2>
                <motion.p 
                  className="text-lg md:text-xl text-white mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {item.description}
                </motion.p>
                <motion.button 
                  className="bg-white text-blue-700 py-2 px-6 rounded-full font-medium hover:bg-blue-50 transition-colors w-fit"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLearnMore(index)}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {carouselItems.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Trust Indicators Section with Staggered Animation */}
      <div className="px-4 py-8 bg-white rounded-lg shadow-sm mb-8 mx-4 md:mx-10" data-aos="fade-up">
        <h2 className="text-xl font-semibold text-center mb-6 text-blue-800" data-aos="fade">Why Parents Trust Us</h2>
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 text-center">
          <motion.div 
            className="flex flex-col items-center gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={fadeInUp}
          >
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800">Government Approved</h3>
            <p className="text-sm text-gray-600">All vaccines follow UIP guidelines</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={fadeInUp}
          >
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800">Expert Doctors</h3>
            <p className="text-sm text-gray-600">Qualified pediatricians</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            variants={fadeInUp}
          >
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800">Safe Storage</h3>
            <p className="text-sm text-gray-600">Cold chain maintained</p>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Vaccine Categories with Hover Effects */}
      <div className="bg-white rounded-lg shadow-sm mb-8 px-4 py-6 mx-4 md:mx-10" data-aos="fade-up">
        <h2 className="text-xl font-semibold text-blue-800 mb-4 text-center">Why Vaccination Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="bg-blue-50 p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-100"
            whileHover={{ scale: 1.03 }}
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <h3 className="font-medium text-blue-800 mb-2">Protection Against Diseases</h3>
            <p className="text-sm text-gray-600">Vaccines protect children from serious illnesses and complications of vaccine-preventable diseases.</p>
          </motion.div>
          <motion.div 
            className="bg-blue-50 p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-100"
            whileHover={{ scale: 1.03 }}
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <h3 className="font-medium text-blue-800 mb-2">Community Immunity</h3>
            <p className="text-sm text-gray-600">When enough people are vaccinated, it helps protect those who cannot be vaccinated due to age or health conditions.</p>
          </motion.div>
          <motion.div 
            className="bg-blue-50 p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-100"
            whileHover={{ scale: 1.03 }}
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <h3 className="font-medium text-blue-800 mb-2">Safe and Effective</h3>
            <p className="text-sm text-gray-600">All vaccines are rigorously tested for safety and effectiveness before being approved for use.</p>
          </motion.div>
          <motion.div 
            className="bg-blue-50 p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-100"
            whileHover={{ scale: 1.03 }}
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <h3 className="font-medium text-blue-800 mb-2">Cost-Effective Healthcare</h3>
            <p className="text-sm text-gray-600">Preventing disease is more cost-effective than treating serious illness that could have been prevented.</p>
          </motion.div>
        </div>
      </div>
      
      {/* Speciality Menu with Enhanced Styling */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm mb-8 mx-4 md:mx-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <SpecialityMenu />
      </motion.div>
      
      {/* Top Doctors/Vaccines Section */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm mb-8 mx-4 md:mx-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <TopDoctors />
      </motion.div>
      
      {/* Testimonials Carousel */}
      <div className="px-4 py-10 bg-white rounded-lg shadow-sm mb-8 mx-4 md:mx-10" data-aos="fade-up">
        <h2 className="text-2xl font-semibold text-center mb-8 text-blue-800">What Parents Say</h2>
        
        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {[
                {
                  name: "Rahul M.",
                  rating: 5,
                  text: "Scheduling my son's vaccines was so easy with this app. The reminders helped us stay on track with his immunization schedule."
                },
                {
                  name: "Anjali S.",
                  rating: 5,
                  text: "The doctors were very informative and took time to answer all my questions about the vaccines. Made me feel confident in my decisions."
                },
                {
                  name: "Vikram P.",
                  rating: 4,
                  text: "Digital records of all my child's vaccinations make it so much easier to keep track of everything. The interface is intuitive and user-friendly."
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="min-w-full px-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                        {testimonial.name[0]}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">{testimonial.name}</h3>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">{testimonial.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-blue-600' : 'bg-blue-200'}`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ Section with Accordion Animation */}
      <div className="px-4 py-10 bg-white rounded-lg shadow-sm mb-8 mx-4 md:mx-10" data-aos="fade-up">
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-800">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          {[
            {
              question: "When should I start vaccinating my child?",
              answer: "Vaccinations typically begin at birth with the BCG and Hepatitis B vaccines. The complete schedule follows the Universal Immunization Programme guidelines."
            },
            {
              question: "Are these vaccines safe?",
              answer: "Yes, all vaccines offered through our platform are approved by the government and follow strict safety protocols. They've been thoroughly tested for safety and efficacy."
            },
            {
              question: "What if my child misses a scheduled vaccine?",
              answer: "Our doctors can help create a catch-up schedule if your child has missed any vaccines. Book an appointment to discuss the best approach."
            },
            {
              question: "What should I do if my child has a reaction after vaccination?",
              answer: "Mild reactions like soreness at the injection site or low-grade fever are common. If more severe symptoms occur, contact your doctor immediately."
            }
          ].map((faq, index) => (
            <motion.div 
              key={index}
              className="border-b border-blue-100 py-4 last:border-b-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="font-medium text-blue-700 mb-2">{faq.question}</h3>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Enhanced Banner/CTA with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <Banner />
      </motion.div>

      {/* Floating Action Button for Quick Booking */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button 
          onClick={handleBookNow}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span className="ml-2 hidden md:inline">Book Now</span>
        </button>
      </motion.div>
    </div>
  )
}

export default Home