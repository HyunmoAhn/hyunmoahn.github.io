import React from 'react';
import style from './Experience.module.css';

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
    <article className={style.projectCard}>
      <div className={style.projectImageWrapper}>
        {imageUrl ? (
          <img className={style.projectImage} src={imageUrl} alt={`${name} logo`} title={name} />
        ) : (
          <div className={style.projectImageFallback} aria-hidden="true" />
        )}
      </div>
      <div className={style.projectBody}>
        <p className={style.projectHeading}>
          <strong>{name}</strong>
          <span>{period}</span>
        </p>
        <p className={style.projectDescription}>
          {description.split('\n').map((chunk, index) => (
            <React.Fragment key={`${name}-desc-${index}`}>
              {chunk}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
      <footer className={style.projectFooter}>
        <em>{tech}</em>
      </footer>
    </article>
  );
}

function Experience({ name, role, period, description, projects }: ExperienceInfo) {
  return (
    <article className={style.experienceBlock}>
      <header className={style.experienceHeader}>
        <h3>{name}</h3>
        <p>
          <span>{role}</span>
          <em>{period}</em>
        </p>
      </header>
      <p className={style.experienceDescription}>{description}</p>
      <div className={style.projectGrid}>
        {projects.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </article>
  );
}

export default Experience;
