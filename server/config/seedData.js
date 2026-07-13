const User = require('../models/User');
const Project = require('../models/Project');
const Connection = require('../models/Connection');

// Pre-computed bcrypt hash for password 'password123'
const DEFAULT_PASSWORD_HASH = '$2a$10$U2zO8H7J4T50v47fQ7Y0Qe6w/2D27j7P7c5s5U1lB3iXwR5Xy7Kze';

const DEVELOPERS = [
  {
    name: 'Ananya Sharma',
    username: 'ananya_java',
    email: 'ananya@devconnect.com',
    password: DEFAULT_PASSWORD_HASH,
    college: 'CGC Landran',
    location: 'Chandigarh, India',
    bio: 'Java Backend Engineer specializing in building scalable Spring Boot APIs and cloud server deployments on AWS.',
    skills: ['Java', 'Spring Boot', 'AWS', 'MySQL', 'Docker', 'Hibernate', 'RESTful APIs'],
    about: 'I am a backend specialist who loves designing database schemas, query optimizations, and microservices logic. I focus heavily on writing thread-safe Java APIs and configuring secure VPC grids on AWS.',
    github: 'https://github.com/ananyasharma-code',
    linkedin: 'https://linkedin.com/in/ananyasharma-java',
    portfolio: 'https://ananya-codes.dev',
    profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ananya',
    projects: [
      {
        title: 'InventoryPro',
        description: 'An enterprise-grade inventory tracker API featuring automated stock replenishment triggers, PDF billing, and transactional email alerts.',
        techStack: ['Java', 'Spring Boot', 'MySQL', 'Thymeleaf'],
        githubLink: 'https://github.com/ananya-java/inventorypro',
        liveDemoLink: 'https://inventorypro-demo.devconnect.com',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: 'ExpensePilot',
        description: 'Personal finance planner featuring automated CSV expense categorization, recurring monthly budgets, and AWS S3 invoice archiving.',
        techStack: ['Java', 'Spring Boot', 'AWS S3', 'PostgreSQL'],
        githubLink: 'https://github.com/ananya-java/expensepilot',
        liveDemoLink: 'https://expensepilot.devconnect.com',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    name: 'Arjun Mehta',
    username: 'arjun_react',
    email: 'arjun@devconnect.com',
    password: DEFAULT_PASSWORD_HASH,
    college: 'Delhi Technological University',
    location: 'New Delhi, India',
    bio: 'Frontend Developer obsessed with React, Next.js, and pixel-perfect design systems.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Figma'],
    about: 'I design and build interactive visual experiences. I enjoy building modular UI component systems, performance tuning virtual DOM lists, and translating intricate designs from Figma into production-ready React code.',
    github: 'https://github.com/arjun-mehta',
    linkedin: 'https://linkedin.com/in/arjunmehta-dev',
    portfolio: 'https://arjunmehta.design',
    profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=arjun',
    projects: [
      {
        title: 'ShopEase',
        description: 'A responsive e-commerce storefront featuring Stripe checkout, dynamic inventory search grids, and cart context hooks.',
        techStack: ['React', 'Tailwind CSS', 'Redux Toolkit', 'Stripe'],
        githubLink: 'https://github.com/arjun-react/shopease',
        liveDemoLink: 'https://shopease-demo.devconnect.com',
        imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d296e?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: 'TaskFlow',
        description: 'A visual project canvas layout supporting drag-and-drop tasks columns, visual charts analytics, and team comments boards.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'React-Beautiful-Dnd'],
        githubLink: 'https://github.com/arjun-react/taskflow',
        liveDemoLink: 'https://taskflow.devconnect.com',
        imageUrl: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    name: 'Rahul Verma',
    username: 'rahul_devops',
    email: 'rahul@devconnect.com',
    password: DEFAULT_PASSWORD_HASH,
    college: 'VIT Vellore',
    location: 'Chennai, India',
    bio: 'DevOps Engineer creating automated GitOps loops, Kubernetes clusters, and Terraform configurations.',
    skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'GitHub Actions', 'Prometheus', 'Python'],
    about: 'I eliminate deploy friction. I specialize in structuring automated CI/CD code checks, deploying zero-downtime microservices configurations, and setting up Prometheus metric monitors.',
    github: 'https://github.com/rahulverma-ops',
    linkedin: 'https://linkedin.com/in/rahulverma-devops',
    portfolio: 'https://rahulverma.cloud',
    profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=rahul',
    projects: [
      {
        title: 'EventEase',
        description: 'A Dockerized event registry and scheduling system supporting ticket generation, email queues, and Redis schedules.',
        techStack: ['Python', 'Docker', 'PostgreSQL', 'Redis'],
        githubLink: 'https://github.com/rahul-devops/eventease',
        liveDemoLink: 'https://eventease.org',
        imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: 'InvoiceFlow',
        description: 'A serverless dynamic billing engine that generates, cryptographically signs, and uploads invoices to AWS Fargate nodes.',
        techStack: ['Go', 'Docker', 'AWS Fargate', 'Terraform'],
        githubLink: 'https://github.com/rahul-devops/invoiceflow',
        liveDemoLink: 'https://invoiceflow.devconnect.com',
        imageUrl: 'https://images.unsplash.com/photo-1586486855514-8c633cc6fa98?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    name: 'Priya Nair',
    username: 'priya_ai',
    email: 'priya@devconnect.com',
    password: DEFAULT_PASSWORD_HASH,
    college: 'College of Engineering, Guindy',
    location: 'Chennai, India',
    bio: 'AI Engineer building semantic database pipelines, vector networks, and interactive NLP web tools.',
    skills: ['Python', 'FastAPI', 'TensorFlow', 'PyTorch', 'LangChain', 'MongoDB'],
    about: 'I build smart applications. I research machine learning frameworks, deploy custom classifiers via FastAPI, and structure vector-retrieval architectures using LangChain and semantic datasets.',
    github: 'https://github.com/priya-nair-ai',
    linkedin: 'https://linkedin.com/in/priyanair-ai',
    portfolio: 'https://priyanair.ai',
    profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=priya',
    projects: [
      {
        title: 'StudySphere',
        description: 'An AI-powered academic helper that scans slide PDFs and generates structured flashcards, quizzes, and semantic summaries.',
        techStack: ['Python', 'FastAPI', 'LangChain', 'MongoDB'],
        githubLink: 'https://github.com/priya-ai/studysphere',
        liveDemoLink: 'https://studysphere.ai',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: 'HireTrack',
        description: 'An resume screening board using NLP models to parse resume text and extract matching job descriptions criteria scores.',
        techStack: ['Python', 'Flask', 'NLTK', 'React'],
        githubLink: 'https://github.com/priya-ai/hiretrack',
        liveDemoLink: 'https://hiretrack.devconnect.com',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    name: 'Amit Patel',
    username: 'amit_codes',
    email: 'amit@devconnect.com',
    password: DEFAULT_PASSWORD_HASH,
    college: 'Nirma University',
    location: 'Ahmedabad, India',
    bio: 'Full Stack Developer building real-time collaboration platforms and interactive workspaces.',
    skills: ['React', 'Node.js', 'Express', 'Socket.io', 'MongoDB', 'Redis'],
    about: 'I like building collaborative, real-time tools. I focus on socket message loops, transaction queues, and Redis Pub/Sub backends.',
    github: 'https://github.com/amitpatel-dev',
    linkedin: 'https://linkedin.com/in/amitpatel-dev',
    portfolio: 'https://amitpatel.codes',
    profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=amit',
    projects: [
      {
        title: 'CodeBoard',
        description: 'A web-based collaborative whiteboarding engine supporting real-time drawing shapes syncing and team comments boards.',
        techStack: ['React', 'Socket.io', 'Node.js', 'Canvas API'],
        githubLink: 'https://github.com/amit-codes/codeboard',
        liveDemoLink: 'https://codeboard-live.com',
        imageUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: 'TravelSync',
        description: 'Collaborative group travel itinerary builder supporting real-time destination voting and maps marker plotting.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
        githubLink: 'https://github.com/amit-codes/travelsync',
        liveDemoLink: 'https://travelsync.org',
        imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    name: 'Sneha Rao',
    username: 'sneha_dev',
    email: 'sneha@devconnect.com',
    password: DEFAULT_PASSWORD_HASH,
    college: 'RV College of Engineering',
    location: 'Bangalore, India',
    bio: 'iOS and Android mobile app developer. Writing offline-first Kotlin and Swift applications.',
    skills: ['Kotlin', 'Swift', 'Flutter', 'Firebase', 'SQLite', 'Jetpack Compose'],
    about: 'I am a mobile developer interested in building native Android and iOS client products. Emphasizes clean UI states, hardware sensor integrations, and local SQLite data sync.',
    github: 'https://github.com/sneha-rao',
    linkedin: 'https://linkedin.com/in/sneharao',
    portfolio: 'https://sneharao.com',
    profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sneha',
    projects: [
      {
        title: 'BookHive',
        description: 'A native book cataloging application with offline support, text scanning for ISBN codes, and peer library swapping logs.',
        techStack: ['Kotlin', 'Jetpack Compose', 'SQLite', 'ML Kit'],
        githubLink: 'https://github.com/sneha-dev/bookhive',
        liveDemoLink: 'https://github.com/sneha-dev/bookhive',
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: 'RecipeVault',
        description: 'Cross-platform mobile application supporting meal plans scheduling, grocery checklists exports, and dynamic cooking timers.',
        techStack: ['Flutter', 'Dart', 'Firebase'],
        githubLink: 'https://github.com/sneha-dev/recipevault',
        liveDemoLink: 'https://recipevault.com',
        imageUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    name: 'Vikram Malhotra',
    username: 'vikram_sys',
    email: 'vikram@devconnect.com',
    password: DEFAULT_PASSWORD_HASH,
    college: 'IIT Bombay',
    location: 'Mumbai, India',
    bio: 'Systems Programmer. Focused on WebAssembly graphics compilers, WebGL engines, and Rust libraries.',
    skills: ['Rust', 'WebAssembly', 'C++', 'WebGL', 'Docker', 'TypeScript'],
    about: 'I build heavy systems engines. I focus on optimizing graphics, compilation pipelines, and porting low-level C++/Rust code to run natively in browsers using WebAssembly.',
    github: 'https://github.com/vikram-malhotra',
    linkedin: 'https://linkedin.com/in/vikram-systems',
    portfolio: 'https://vikramcodes.rs',
    profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=vikram',
    projects: [
      {
        title: 'DevBlog',
        description: 'A static site compiler engine written in Rust that builds optimized developer blogs with full index-searching in under 50ms.',
        techStack: ['Rust', 'Markdown', 'WebAssembly'],
        githubLink: 'https://github.com/vikram-sys/devblog-compiler',
        liveDemoLink: 'https://github.com/vikram-sys/devblog-compiler',
        imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: 'MovieHub',
        description: 'WebGL interactive 3D portal that maps user movie choices onto a spinning cinematic space network graph.',
        techStack: ['Rust', 'WebAssembly', 'Three.js'],
        githubLink: 'https://github.com/vikram-sys/moviehub-3d',
        liveDemoLink: 'https://moviehub3d.com',
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    name: 'Kavita Krishnan',
    username: 'kavita_sec',
    email: 'kavita@devconnect.com',
    password: DEFAULT_PASSWORD_HASH,
    college: 'Anna University',
    location: 'Chennai, India',
    bio: 'Security engineer and smart contract auditor. Securing Web3 protocols and testing cryptography packages.',
    skills: ['Solidity', 'Rust', 'TypeScript', 'Security Audits', 'Cryptography', 'Python'],
    about: 'I am a security auditor. I help dev teams scan their smart contracts for reentrancy issues, cryptographical anomalies, and access control leaks.',
    github: 'https://github.com/kavita-krishnan',
    linkedin: 'https://linkedin.com/in/kavitakrishnan-sec',
    portfolio: 'https://kavitasec.dev',
    profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=kavita',
    projects: [
      {
        title: 'IssueTracker',
        description: 'A secure ticket auditing platform designed to log contract issues and track progress with GPG cryptographic signatures verification.',
        techStack: ['Next.js', 'Solidity', 'Web3.js', 'PostgreSQL'],
        githubLink: 'https://github.com/kavita-sec/issuetracker',
        liveDemoLink: 'https://securetracker.io',
        imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: 'PortfolioX',
        description: 'An open-source custom developer portfolio builder that generates and compiles pixel-perfect portfolios layouts.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS'],
        githubLink: 'https://github.com/kavita-sec/portfoliox',
        liveDemoLink: 'https://portfoliox.io',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already populated. Skipping seeding.');
      return;
    }

    console.log('Seeding database with updated Indian developer profiles...');

    const createdUsers = [];
    for (const devData of DEVELOPERS) {
      const { projects, ...userData } = devData;
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);

      for (const projectData of projects) {
        const project = new Project({
          ...projectData,
          user: user._id
        });
        await project.save();
      }
    }

    console.log(`Successfully created ${createdUsers.length} developer accounts and project profiles.`);

    // Connections List
    // Ananya (0) <-> Arjun (1) : Connected
    // Ananya (0) <-> Rahul (2) : Connected
    // Arjun (1) <-> Rahul (2) : Connected
    // Priya (3) <-> Amit (4) : Connected
    // Sneha (5) <-> Vikram (6) : Connected
    
    // Pending requests
    // Kavita (7) -> Ananya (0) : Incoming for Ananya
    // Sneha (5) -> Arjun (1) : Incoming for Arjun
    // Rahul (2) -> Priya (3) : Incoming for Priya

    const createActiveConnection = async (userA, userB) => {
      const conn = new Connection({
        sender: userA._id,
        receiver: userB._id,
        status: 'accepted'
      });
      await conn.save();
    };

    const createPendingConnection = async (requester, recipient) => {
      const conn = new Connection({
        sender: requester._id,
        receiver: recipient._id,
        status: 'pending'
      });
      await conn.save();
    };

    await createActiveConnection(createdUsers[0], createdUsers[1]);
    await createActiveConnection(createdUsers[0], createdUsers[2]);
    await createActiveConnection(createdUsers[1], createdUsers[2]);
    await createActiveConnection(createdUsers[3], createdUsers[4]);
    await createActiveConnection(createdUsers[5], createdUsers[6]);

    await createPendingConnection(createdUsers[7], createdUsers[0]);
    await createPendingConnection(createdUsers[5], createdUsers[1]);
    await createPendingConnection(createdUsers[2], createdUsers[3]);

    console.log('Successfully seeded networking connections relationships.');
    console.log('Database seeding process completed successfully!');
  } catch (err) {
    console.error('Error during database seeding:', err);
  }
};

module.exports = seedDatabase;
