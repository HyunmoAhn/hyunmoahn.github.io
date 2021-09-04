import React from 'react';

export interface ProjectInfo {
  name: string;
  description: string;
  period: string;
  imageUrl?: string;
  tech: string;
}

export interface ExperienceInfo {
  name: string;
  role: string;
  period: string;
  description: string;
  projects: ProjectInfo[];
}

function Experience({ name, role, period, description, projects }: ExperienceInfo) {
  return (
    <div className="margin-bottom--xl">
      <h3>{name}</h3>
      <p>
        {role}
        <br />
        <em>{period}</em>
      </p>
      <p>{description}</p>
    </div>
  );
}

export default Experience;
