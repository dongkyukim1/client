import React from 'react';

interface SectionItemProps {
  id: string;
  title: string;
  content: string;
  items?: string[];
}

export default function SectionItem({ id, title, content, items }: SectionItemProps) {
  return (
    <section className="mb-6 last:mb-0">
      <h2 className="text-base font-medium text-gray-900 mb-2 flex">
        <span className="text-pink-500 font-medium mr-2">{id}</span>
        <span>{title}</span>
      </h2>
      
      <p className="text-gray-700 mb-3 text-sm leading-relaxed pl-0">
        {content}
      </p>
      
      {items && items.length > 0 && (
        <ul className="mb-4 pl-5">
          {items.map((item, index) => (
            <li key={index} className="mb-2 text-sm text-gray-700 list-disc">
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
} 