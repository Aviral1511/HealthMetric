import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

export const getInsights = async (req, res) => {
  try {
    const dataSubset = (req.body.data || []).slice(0, 50); // prevent token overload
    
    const context = `
      Analyze this vaccine dataset and give exactly 3 key insights.
      Return the output as a valid JSON object with the shape {"insights": ["Insight 1", "Insight 2", "Insight 3"]}.
      Dataset: ${JSON.stringify(dataSubset)}
    `;

    if (!API_KEY) {
      console.log("No GEMINI_API_KEY detected. Using fallback 3-insight logic.");
      await new Promise(r => setTimeout(r, 1200));
      return res.status(200).json({ 
        insights: [
          "Asia is the fastest growing region overall.",
          "Moderna displays the highest average pricing metrics.",
          "Total theoretical market doubled dynamically after 2020."
        ] 
      });
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });
    
    // Attempt to parse JSON strictly
    let text = response.text || "";
    if (text.startsWith("```json")) {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    
    try {
      const parsed = JSON.parse(text);
      res.status(200).json(parsed);
    } catch (e) {
      res.status(200).json({ insights: ["Found unexpected trend anomalies.", "Market distribution suggests skew.", "Check broader date ranges."] });
    }
  } catch (error) {
    console.error("Error fetching insights:", error);
    res.status(500).json({ error: 'Server error retrieving AI insights' });
  }
};

export const parseNLPFilter = async (req, res) => {
  try {
    const { query } = req.body;
    
    const context = `
      Convert this sentence into data filters: "${query}"
      Return JSON only. Valid keys: "region", "brand", "year". 
      Values should be exact string matches or numbers as strings. If a key is not mentioned, omit it.
      For example, "show Asia Pfizer after 2020" => {"region": "Asia", "brand": "Pfizer", "year": "2020"}.
    `;

    if (!API_KEY) {
      console.log("No GEMINI_API_KEY detected. Using fallback NLP logic.");
      await new Promise(r => setTimeout(r, 800));
      // Basic mock parsing
      const mockResult = {};
      const lower = query.toLowerCase();
      if (lower.includes("asia")) mockResult.region = "Asia";
      if (lower.includes("europe")) mockResult.region = "Europe";
      if (lower.includes("pfizer")) mockResult.brand = "Pfizer";
      if (lower.includes("moderna")) mockResult.brand = "Moderna";
      if (lower.includes("2020")) mockResult.year = "2020";
      if (lower.includes("2021")) mockResult.year = "2021";
      if (lower.includes("2022")) mockResult.year = "2022";
      if (lower.includes("2023")) mockResult.year = "2023";
      
      return res.status(200).json(mockResult);
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });
    
    let text = response.text || "{}";
    if (text.startsWith("```json")) {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    
    try {
      const parsed = JSON.parse(text);
      res.status(200).json(parsed);
    } catch(e) {
      res.status(200).json({});
    }

  } catch (error) {
    res.status(500).json({ error: 'Server error parsing NLP' });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const { marketSize, avgPrice, cagr, region, brand, year } = req.body;
    
    const context = `
      Summarize vaccine trends from this dataset context: 
      Focus: Region (${region || 'Global'}), Brand (${brand || 'All Brands'}), Year (${year || 'All Time'}).
      Key Metrics: Market Size $${marketSize}B, Avg Price $${avgPrice}, CAGR ${cagr}%.
      Provide a highly professional 2-3 sentence paragraph outlining this growth logic. DO NOT use markdown, just text.
    `;

    if (!API_KEY) {
      console.log("No GEMINI_API_KEY detected. Using fallback Summary logic.");
      await new Promise(r => setTimeout(r, 1000));
      const mockSummary = `The global vaccine market grew steadily over the observed period, with ${region || 'targeted territories'} driving a robust CAGR of ${cagr}%. Pricing stability at an average of $${avgPrice} per dose allowed the total operational valuation to secure $${marketSize}B organically, indicating strong continued pharmaceutical supply health.`;
      return res.status(200).json({ summary: mockSummary });
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });
    
    res.status(200).json({ summary: response.text || "Summary details unavailable at this time." });
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving dashboard summary' });
  }
};
