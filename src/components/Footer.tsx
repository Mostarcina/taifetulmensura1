import React from 'react';
import { Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold text-white mb-2">NoorBlog</h3>
          <p className="text-sm text-gray-400">Sharing Islamic knowledge and reflections.</p>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <p className="text-sm mb-2">Contact us for inquiries:</p>
          <a href="mailto:mn2.mostar@gmail.com" className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition">
            <Mail size={18} />
            <span>mn2.mostar@gmail.com</span>
          </a>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} NoorBlog. All rights reserved.
      </div>
    </footer>
  );
};
