
import express from 'express';

const infoRouter = express.Router();

infoRouter.get('/about', async (req, res) => {
  const aboutContent = {
    title: "About GustieGo API",
    description:
      "The GustieGo API is a backend service designed to support shift scheduling, claiming, and management workflows for student employees at Gustavus Adolphus College. Built with a MERN-like architecture (MongoDB, Express, Node.js), it exposes RESTful endpoints optimized for internal use via a secure, role-based access system.",
    features: [
      "CRUD operations for shift requests, claim statuses, and user roles via RESTful endpoints",
      "JWT-based authentication and session management",
      "Role-based middleware enforcing access controls for employees and supervisors",
      "WebSocket-ready structure for future real-time updates and notification integration",
      "Input validation and error handling for robust data integrity"
    ],
    core: {
      description:
        "This API is engineered by student developers to deliver scalable, maintainable backend infrastructure that streamlines campus work coordination.",
      values: [
        "Code Simplicity",
        "Backend Scalability",
        "Security Best Practices",
        "Developer Ownership"
      ]
    },
    contact: {
      email: "youdaheasfaw@gmail.com",
      github: "https://github.com/Youdahe123/GustieGo"
    }
  }
  res.json(aboutContent)
})
infoRouter.get('/docs',async (req,res)=>{
    const docsContent = {
        status:'coming soon ...'
    }
    res.json(docsContent)
})
export default infoRouter