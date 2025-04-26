import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>ABOUT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="About KidShield" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to <span className="font-semibold text-gray-700">KidShield</span>, your reliable partner in protecting your child's health through a smarter vaccine management system. We understand how important timely vaccinations are and how easily they can be missed in a busy lifestyle.</p>
          <p>At KidShield, we aim to simplify and secure the way vaccinations are tracked and managed. From Aadhaar-based child verification to real-time vaccination updates, we offer a seamless experience to parents and healthcare providers alike. Your child’s health is our top priority.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Our vision is to create a healthier future by ensuring every child receives the right vaccines at the right time. By bridging the gap between parents and healthcare systems, we strive to make vaccine tracking effortless, transparent, and accessible to everyone.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY  <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>SECURITY & ACCURACY:</b>
          <p>Using Aadhaar integration ensures each child's vaccination records are safe, unique, and tamper-proof.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>REMINDERS & TRACKING:</b>
          <p>Never miss a vaccine again with personalized schedules and automatic reminders.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EASY ACCESS:</b>
          <p>Parents, doctors, and administrators can view vaccination records from anywhere, anytime.</p>
        </div>
      </div>

    </div>
  )
}

export default About
