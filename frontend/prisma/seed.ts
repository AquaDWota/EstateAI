import { PrismaClient, PropertyType } from "@prisma/client";
import { generateProperties } from "../src/lib/property-generator";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Estate AI database...");

  const properties = generateProperties(75);

  for (const p of properties) {
    await prisma.property.upsert({
      where: { id: p.id },
      update: {
        id: p.id,
        address: p.address,
        city: p.city,
        state: p.state,
        zipCode: p.zipCode,
        latitude: p.latitude,
        longitude: p.longitude,
        price: p.price,
        beds: p.beds,
        baths: p.baths,
        sqft: p.sqft,
        propertyType: p.propertyType as PropertyType,
        imageUrl: p.imageUrl,
        images: p.images,
        estimatedRoi: p.estimatedRoi,
        capRate: p.capRate,
        rentalYield: p.rentalYield,
        appreciationForecast: p.appreciationForecast,
        aiScore: p.aiScore,
        riskScore: p.riskScore,
        undervalued: p.undervalued,
        rentalDemand: p.rentalDemand,
        yearBuilt: p.yearBuilt,
        description: p.description,
      },
      create: {
        id: p.id,
        address: p.address,
        city: p.city,
        state: p.state,
        zipCode: p.zipCode,
        latitude: p.latitude,
        longitude: p.longitude,
        price: p.price,
        beds: p.beds,
        baths: p.baths,
        sqft: p.sqft,
        propertyType: p.propertyType as PropertyType,
        imageUrl: p.imageUrl,
        images: p.images,
        estimatedRoi: p.estimatedRoi,
        capRate: p.capRate,
        rentalYield: p.rentalYield,
        appreciationForecast: p.appreciationForecast,
        aiScore: p.aiScore,
        riskScore: p.riskScore,
        undervalued: p.undervalued,
        rentalDemand: p.rentalDemand,
        yearBuilt: p.yearBuilt,
        description: p.description,
        aiReports: {
          create: {
            recommendation: p.aiRecommendation,
            confidence: p.confidence,
            riskExplanation: p.riskExplanation,
            investmentThesis: p.investmentThesis,
            exitStrategy: p.exitStrategy,
            summary: p.investmentThesis,
            agentType: "property_scoring",
          },
        },
        marketMetrics: {
          create: [
            {
              zipCode: p.zipCode,
              metricType: "rental_demand",
              value: p.rentalDemand,
              period: "current",
            },
            {
              zipCode: p.zipCode,
              metricType: "appreciation",
              value: p.appreciationForecast,
              period: "12m",
            },
          ],
        },
      },
    });
  }

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@estateai.com" },
    update: {
      name: "Demo Investor",
      supabaseUserId: "00000000-0000-0000-0000-000000000001",
    },
    create: {
      email: "demo@estateai.com",
      name: "Demo Investor",
      supabaseUserId: "00000000-0000-0000-0000-000000000001",
      portfolio: {
        create: {
          totalValue: 2840000,
          monthlyCashFlow: 12450,
          roi: 14.2,
          rentalYield: 7.8,
        },
      },
    },
  });

  const topProps = properties.slice(0, 5);
  for (const p of topProps) {
    await prisma.savedProperty.upsert({
      where: {
        userId_propertyId: {
          userId: demoUser.id,
          propertyId: p.id,
        },
      },
      update: {},
      create: { userId: demoUser.id, propertyId: p.id },
    });
  }

  console.log(`Seeded ${properties.length} properties and demo user.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
