import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

export async function seedDatabase() {
  const existingUser = await User.findOne({ username: 'admin' });
  
  if (!existingUser) {
    console.log('[SERVER] Seeding database...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
    
    const member = await User.create({
      username: 'member',
      password: await bcrypt.hash('member123', 10),
      role: 'member'
    });
    
    const project = await Project.create({
      name: 'Internal Tool',
      description: 'Build the PM system',
      ownerId: admin._id
    });
    
    await Task.create({
      title: 'Setup Backend',
      status: 'done',
      priority: 'high',
      projectId: project._id,
      assigneeId: admin._id
    });
    
    await Task.create({
      title: 'Setup Frontend',
      status: 'in_progress',
      priority: 'high',
      projectId: project._id,
      assigneeId: member._id
    });
    
    console.log('[SERVER] Database seeded!');
  }
}
