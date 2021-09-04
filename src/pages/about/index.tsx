import React from 'react';
import Layout from '@theme/Layout';
import Experience, { ExperienceInfo, ProjectInfo } from './Experience';
import style from '../index.module.css';

const EXPERIENCE_INFO: ExperienceInfo[] = [
  {
    name: 'LINE Financial+',
    role: 'Frontend Developer',
    period: 'July 2019 to Present',
    description:
      'LINE Corporation service messenger application. It is mainly used in Southeast Asian\n' +
      'countries such as Japan, Thailand, and Taiwan. LINE Financial have a goal to provide\n' +
      'fintech services with linked to LINE messenger.',
    projects: [] as ProjectInfo[],
  },
  {
    name: 'Modusign',
    role: 'Frontend Developer',
    period: 'December 2016 to February 2018',
    description:
      'Modusign service to contract with online. When we need to make a contract,\n' +
      'we usually prepare a paper contract and meet the other person and make a physical sign.\n' +
      'Modusign is a company that provides services that make it possible online',
    projects: [] as ProjectInfo[],
  },
];

function About() {
  return (
    <Layout title="About">
      <div className="container">
        <div className="row margin--lg margin-top--xl">
          <div className="avatar avatar--vertical col col--4 margin-bottom--md">
            <img
              className="avatar__photo avatar__photo--xl"
              src="https://github.com/hyunmoAhn.png"
              alt="icon"
            />
            <div className="avatar__intro">
              <div className="avatar__name">Hyunmo Ahn</div>
              <small className="avatar__subtitle">Web Front-end Developer</small>
              <small className="avatar__subtitle">
                <a href="https://github.com/HyunmoAhn">Github</a> | mos_dev@naver.com
              </small>
            </div>
          </div>
          <div className="card col col--8 margin-bottom--md">
            <div className="card__header">
              <h3>Who am I?</h3>
            </div>
            <div className="card__body">
              <p>
                I love to develop. <br />
                When I develop, I always think about how the user will use it. <br />
                I like to learn fresh technology or knowledge.
                <br />I have wonder that how to work about each npm library.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col col--2">
            <h2 className={style.underline}>Experience</h2>
          </div>
          <div className="col col--10">
            {EXPERIENCE_INFO.map((item) => (
              <Experience {...item} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default About;
