import React from 'react';
import Layout from '@theme/Layout';
import linebankIcon from '@site/static/icon/line-bank.png';
import linebankIdIcon from '@site/static/icon/line-bank-id.png';
import modusignIcon from '@site/static/icon/modusign.png';
import investIcon from '@site/static/icon/invest.png';
import lineMonaryIcon from '@site/static/icon/line-monary.jpeg';
import lineIcon from '@site/static/icon/line-brand.png';

import Experience, { ExperienceInfo, ProjectInfo } from '../../components/about/Experience';
import style from '../index.module.css';

const EXPERIENCE_INFO: ExperienceInfo[] = [
  {
    name: 'LINE+',
    role: 'Frontend Developer',
    period: 'October 2023 to Present',
    description: `LINE Plus Corporation was established in March 2013 in South Korea to support LINE's global business development and expansion.
LINE Plus employees work with colleagues from around the world in areas such as engineering, planning, design, sales and marketing, and communications`,
    projects: [
      {
        name: 'GCS - General Content Service',
        description:
          'Managing tools to Server Driven UI on LINE messenger app. UI design also edit on out tools like Figma',
        period: 'December 2023 to Present',
        tech: 'Typescript, NextJS(App Router), React, SWR, Nx',
        imageUrl: lineIcon,
      },

      {
        name: 'Line Wallet',
        description:
          'Role to development about web service on wallet part of line messenger app like Line Monary, Line Receipt etc.',
        period: 'October 2023 to Present',
        tech: 'Typescript, NextJS, React, SWR, Nx',
        imageUrl: lineIcon,
      },
    ],
  },
  {
    name: 'LINE Biz+',
    role: 'Frontend Developer',
    period: 'June 2019 to September 2023',
    description:
      'LINE Corporation service messenger application. It is mainly used in Southeast Asian\n' +
      'countries such as Japan, Thailand, and Taiwan. LINE Biz have a goal to provide\n' +
      'fintech services with linked to LINE messenger.',
    projects: [
      {
        name: 'LINE Monary',
        description: 'Content delivery that deepens knowledge of a wide range about money',
        period: 'April 2023 to September 2023',
        tech: 'Typescript, NextJS, SWR',
        imageUrl: lineMonaryIcon,
      },
      {
        name: 'LINE bank JP',
        description: 'Internet bank with Line messenger in Japan',
        period: 'November 2020 to March 2023',
        tech: 'Typescript, React, Redux, Redux-saga, webpack',
        imageUrl: linebankIcon,
      },
      {
        name: 'LINE bank ID',
        description: 'Internet bank with Line messenger in Indonesia',
        period: 'July 2020 to December 2020',
        tech: 'Typescript/Javascript, React, Redux, Redux-saga, webpack',
        imageUrl: linebankIdIcon,
      },
      {
        name: 'LINE bank TW',
        description: 'Internet bank with Line messenger in Taiwan',
        period: 'October 2019 to December 2020',
        tech: 'React, Redux, Redux-saga, webpack',
        imageUrl: linebankIcon,
      },
      {
        name: 'Smart Invest JP',
        description:
          'A web service that links Follio investment companies to facilitate investment in Line Messenger.',
        period: 'June 2019 to April 2020',
        tech: 'Vue2, vuex, vue-cli',
        imageUrl: investIcon,
      },
    ] as ProjectInfo[],
  },
  {
    name: 'Modusign',
    role: 'Frontend Developer',
    period: 'December 2016 to February 2018',
    description:
      'Modusign service to contract with online. When we need to make a contract,\n' +
      'we usually prepare a paper contract and meet the other person and make a physical sign.\n' +
      'Modusign is a company that provides services that make it possible online',
    projects: [
      {
        name: 'Modusign Service',
        description: 'A web service that support to online contract',
        period: 'December 2016 to February 2018',
        tech: 'React, Redux, Redux-thunk, webpack',
        imageUrl: modusignIcon,
      },
    ] as ProjectInfo[],
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
        <div className="row container">
          <div className="col col--2">
            <h2 className={style.underline}>Experience</h2>
          </div>
          <div className="col col--10 row margin-bottom--lg">
            {EXPERIENCE_INFO.map((item) => (
              <Experience key={item.name} {...item} />
            ))}
          </div>
        </div>
        <div className="row container">
          <div className="col col--2">
            <h2 className={style.underline}>Education</h2>
          </div>
          <div className="col col--10 row margin-bottom--lg">
            <div className="margin-bottom--xl">
              <h3>
                <a href="https://www.pusan.ac.kr/eng/Main.do">Pusan National University of Korea</a>
              </h3>
              <p>
                Bachelor of Computer Science Engineering
                <br />
                <em>Match 2013 to August 2019</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default About;
