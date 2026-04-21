import React from 'react';
import { useData } from '../context/DataContext';
import { LinkIcon, MessageSquare, Globe, ExternalLink } from 'lucide-react';

export const Sidebar = () => {
  const { links } = useData();

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'discord':
      case 'messagesquare': return <MessageSquare size={20} />;
      case 'globe': return <Globe size={20} />;
      default: return <LinkIcon size={20} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Globe className="mr-2 text-emerald-600" size={20} />
        Community Links
      </h3>
      {links.length === 0 ? (
        <p className="text-sm text-gray-500">No links available at the moment.</p>
      ) : (
        <ul className="space-y-3">
          {links.map(link => (
            <li key={link.id}>
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-emerald-600">{getIcon(link.iconName)}</span>
                  <span className="font-medium">{link.title}</span>
                </div>
                <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
