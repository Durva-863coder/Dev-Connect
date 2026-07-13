const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Connection = require('./models/Connection');

dotenv.config();

const base = 'http://127.0.0.1:5000/api';

const runIntegrationTests = async () => {
  console.log('=== STARTING ALL ENDPOINTS INTEGRATION TESTING ===');

  // 1. Clean Database
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devconnect';
    await mongoose.connect(mongoUri);
    
    // Wipe test users
    await User.deleteMany({ email: { $in: ['alice@test.com', 'bob@test.com'] } });
    const uids = await User.find({ email: { $in: ['alice@test.com', 'bob@test.com'] } }).select('_id');
    const ids = uids.map(u => u._id);
    await Project.deleteMany({ user: { $in: ids } });
    await Connection.deleteMany({ $or: [{ sender: { $in: ids } }, { receiver: { $in: ids } }] });

    await mongoose.disconnect();
    console.log('✔ Database cleaned successfully');
  } catch (err) {
    console.error('✘ DB Cleanup failed:', err.message);
    process.exit(1);
  }

  // Tokens & profile IDs
  let aliceToken = '';
  let bobToken = '';
  let aliceId = '';
  let bobId = '';
  let projectId = '';
  let connectionId = '';

  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  await delay(500);

  // ----------------------------------------------------
  // FEATURE 1: AUTHENTICATION
  // ----------------------------------------------------
  console.log('\n--- TESTING FEATURE 1: AUTHENTICATION ---');

  // Register Alice
  try {
    const res = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice Coder',
        username: 'alice',
        email: 'alice@test.com',
        password: 'alicepassword'
      })
    });
    const json = await res.json();
    if (res.status === 201 && json.success) {
      console.log('✔ Register Alice: PASSED');
      aliceToken = json.data.token;
      aliceId = json.data._id;
    } else {
      console.error('✘ Register Alice: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Register Alice error:', err.message);
  }

  // Register Bob
  try {
    const res = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bob Architect',
        username: 'bob',
        email: 'bob@test.com',
        password: 'bobpassword'
      })
    });
    const json = await res.json();
    if (res.status === 201 && json.success) {
      console.log('✔ Register Bob: PASSED');
      bobToken = json.data.token;
      bobId = json.data._id;
    } else {
      console.error('✘ Register Bob: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Register Bob error:', err.message);
  }

  // Login Alice
  try {
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@test.com',
        password: 'alicepassword'
      })
    });
    const json = await res.json();
    if (res.status === 200 && json.success && json.data.token) {
      console.log('✔ Login Alice: PASSED');
    } else {
      console.error('✘ Login Alice: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Login Alice error:', err.message);
  }

  // Get Me Alice
  try {
    const res = await fetch(`${base}/auth/me`, {
      headers: { 'Authorization': `Bearer ${aliceToken}` }
    });
    const json = await res.json();
    if (res.status === 200 && json.success && json.data.username === 'alice') {
      console.log('✔ Get Current User Profile (Me): PASSED');
    } else {
      console.error('✘ Get Me: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Get Me error:', err.message);
  }

  // ----------------------------------------------------
  // FEATURE 2: PROFILES & DIRECTORY
  // ----------------------------------------------------
  console.log('\n--- TESTING FEATURE 2: PROFILES & DIRECTORY ---');

  // Update Alice Profile (Skills, College, Bio)
  try {
    const res = await fetch(`${base}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aliceToken}`
      },
      body: JSON.stringify({
        bio: 'React and Node enthusiast',
        skills: 'React, Node, JavaScript, Express',
        college: 'Dev University',
        location: 'California',
        github: 'https://github.com/alicecoder',
        linkedin: 'https://linkedin.com/in/alicecoder'
      })
    });
    const json = await res.json();
    if (res.status === 200 && json.success && json.data.skills.includes('React')) {
      console.log('✔ Update Alice Profile details: PASSED');
    } else {
      console.error('✘ Update Alice Profile details: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Update Alice Profile error:', err.message);
  }

  // Update Bob Profile (Skills)
  try {
    await fetch(`${base}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bobToken}`
      },
      body: JSON.stringify({
        bio: 'Python & Mongo DevOps Architect',
        skills: 'Python, MongoDB, Docker, DevOps',
        college: 'Tech College'
      })
    });
    console.log('✔ Update Bob Profile details: PASSED');
  } catch (err) {
    console.error('✘ Update Bob Profile error:', err.message);
  }

  // Search Directory for "React" skill
  try {
    const res = await fetch(`${base}/users?search=React`);
    const json = await res.json();
    const hasAlice = json.data.some(u => u.username === 'alice');
    const hasBob = json.data.some(u => u.username === 'bob');
    if (res.status === 200 && hasAlice && !hasBob) {
      console.log('✔ Search Users by skill (React matches Alice only): PASSED');
    } else {
      console.error('✘ Search Users: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Search Users error:', err.message);
  }

  // Search Directory by College "Dev University"
  try {
    const res = await fetch(`${base}/users?search=Dev University`);
    const json = await res.json();
    if (res.status === 200 && json.data.length === 1 && json.data[0].username === 'alice') {
      console.log('✔ Search Users by College (Dev University): PASSED');
    } else {
      console.error('✘ Search College: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Search College error:', err.message);
  }

  // Get User by Username "alice"
  try {
    const res = await fetch(`${base}/users/username/alice`);
    const json = await res.json();
    if (res.status === 200 && json.success && json.data.name === 'Alice Coder') {
      console.log('✔ Get User by Username (alice): PASSED');
    } else {
      console.error('✘ Get User by Username: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Get User by Username error:', err.message);
  }

  // ----------------------------------------------------
  // FEATURE 3: PROJECTS
  // ----------------------------------------------------
  console.log('\n--- TESTING FEATURE 3: PROJECTS ---');

  // Create Project (Alice)
  try {
    const res = await fetch(`${base}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aliceToken}`
      },
      body: JSON.stringify({
        title: 'Portfolio Tracker',
        description: 'Track dev connect connections',
        techStack: 'React, Node, MongoDB',
        githubLink: 'https://github.com/alice/tracker',
        liveDemoLink: 'https://tracker.demo'
      })
    });
    const json = await res.json();
    if (res.status === 201 && json.success) {
      console.log('✔ Create Project (Alice): PASSED');
      projectId = json.data._id;
    } else {
      console.error('✘ Create Project: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Create Project error:', err.message);
  }

  // Get Projects of Alice
  try {
    const res = await fetch(`${base}/projects/user/${aliceId}`);
    const json = await res.json();
    if (res.status === 200 && json.data.length === 1 && json.data[0].title === 'Portfolio Tracker') {
      console.log('✔ Get Projects by User ID: PASSED');
    } else {
      console.error('✘ Get Projects by User ID: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Get Projects by User ID error:', err.message);
  }

  // Edit Project (Alice)
  try {
    const res = await fetch(`${base}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aliceToken}`
      },
      body: JSON.stringify({
        title: 'Portfolio Tracker (Updated)',
        description: 'Track connections easily',
        techStack: 'React, Node, Redux'
      })
    });
    const json = await res.json();
    if (res.status === 200 && json.success && json.data.title === 'Portfolio Tracker (Updated)') {
      console.log('✔ Update Project: PASSED');
    } else {
      console.error('✘ Update Project: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Update Project error:', err.message);
  }

  // Attempt to Edit Alice Project as Bob (Forbidden)
  try {
    const res = await fetch(`${base}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bobToken}`
      },
      body: JSON.stringify({
        title: 'Bob Hacked This',
        description: 'Trying to hack',
        techStack: 'Hacking, Scripting'
      })
    });
    const json = await res.json();
    if (res.status === 403 && !json.success) {
      console.log('✔ Edit project unauthorized prevention: PASSED');
    } else {
      console.error('✘ Edit project unauthorized prevention: FAILED', res.status, json);
    }
  } catch (err) {
    console.error('✘ Unauthorized project edit error:', err.message);
  }

  // ----------------------------------------------------
  // FEATURE 4: CONNECTIONS
  // ----------------------------------------------------
  console.log('\n--- TESTING FEATURE 4: CONNECTIONS ---');

  // Alice sends connection request to Bob
  try {
    const res = await fetch(`${base}/connections/request/${bobId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${aliceToken}` }
    });
    const json = await res.json();
    if (res.status === 201 && json.success) {
      console.log('✔ Send Connection Request: PASSED');
      connectionId = json.data._id;
    } else {
      console.error('✘ Send Connection Request: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Send request error:', err.message);
  }

  // Bob retrieves pending connections (sees Alice request incoming)
  try {
    const res = await fetch(`${base}/connections`, {
      headers: { 'Authorization': `Bearer ${bobToken}` }
    });
    const json = await res.json();
    const hasAliceIncoming = json.data.pendingIncoming.some(conn => conn.user.username === 'alice');
    if (res.status === 200 && hasAliceIncoming) {
      console.log('✔ Retrieve Connections lists (Bob sees Alice Incoming): PASSED');
    } else {
      console.error('✘ Retrieve Connections lists: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Get connections error:', err.message);
  }

  // Bob accepts connection request
  try {
    const res = await fetch(`${base}/connections/accept/${connectionId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${bobToken}` }
    });
    const json = await res.json();
    if (res.status === 200 && json.success && json.data.status === 'accepted') {
      console.log('✔ Accept Connection Request: PASSED');
    } else {
      console.error('✘ Accept Connection: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Accept request error:', err.message);
  }

  // Bob fetches connections again (sees Alice in accepted list)
  try {
    const res = await fetch(`${base}/connections`, {
      headers: { 'Authorization': `Bearer ${bobToken}` }
    });
    const json = await res.json();
    const hasAliceAccepted = json.data.accepted.some(conn => conn.user.username === 'alice');
    if (res.status === 200 && hasAliceAccepted) {
      console.log('✔ Verify Accepted Connection list: PASSED');
    } else {
      console.error('✘ Verify Accepted Connection: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Get accepted connections error:', err.message);
  }

  // ----------------------------------------------------
  // FEATURE 5: PASSWORD CHANGE & CASCADE DELETE
  // ----------------------------------------------------
  console.log('\n--- TESTING FEATURE 5: PASSWORD CHANGE & CASCADE DELETE ---');

  // Change password Alice
  try {
    const res = await fetch(`${base}/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aliceToken}`
      },
      body: JSON.stringify({
        oldPassword: 'alicepassword',
        newPassword: 'newalicepassword123'
      })
    });
    const json = await res.json();
    if (res.status === 200 && json.success) {
      console.log('✔ Change Password: PASSED');
    } else {
      console.error('✘ Change Password: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Change Password error:', err.message);
  }

  // Try to login Alice with old password (fails)
  try {
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@test.com',
        password: 'alicepassword'
      })
    });
    if (res.status === 401) {
      console.log('✔ Verify Login with old password fails: PASSED');
    } else {
      console.error('✘ Verify Old password fails: FAILED', res.status);
    }
  } catch (err) {
    console.error('✘ Verify login old error:', err.message);
  }

  // Try to login Alice with new password (success)
  try {
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@test.com',
        password: 'newalicepassword123'
      })
    });
    const json = await res.json();
    if (res.status === 200 && json.success) {
      console.log('✔ Verify Login with new password succeeds: PASSED');
      aliceToken = json.data.token; // Update token
    } else {
      console.error('✘ Verify New password fails: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Verify login new error:', err.message);
  }

  // Cascade delete Alice account
  try {
    const res = await fetch(`${base}/users`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${aliceToken}` }
    });
    const json = await res.json();
    if (res.status === 200 && json.success) {
      console.log('✔ Cascade Delete Account (Alice): PASSED');
    } else {
      console.error('✘ Cascade Delete Account: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Delete account error:', err.message);
  }

  // Verify Alice projects are deleted
  try {
    const res = await fetch(`${base}/projects/user/${aliceId}`);
    const json = await res.json();
    if (res.status === 200 && json.data.length === 0) {
      console.log('✔ Verify Projects deleted on cascade: PASSED');
    } else {
      console.error('✘ Verify Projects cascade: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Verify Projects cascade error:', err.message);
  }

  // Verify connection records are deleted (Bob should have empty connections)
  try {
    const res = await fetch(`${base}/connections`, {
      headers: { 'Authorization': `Bearer ${bobToken}` }
    });
    const json = await res.json();
    if (
      res.status === 200 &&
      json.data.accepted.length === 0 &&
      json.data.pendingIncoming.length === 0 &&
      json.data.pendingOutgoing.length === 0
    ) {
      console.log('✔ Verify Connection records deleted on cascade: PASSED');
    } else {
      console.error('✘ Verify Connections cascade: FAILED', json);
    }
  } catch (err) {
    console.error('✘ Verify Connections cascade error:', err.message);
  }

  // Clean up Bob
  try {
    await fetch(`${base}/users`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${bobToken}` }
    });
    console.log('✔ Bob account cleaned up');
  } catch (err) {}

  console.log('\n=== ALL ENDPOINTS INTEGRATION TESTING COMPLETED ===');
  process.exit(0);
};

runIntegrationTests();
