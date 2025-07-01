import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { predefinedProjects } from "@/lib/seedData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await connectDB();

      // Check if predefined projects already exist
      const existingProjects = await Project.countDocuments({ isPredefined: true });
      
      if (existingProjects > 0) {
        return res.status(200).json({
          message: "Predefined projects already exist",
          count: existingProjects
        });
      }

      // Insert predefined projects
      const insertedProjects = await Project.insertMany(
        predefinedProjects.map(project => ({
          ...project,
          isActive: true,
        }))
      );

      return res.status(200).json({
        message: "Database seeded successfully",
        count: insertedProjects.length,
        projects: insertedProjects.map(p => ({ id: p._id, title: p.title }))
      });

    } catch (error) {
      console.error("Error seeding database:", error);
      return res.status(500).json({ error: "Failed to seed database" });
    }
  }

  if (req.method === "GET") {
    try {
      await connectDB();

      const predefinedCount = await Project.countDocuments({ isPredefined: true });
      const userCount = await Project.countDocuments({ isPredefined: false });

      return res.status(200).json({
        predefinedProjects: predefinedCount,
        userProjects: userCount,
        total: predefinedCount + userCount
      });

    } catch (error) {
      console.error("Error fetching project counts:", error);
      return res.status(500).json({ error: "Failed to fetch project counts" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}