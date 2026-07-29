import superAdminSeeder from "./super-admin.seed";

const runSeeders = async () => {
  console.log("🌱 Running Seeders...");

  await superAdminSeeder.run();

  console.log("✅ All Seeders Completed");
};

export default runSeeders;