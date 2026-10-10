import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  ChevronDown,
  Code2,
  Cpu,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Network,
  Send,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';

const PROFILE = {
  name: 'Dhornagambala Dhanush',
  email: 'dhanushdhornagambala24@gmail.com',
  github: 'https://github.com/Dhanush-002b',
  linkedin: 'https://www.linkedin.com/in/dhanush-d-5426932b7?utm_source=share_via&utm_content=profile&utm_medium=member_android',
};

const skills = [
  { name: 'Python', icon: 'Py', level: 78, category: 'Programming' },
  { name: 'Java', icon: 'Ja', level: 70, category: 'Programming' },
  { name: 'C', icon: 'C', level: 65, category: 'Programming' },
  { name: 'HTML', icon: '5', level: 84, category: 'Web' },
  { name: 'CSS', icon: '3', level: 80, category: 'Web' },
  { name: 'JavaScript', icon: 'JS', level: 68, category: 'Web' },
  { name: 'Networking', icon: '↗', level: 74, category: 'Technology' },
  { name: 'AI / ML', icon: '✳', level: 58, category: 'Technology' },
  { name: 'Data Structures', icon: '⌘', level: 65, category: 'Foundations' },
  { name: 'Git & GitHub', icon: '⑂', level: 70, category: 'Tools' },
];

const projects = [
  {
    number: '01',
    title: 'Hospital Waiting Queue System',
    description:
      'A full-stack application for managing patient queues in hospitals. Features include patient registration, queue management, priority-based ordering, and real-time queue status tracking with an Express.js backend and interactive web frontend.',
    technologies: ['Node.js', 'Express.js', 'JavaScript', 'HTML', 'CSS'],
    icon: Layers3,
    demo: true,
    repoUrl: 'https://github.com/Dhanush-002b/hospital-queue',
    demoUrl: '/hospital-queue/frontend/index.html',
  },
  {
    number: '02',
    title: 'Hotel Billing System',
    description:
      'A practical hotel billing calculator that computes room charges, discounts for extended stays, GST, and the final payable total in a clean billing dashboard.',
    technologies: ['Python', 'Tkinter', 'GUI', 'Billing'],
    icon: Terminal,
    demo: true,
    repoUrl: 'https://github.com/Dhanush-002b',
    demoUrl: '/hotel-billing/index.html',
  },
  {
    number: '03',
    title: 'Daily Task Organizer',
    description:
      'A simple task organizer concept to help users keep track of their everyday to-dos.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    icon: Check,
    demo: true,
    repoUrl: 'https://github.com/your-username/daily-task-organizer',
    demoUrl: 'https://your-demo-url.example/daily-task-organizer',
  },
  {
    number: '04',
    title: 'AI / ML Project',
    description:
      'An AI and machine learning project entry. Add the project topic, approach, and results here.',
    technologies: ['Python', 'AI / ML'],
    icon: Cpu,
    demo: false,
    repoUrl: 'https://github.com/your-username/ai-ml-project',
  },
  {
    number: '05',
    title: 'College Quiz Website',
    description:
      'A quiz website project entry. Add details about its features and implementation here.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    icon: Braces,
    demo: true,
    repoUrl: 'https://github.com/your-username/college-quiz-website',
    demoUrl: 'https://your-demo-url.example/college-quiz-website',
  },
];

const navLinks = [
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Projects', '#projects'],
  ['Experience', '#experience'],
  ['Education', '#education'],
  ['Contact', '#contact'],
];

function Reveal({ children, className = '', delay = 0 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = document.querySelector(`[data-reveal-id="${id}"]`);
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const id = useState(() => `reveal-${Math.random().toString(36).slice(2)}`)[0];

  return (
    <div
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      data-reveal-id={id}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, accent, note }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</span>
        <h2>{title} <span>{accent}</span></h2>
      </div>
      {note && <p className="section-note">{note}</p>}
    </div>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a className="social-link" href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {children}
    </a>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 24);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav-wrap container" aria-label="Main navigation">
        <a className="brand" href="#home" aria-label="Dhanush home">
          <span className="brand-mark">D<span>.</span></span>
          <span className="brand-name">DHANUSH<span>PORTFOLIO</span></span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>
            Let&apos;s talk <ArrowUpRight size={14} />
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-grid container">
        <div className="hero-copy">
          <Reveal>
            <div className="availability"><span /> OPEN TO INTERNSHIP OPPORTUNITIES</div>
            <p className="hero-pretitle">HELLO, I&apos;M</p>
            <h1>DHORNAGAMBALA<br /><span>DHANUSH</span><i>.</i></h1>
            <div className="hero-role">
              <span className="role-line" />
              <p>B.Tech CSE <span>(AI &amp; ML)</span> Student</p>
            </div>
            <p className="hero-tagline">
              Building practical solutions with <span>code, AI</span><br className="desktop-break" />
              {' '}and technology.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">View My Projects <ArrowRight size={16} /></a>
              <a className="button button-secondary" href="./resume.html" download="Dhornagambala_Dhanush_Resume.html">
                <Download size={16} /> Download Resume
              </a>
            </div>
            <div className="hero-socials">
              <SocialLink href={PROFILE.github} label="GitHub profile"><Github size={17} /></SocialLink>
              <SocialLink href={PROFILE.linkedin} label="LinkedIn profile"><Linkedin size={17} /></SocialLink>
              <span className="social-caption">FIND ME ONLINE</span>
            </div>
          </Reveal>
        </div>
        <Reveal className="hero-visual-wrap" delay={130}>
          <div className="hero-visual" aria-label="Abstract connected nodes representing technology">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-orbit orbit-three" />
            <svg className="network-lines" viewBox="0 0 500 500" aria-hidden="true">
              <path d="M85 135 195 98 292 151 403 103M85 135 122 257 230 221 292 151M122 257 170 381 285 333 230 221M230 221 365 260 403 103M285 333 365 260 415 374" />
              <path d="M195 98 230 221 365 260M122 257 285 333 415 374" />
            </svg>
            <span className="node node-a" /><span className="node node-b" />
            <span className="node node-c" /><span className="node node-d" />
            <span className="node node-e" /><span className="node node-f" />
            <span className="node node-g" /><span className="node node-h" />
            <span className="node node-i" /><span className="node node-j" />
            <div className="core-chip">
              <span className="core-icon"><Cpu size={30} strokeWidth={1.5} /></span>
              <span>CURIOUS BY DESIGN</span>
            </div>
            <div className="visual-label label-top"><span>01</span> BUILD</div>
            <div className="visual-label label-bottom"><Sparkles size={13} /> LEARN · CREATE · ITERATE</div>
          </div>
          <div className="hero-float-card float-card-one">
            <span className="float-icon"><Code2 size={16} /></span>
            <span><b>10+</b><small>TECH SKILLS</small></span>
          </div>
          <div className="hero-float-card float-card-two">
            <span className="float-icon purple"><GraduationCap size={17} /></span>
            <span><b>AI &amp; ML</b><small>FOCUSED LEARNING</small></span>
          </div>
          <div className="hero-scroll"><span /> SCROLL TO EXPLORE <ArrowDown size={13} /></div>
        </Reveal>
      </div>
      <div className="hero-bottom container">
        <span><MapPin size={14} /> NELLORE, ANDHRA PRADESH, INDIA</span>
        <span className="hero-bottom-right">SOFTWARE <i>·</i> AI / ML <i>·</i> NETWORKING</span>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="A LITTLE ABOUT ME" title="Curiosity into" accent="capability." />
        </Reveal>
        <div className="about-grid">
          <Reveal className="about-main">
            <span className="about-index">01 / ABOUT</span>
            <p className="about-lead">
              I&apos;m a Computer Science student who enjoys turning ideas into
              <span> useful, working technology.</span>
            </p>
            <p className="body-copy">
              Currently pursuing B.Tech in Computer Science and Engineering (AI &amp; ML)
              at Sree Venkateshwara College of Engineering, Nellore. I&apos;m interested in
              software development, artificial intelligence, networking, and building
              real-world applications. I&apos;m eager to keep learning, contribute to a team,
              and grow through hands-on work.
            </p>
            <a className="text-link" href="#contact">Let&apos;s connect <ArrowUpRight size={15} /></a>
          </Reveal>
          <Reveal className="about-side" delay={100}>
            <div className="about-stat-card">
              <span className="stat-icon"><GraduationCap size={18} /></span>
              <span className="stat-label">CURRENTLY STUDYING</span>
              <strong>B.Tech CSE</strong>
              <span className="stat-sub">Artificial Intelligence &amp; Machine Learning</span>
              <div className="stat-divider" />
              <div className="stat-row"><span>CGPA</span><b>8.02</b></div>
            </div>
            <div className="about-stat-card diploma-card">
              <span className="stat-icon purple"><Sparkles size={17} /></span>
              <span className="stat-label">DIPLOMA</span>
              <strong>Computer Engineering</strong>
              <div className="stat-row"><span>RESULT</span><b>88%</b></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section skills-section" id="skills">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="MY TOOLKIT"
            title="Skills I bring"
            accent="to the table."
            note="A growing toolkit built through coursework, projects, and hands-on learning."
          />
        </Reveal>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <Reveal key={skill.name} delay={(index % 5) * 55}>
              <article className="skill-card">
                <div className="skill-card-top">
                  <span className={`skill-glyph glyph-${index % 5}`}>{skill.icon}</span>
                  <span className="skill-category">{skill.category}</span>
                </div>
                <div className="skill-name-row"><h3>{skill.name}</h3><span>{skill.level}%</span></div>
                <div className="skill-track" role="progressbar" aria-label={`${skill.name} proficiency`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={skill.level}>
                  <span style={{ '--skill-level': `${skill.level}%` }} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="skill-footnote">
          <span className="footnote-spark"><Sparkles size={15} /></span>
          Proficiency indicators are self-assessments and reflect an ongoing learning journey.
        </Reveal>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section projects-section" id="projects">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="SELECTED WORK"
            title="Projects with"
            accent="purpose."
            note="A selection of projects and concepts. Project links are placeholders until published."
          />
        </Reveal>
        <div className="projects-grid">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <Reveal key={project.number} delay={(index % 2) * 80} className="project-reveal">
                <article className="project-card">
                  <div className="project-card-top">
                    <span className="project-number">PROJECT / {project.number}</span>
                    <span className="project-icon"><Icon size={19} strokeWidth={1.7} /></span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tech-tags">
                    {project.technologies.map((tech) => <span key={tech}>{tech}</span>)}
                  </div>
                  <div className="project-links">
                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                      <Github size={15} /> GitHub <ArrowUpRight size={13} />
                    </a>
                    {project.demo && (
                      <a href={project.demoUrl} target="_blank" rel="noreferrer">
                        Live Demo <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section experience-section" id="experience">
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="HANDS-ON LEARNING" title="Experience &" accent="activities." />
        </Reveal>
        <div className="experience-layout">
          <Reveal className="experience-card">
            <div className="experience-marker"><Network size={19} /></div>
            <div className="experience-content">
              <div className="experience-meta"><span>INTERNSHIP</span><span>6 MONTHS</span></div>
              <h3>Networking Assistant Intern</h3>
              <p className="experience-company">SVIMS Institution <span>·</span> Tirupati</p>
              <p className="body-copy">
                Gained hands-on exposure to networking support, troubleshooting,
                system assistance, and basic network administration during a
                six-month internship.
              </p>
              <div className="tech-tags">
                <span>Networking</span><span>Troubleshooting</span><span>System Support</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="activities-card" delay={100}>
            <span className="eyebrow"><span className="eyebrow-dot" /> BEYOND THE CLASSROOM</span>
            <h3>Learning by<br /><span>doing.</span></h3>
            <ul>
              <li><span><Check size={14} /></span> Python workshops</li>
              <li><span><Check size={14} /></span> Zero Trust cloud security learning</li>
              <li><span><Check size={14} /></span> Academic and technical projects</li>
              <li><span><Check size={14} /></span> Networking internship experience</li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Education() {
  const entries = [
    {
      date: 'CURRENT DEGREE',
      title: 'B.Tech — CSE (AI & ML)',
      school: 'Sree Venkateshwara College of Engineering',
      location: 'Nellore',
      score: '8.02',
      scoreLabel: 'CGPA',
      current: true,
    },
    {
      date: 'DIPLOMA',
      title: 'Diploma — Computer Engineering',
      school: 'Government Polytechnic College',
      location: 'Pillaripattu',
      score: '88%',
      scoreLabel: 'PERCENTAGE',
    },
  ];
  return (
    <section className="section education-section" id="education">
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="THE FOUNDATION" title="Education &" accent="growth." />
        </Reveal>
        <div className="education-timeline">
          {entries.map((entry, index) => (
            <Reveal key={entry.title} delay={index * 100} className="education-entry">
              <div className="timeline-rail"><span className={entry.current ? 'active' : ''} /></div>
              <article className="education-card">
                <div className="education-main">
                  <span className="education-date">{entry.date}</span>
                  <h3>{entry.title}</h3>
                  <p>{entry.school}</p>
                  <span className="education-location"><MapPin size={13} /> {entry.location}</span>
                </div>
                <div className="education-score">
                  <span>{entry.scoreLabel}</span>
                  <strong>{entry.score}</strong>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  const certifications = [
    { name: 'Network Assistant Certificate', issuer: 'SVIMS Institution', icon: Network },
    { name: 'Python Workshop Certificates', issuer: 'Workshop participation', icon: Terminal },
    { name: 'Zero Trust Cloud Security', issuer: 'Zscaler · EduSkills', icon: Cpu },
  ];
  return (
    <section className="section certifications-section" id="certifications">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="CONTINUOUS LEARNING"
            title="Certifications &"
            accent="workshops."
            note="Learning milestones shared from my training and internship experience."
          />
        </Reveal>
        <div className="cert-grid">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <Reveal key={cert.name} delay={index * 70}>
                <article className="cert-card">
                  <span className="cert-icon"><Icon size={19} /></span>
                  <div><h3>{cert.name}</h3><p>{cert.issuer}</p></div>
                  <ArrowDownRight size={16} className="cert-arrow" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Achievements() {
  return (
    <section className="achievement-strip">
      <div className="container achievement-inner">
        <Reveal className="achievement-intro">
          <span className="eyebrow"><span className="eyebrow-dot" /> PROGRESS, NOT PERFECTION</span>
          <h2>Small steps.<br /><span>Solid foundations.</span></h2>
          <p>Focused on steady growth through academics, practical projects, workshops, and real-world exposure.</p>
        </Reveal>
        <div className="achievement-stats">
          <Reveal><div className="achievement-item"><strong>8.02</strong><span>B.TECH CGPA</span><small>Academic performance</small></div></Reveal>
          <Reveal delay={70}><div className="achievement-item"><strong>88%</strong><span>DIPLOMA</span><small>Computer Engineering</small></div></Reveal>
          <Reveal delay={140}><div className="achievement-item"><strong>6<span> mo</span></strong><span>INTERNSHIP</span><small>Networking experience</small></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function Resume() {
  return (
    <section className="section resume-section" id="resume">
      <div className="container">
        <Reveal className="resume-card">
          <div className="resume-pattern" aria-hidden="true"><div /><div /><div /></div>
          <div className="resume-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> RECRUITER READY</span>
            <h2>A clear picture<br />of <span>what I bring.</span></h2>
            <p>Get my ATS-friendly resume with my education, skills, and internship experience.</p>
          </div>
          <a className="button button-primary resume-button" href="./resume.html" download="Dhornagambala_Dhanush_Resume.html">
            <Download size={16} /> Download Resume <ArrowUpRight size={15} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const [formState, setFormState] = useState('idle');

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    setFormState('opened');
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="GET IN TOUCH" title="Have something" accent="in mind?" />
        </Reveal>
        <div className="contact-grid">
          <Reveal className="contact-copy">
            <h3>Let&apos;s make<br /><span>something matter.</span></h3>
            <p>I&apos;m open to internship opportunities, collaborations, and conversations about technology. Drop me a message.</p>
            <div className="contact-details">
              <a href={`mailto:${PROFILE.email}`}><span><Mail size={17} /></span><div><small>EMAIL</small><b>{PROFILE.email}</b></div><ArrowUpRight size={14} /></a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer"><span><Linkedin size={17} /></span><div><small>LINKEDIN</small><b>linkedin.com/in/dhanush-d-5426932b7</b></div><ArrowUpRight size={14} /></a>
              <a href={PROFILE.github} target="_blank" rel="noreferrer"><span><Github size={17} /></span><div><small>GITHUB</small><b>github.com/Dhanush-002b</b></div><ArrowUpRight size={14} /></a>
              <div className="contact-location"><span><MapPin size={17} /></span><div><small>LOCATION</small><b>Nellore, Andhra Pradesh, India</b></div></div>
            </div>
          </Reveal>
          <Reveal className="contact-form-wrap" delay={100}>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-heading"><span>YOUR MESSAGE</span><Sparkles size={15} /></div>
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" placeholder="Your name" autoComplete="name" required />
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" placeholder="What would you like to talk about?" rows="4" required />
              <button className="button button-primary form-submit" type="submit">
                Send Message <Send size={15} />
              </button>
              <p className={`form-note ${formState === 'opened' ? 'form-note-active' : ''}`} aria-live="polite">
                {formState === 'opened'
                  ? 'Your email app should open with the message ready to send.'
                  : `This form opens your email app to send a message to ${PROFILE.email}.`}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <a className="brand" href="#home">
          <span className="brand-mark">D<span>.</span></span>
          <span className="brand-name">DHANUSH<span>PORTFOLIO</span></span>
        </a>
        <span className="footer-note">Designed with intention. Built for what&apos;s next.</span>
        <a className="back-top" href="#home">BACK TO TOP <ChevronDown size={14} /></a>
        <span className="footer-copyright">© {new Date().getFullYear()} DHORNAGAMBALA DHANUSH</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <Achievements />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
