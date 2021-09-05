import React from 'react';
import style from '../index.module.css';

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

function ProjectCard({ name, description, imageUrl, tech, period }: ProjectInfo) {
  return (
    <div className={`${style.cardWrapper} col col--4  margin-bottom--md`}>
      <div className="card">
        <div className={`card__image ${style.cardImageWrapper}`}>
          <img className={style.cardImage} src={imageUrl} alt="projects" title={name} />
        </div>
        <div className="card__body">
          <p>
            <b>{name}</b> <br />
            <small>{period}</small>
          </p>
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <small>
            <em>{tech}</em>
          </small>
        </div>
      </div>
    </div>
  );
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
      <div className="row">
        {projects.map((project) => (
          <ProjectCard {...project} />
        ))}
      </div>
    </div>
  );
}

export default Experience;
