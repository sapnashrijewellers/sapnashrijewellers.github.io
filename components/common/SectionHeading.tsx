import React from 'react';

interface SectionHeadingProps {
  heading: string;
  punchline?: string;
  id?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ heading, punchline, id = 'trust-ribbon-heading' }) => {
  return (
    <div className="mb-3 flex flex-col justify-between gap-1 pb-3 sm:flex-row sm:items-center">
      <div>
        <h2 id={id} className="">
          {heading}
        </h2>
        {punchline && <p className="text-xs text-neutral-600">{punchline}</p>}
      </div>
    </div>
  );
};

export default SectionHeading;
