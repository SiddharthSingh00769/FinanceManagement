"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askAura({ prompt, audioBase64, history = [] }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        accounts: true,
        budgets: true,
      },
    });

    if (!user) throw new Error("User not found");

    // Fetch transactions for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTransactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: { date: "desc" },
    });

    // Format financial context
    const accountsContext = user.accounts
      .map(
        (a) =>
          `- ${a.name} (${a.type}): $${a.balance.toNumber().toFixed(2)} (Default: ${a.isDefault})`
      )
      .join("\n");

    const budgetContext = user.budgets
      .map((b) => `- Budget: $${b.amount.toNumber().toFixed(2)}`)
      .join("\n");

    const transactionsContext = recentTransactions
      .map(
        (t) =>
          `- ${t.date.toISOString().split("T")[0]}: ${t.description || "No description"} | ${t.category} | ${t.type} | $${t.amount.toNumber().toFixed(2)}`
      )
      .join("\n");

    const systemPrompt = `
      You are Aura, an AI financial assistant for the FinAura app. 
      Be concise, helpful, and friendly. Answer the user's question based strictly on the financial data provided below. 
      If the user asks something unrelated to their finances or the app, politely steer them back.
      Format money nicely (e.g., $1,234.56).
      Do not hallucinate data. If you don't know or don't have enough data, say so.

      IMPORTANT RULE FOR TRANSACTIONS:
      If a user asks to log, add, or record a transaction (either by text or voice), summarize the transaction details (Amount, Category, Type, Description) and ask for their confirmation (Yes/No).
      DO NOT call the add_transaction tool until the user explicitly says "Yes" to confirm the details.
      If the user says "No", cancel the action.

      --- USER'S FINANCIAL DATA ---
      ACCOUNTS:
      ${accountsContext || "No accounts found."}

      BUDGETS:
      ${budgetContext || "No budget set."}

      RECENT TRANSACTIONS (Last 30 Days):
      ${transactionsContext || "No recent transactions."}
      ------------------------------
    `;

    const tools = [
      {
        functionDeclarations: [
          {
            name: "add_transaction",
            description: "Logs a new transaction to the user's default database account. ONLY call this tool AFTER the user has explicitly confirmed the transaction details with a 'Yes'.",
            parameters: {
              type: "OBJECT",
              properties: {
                amount: { type: "NUMBER", description: "The transaction amount." },
                description: { type: "STRING", description: "A brief description of the transaction." },
                category: { type: "STRING", description: "The category ID. Must be one of: housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense, salary, freelance, investments, business, rental, other-income. Use lowercase exactly as shown." },
                type: { type: "STRING", description: "The type of transaction. Must be either EXPENSE or INCOME." },
              },
              required: ["amount", "description", "category", "type"],
            },
          },
        ],
      },
    ];

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      tools: tools
    });

    const chatHistory = history.slice(0, -1).map(msg => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will act as Aura, use the provided financial context, and always ask for confirmation before calling the add_transaction tool." }]
        },
        ...chatHistory
      ]
    });

    const currentMsgContent = history.length > 0 ? history[history.length - 1].content : prompt;
    const parts = [];
    if (audioBase64) {
      parts.push({
        inlineData: {
          data: audioBase64,
          mimeType: "audio/webm",
        }
      });
      parts.push({ text: "Listen carefully to the attached audio. It contains a user request for their financial assistant Aura. Transcribe it and then answer the request using the financial data provided in the system prompt." });
    } else {
      parts.push({ text: currentMsgContent || prompt });
    }

    let result = await chat.sendMessage(parts);
    let response = result.response;

    // Handle Function Call from Agent
    const calls = typeof response.functionCalls === 'function' ? response.functionCalls() : response.functionCalls;
    if (calls && calls.length > 0) {
      const call = calls[0];
      
      if (call.name === "add_transaction") {
        const { amount, description, category, type } = call.args;
        const defaultAccount = user.accounts.find(a => a.isDefault) || user.accounts[0];
        
        if (!defaultAccount) {
          result = await chat.sendMessage([{
            functionResponse: {
              name: "add_transaction",
              response: { error: "No account found to log the transaction." }
            }
          }]);
        } else {
          await db.$transaction(async (tx) => {
            await tx.transaction.create({
              data: {
                amount,
                description,
                category,
                type,
                userId: user.id,
                accountId: defaultAccount.id,
                date: new Date()
              }
            });
            
            const balanceChange = type === "EXPENSE" ? -amount : amount;
            await tx.account.update({
              where: { id: defaultAccount.id },
              data: { balance: { increment: balanceChange } }
            });
          });

          // Send success back to the model so it can generate a final response
          result = await chat.sendMessage([{
            functionResponse: {
              name: "add_transaction",
              response: { success: true, message: `Successfully logged ${type} of $${amount} for ${description} in ${category}.` }
            }
          }]);
        }
        response = result.response;
      }
    }

    return { success: true, data: response.text() };
  } catch (error) {
    console.error("Aura Error:", error);
    return { success: false, error: "Failed to get a response from Aura." };
  }
}
