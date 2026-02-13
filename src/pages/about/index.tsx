import React from 'react';
import Layout from '@theme/Layout';
import linebankIcon from '@site/static/icon/line-bank.png';
import linebankIdIcon from '@site/static/icon/line-bank-id.png';
import modusignIcon from '@site/static/icon/modusign.png';
import investIcon from '@site/static/icon/invest.png';
import lineMonaryIcon from '@site/static/icon/line-monary.jpeg';
import lineIcon from '@site/static/icon/line-brand.png';

import Experience, { ExperienceInfo, ProjectInfo } from '../../components/about/Experience';
import style from './index.module.css';

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
      <main className={style.pageWrap}>
        <div className={`container ${style.containerInner}`}>
          <section className={style.hero}>
            <article className={style.profileCard}>
              <div className={style.avatarRing}>
                <img
                  className={style.avatarImage}
                  src="https://github.com/hyunmoAhn.png"
                  alt="Hyunmo Ahn"
                />
              </div>
              <div className={style.profileInfo}>
                <p className={style.eyebrow}>Front-end Engineer</p>
                <h1>Hyunmo Ahn</h1>
                <p>
                  Building practical, high-quality web experiences with product-focused thinking.
                </p>
                <div className={style.contactRow}>
                  <a href="https://github.com/HyunmoAhn">GitHub</a>
                  <span>mos_dev@naver.com</span>
                </div>
              </div>
            </article>

            <article className={style.introCard}>
              <h2>Who am I?</h2>
              <p>
                I love building products and care deeply about how users actually experience them.
                <br />I enjoy learning modern technologies and understanding how each npm library
                works under the hood.
              </p>
              <ul>
                <li>7+ years in web frontend development</li>
                <li>Strong production experience in fintech and messenger ecosystems</li>
                <li>Focused on maintainable architecture and user-centric UI</li>
              </ul>
            </article>
          </section>

          <section className={style.sectionWrap}>
            <div className={style.sectionHeader}>
              <h2>Experience</h2>
            </div>
            <div>
              {EXPERIENCE_INFO.map((item) => (
                <Experience key={item.name} {...item} />
              ))}
            </div>
          </section>

          <section className={style.sectionWrap}>
            <div className={style.sectionHeader}>
              <h2>Education</h2>
            </div>
            <article className={style.educationCard}>
              <h3>
                <a href="https://www.pusan.ac.kr/eng/Main.do">Pusan National University of Korea</a>
              </h3>
              <p>
                Bachelor of Computer Science Engineering
                <br />
                <em>March 2013 to August 2019</em>
              </p>
            </article>
          </section>
        </div>
      </main>
    </Layout>
  );
}

export default About;
