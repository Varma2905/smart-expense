import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { Budget } from '../models/Budget.js';
import { RecurringTransaction } from '../models/RecurringTransaction.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing demo data...');
    await User.deleteMany({ email: 'demo@smartexpense.com' });
    
    // Find or create demo user
    let user = await User.create({
      name: 'Alex Morgan',
      email: 'demo@smartexpense.com',
      password: 'Password123!',
      currency: 'INR',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      preferences: {
        dateFormat: 'YYYY-MM-DD',
        language: 'en',
        theme: 'dark',
      },
    });

    const userId = user._id;

    // Clear old transactions, budgets, recurring items for this demo user
    await Transaction.deleteMany({ userId });
    await Budget.deleteMany({ userId });
    await RecurringTransaction.deleteMany({ userId });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    console.log('[Seed] Seeding budgets...');
    await Budget.insertMany([
      { userId, category: 'overall', amount: 65000, month: currentMonth, year: currentYear },
      { userId, category: 'Food', amount: 12000, month: currentMonth, year: currentYear },
      { userId, category: 'Shopping', amount: 10000, month: currentMonth, year: currentYear },
      { userId, category: 'Transport', amount: 6000, month: currentMonth, year: currentYear },
      { userId, category: 'Bills', amount: 8000, month: currentMonth, year: currentYear },
      { userId, category: 'Entertainment', amount: 5000, month: currentMonth, year: currentYear },
      { userId, category: 'Subscriptions', amount: 3000, month: currentMonth, year: currentYear },
    ]);

    console.log('[Seed] Seeding recurring transactions...');
    await RecurringTransaction.insertMany([
      {
        userId,
        name: 'Monthly Software Engineer Salary',
        amount: 95000,
        type: 'income',
        category: 'Salary',
        frequency: 'monthly',
        startDate: new Date(currentYear, currentMonth - 2, 1),
        nextDate: new Date(currentYear, currentMonth, 1),
        active: true,
      },
      {
        userId,
        name: 'Apartment Rent',
        amount: 22000,
        type: 'expense',
        category: 'Bills',
        frequency: 'monthly',
        startDate: new Date(currentYear, currentMonth - 2, 5),
        nextDate: new Date(currentYear, currentMonth, 5),
        active: true,
      },
      {
        userId,
        name: 'High-Speed Broadband Internet',
        amount: 1199,
        type: 'expense',
        category: 'Bills',
        frequency: 'monthly',
        startDate: new Date(currentYear, currentMonth - 2, 10),
        nextDate: new Date(currentYear, currentMonth, 10),
        active: true,
      },
      {
        userId,
        name: 'Netflix & Spotify Family Subscriptions',
        amount: 999,
        type: 'expense',
        category: 'Subscriptions',
        frequency: 'monthly',
        startDate: new Date(currentYear, currentMonth - 2, 15),
        nextDate: new Date(currentYear, currentMonth, 15),
        active: true,
      },
    ]);

    console.log('[Seed] Generating 60+ realistic transactions over past 90 days...');
    const transactions = [];

    // Monthly incomes
    for (let m = 0; m < 3; m++) {
      const d = new Date();
      d.setMonth(now.getMonth() - m);
      d.setDate(1);

      transactions.push({
        userId,
        type: 'income',
        amount: 95000,
        category: 'Salary',
        description: 'Tech Corp Monthly Salary Deposit',
        date: new Date(d),
        paymentMethod: 'Bank Transfer',
        notes: 'Direct bank credit',
      });

      // Occasional freelance bonus
      if (m % 2 === 0) {
        const fDate = new Date(d);
        fDate.setDate(14);
        transactions.push({
          userId,
          type: 'income',
          amount: 18500,
          category: 'Freelance',
          description: 'UI/UX Redesign Consulting Project',
          date: fDate,
          paymentMethod: 'UPI',
          notes: 'Client milestone payment',
        });
      }
    }

    // Expense templates
    const expenseTemplates = [
      { category: 'Food', desc: 'Gourmet Organic Grocery Shopping', amtRange: [1200, 3500], pm: 'UPI' },
      { category: 'Food', desc: 'Weekend Bistro & Coffee Outing', amtRange: [450, 1800], pm: 'Credit Card' },
      { category: 'Food', desc: 'Dinner at Fine Dining Restaurant', amtRange: [1500, 4200], pm: 'Credit Card' },
      { category: 'Transport', desc: 'Uber Ride to Tech Park', amtRange: [280, 650], pm: 'UPI' },
      { category: 'Transport', desc: 'Monthly Fuel Refill for SUV', amtRange: [2500, 4000], pm: 'Debit Card' },
      { category: 'Shopping', desc: 'Casual Wear & Sneakers from Nike Store', amtRange: [2999, 7500], pm: 'Credit Card' },
      { category: 'Shopping', desc: 'Amazon Electronics & Accessories', amtRange: [1200, 5400], pm: 'UPI' },
      { category: 'Bills', desc: 'State Electricity Utility Bill', amtRange: [1800, 3200], pm: 'UPI' },
      { category: 'Bills', desc: 'Apartment Maintenance Fee', amtRange: [2500, 2500], pm: 'Bank Transfer' },
      { category: 'Entertainment', desc: 'IMAX Cinema Tickets & Snacks', amtRange: [800, 1600], pm: 'UPI' },
      { category: 'Entertainment', desc: 'Gaming Platform Pass Subscription', amtRange: [999, 1499], pm: 'Credit Card' },
      { category: 'Healthcare', desc: 'Pharmacy Medicine & Supplements', amtRange: [650, 2200], pm: 'UPI' },
      { category: 'Healthcare', desc: 'Routine Dental Checkup & Cleaning', amtRange: [1500, 3000], pm: 'Debit Card' },
      { category: 'Education', desc: 'Full-Stack Advanced Course on Udemy', amtRange: [599, 1299], pm: 'UPI' },
      { category: 'Travel', desc: 'Weekend Hillside Resort Booking', amtRange: [6500, 14000], pm: 'Credit Card' },
    ];

    // Generate random expenses spread across past 90 days
    for (let dayOffset = 0; dayOffset < 90; dayOffset += 2) {
      const txDate = new Date();
      txDate.setDate(now.getDate() - dayOffset);

      // Add 1 to 2 random expenses per period
      const template = expenseTemplates[Math.floor(Math.random() * expenseTemplates.length)];
      const minAmt = template.amtRange[0];
      const maxAmt = template.amtRange[1];
      const amount = Math.floor(Math.random() * (maxAmt - minAmt + 1)) + minAmt;

      transactions.push({
        userId,
        type: 'expense',
        amount,
        category: template.category,
        description: template.desc,
        date: txDate,
        paymentMethod: template.pm,
        notes: `Simulated transaction record #${dayOffset}`,
      });
    }

    await Transaction.insertMany(transactions);

    console.log(`[Seed] Successfully seeded demo database with ${transactions.length} transactions!`);
    console.log('---------------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('Email:    demo@smartexpense.com');
    console.log('Password: Password123!');
    console.log('---------------------------------------------------------');

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
