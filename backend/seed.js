const mongoose = require("mongoose");
const { 
  Employee, 
  Salary, 
  Education, 
  FamilyInfo, 
  WorkExperience, 
  LeaveApplication, 
  Role, 
  Position, 
  Department, 
  Portal, 
  Project, 
  Country, 
  State, 
  City, 
  Company 
} = require("./models"); // Import all models

// Connecting to MongoDB
let mongoURI;
if (!process.env.DATABASEURL) {
  var config = require("./config.js");
  mongoURI = config.DATABASEURL;
} else {
  mongoURI = process.env.DATABASEURL;
}

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Seed function
const seedData = async () => {
  try {
    // Clear existing data only if necessary
    await clearData();

    // Seed countries, state, and city
    const country = await seedCountry("India");
    const state = await seedState("Maharashtra", country._id);
    const city = await seedCity("Mumbai", state._id);

    // Seed company
    const company = await seedCompany(city._id);

    // Seed roles, positions, and departments
    const role = await seedRole(company._id);
    const position = await seedPosition(company._id);
    const department = await seedDepartment(company._id);

    // Seed employee
    const employee = await seedEmployee(role._id, position._id, department._id);

    // Seed other data
    await seedSalary(employee._id);
    await seedEducation(employee._id);
    await seedFamilyInfo(employee._id);
    await seedWorkExperience(employee._id);
    await seedLeaveApplication(employee._id);

    console.log("Seeding completed successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
    mongoose.disconnect();
  }
};

// Function to clear existing data
const clearData = async () => {
  await Employee.deleteMany({});
  await Salary.deleteMany({});
  await Education.deleteMany({});
  await FamilyInfo.deleteMany({});
  await WorkExperience.deleteMany({});
  await LeaveApplication.deleteMany({});
  await Role.deleteMany({});
  await Position.deleteMany({});
  await Department.deleteMany({});
  await Portal.deleteMany({});
  await Project.deleteMany({});
  await Country.deleteMany({});
  await State.deleteMany({});
  await City.deleteMany({});
  await Company.deleteMany({});
  console.log("Cleared existing data.");
};

// Seed Country
const seedCountry = async (countryName) => {
  return await Country.create({ CountryName: countryName });
};

// Seed State
const seedState = async (stateName, countryId) => {
  return await State.create({ StateName: stateName, country: countryId });
};

// Seed City
const seedCity = async (cityName, stateId) => {
  return await City.create({ CityName: cityName, state: stateId });
};

// Seed Company
const seedCompany = async (cityId) => {
  return await Company.create({
    CompanyName: "HRXpert Solutions",
    Address: "123 Corporate Street",
    PostalCode: 400001,
    Website: "https://hrxpert.example.com",
    Email: "contact@hrxpert.com",
    ContactPerson: "John Doe",
    ContactNo: "9876543210",
    FaxNo: "123-456-789",
    PanNo: "ABCDE1234F",
    GSTNo: "27ABCDE1234F1Z5",
    CINNo: "U12345MH2021PTC123456",
    city: cityId,
  });
};

// Seed Role
const seedRole = async (companyId) => {
  return await Role.create({ RoleName: "Admin", company: companyId });
};

// Seed Position
const seedPosition = async (companyId) => {
  return await Position.create({ PositionName: "HR Manager", company: companyId });
};

// Seed Department
const seedDepartment = async (companyId) => {
  return await Department.create({ DepartmentName: "Human Resources", company: companyId });
};

// Seed Employee
const seedEmployee = async (roleId, positionId, departmentId) => {
  return await Employee.create({
    FirstName: "Jane",
    MiddleName: "Doe",
    LastName: "Smith",
    Email: "janesmith@example.com",
    Password: "password12345",
    Gender: "Female",
    DOB: new Date("1990-01-01"),
    DateOfJoining: new Date("2023-01-15"),
    EmployeeCode: "EMP001",
    ContactNo: "9876543211",
    role: [roleId],
    position: [positionId],
    department: [departmentId],
  });
};

// Seed Salary
const seedSalary = async (employeeId) => {
  await Salary.create({
    EmployeeId: employeeId,
    BasicSalary: "50000",
    BankName: "Axis Bank",
    AccountNo: "123456789",
    AccountHolderName: "Jane Smith",
    IFSCcode: "AXIS0001234",
    TaxDeduction: "10%",
  });
};

// Seed Education
const seedEducation = async (employeeId) => {
  await Education.create({
    EmployeeId: employeeId,
    SchoolUniversity: "Mumbai University",
    Degree: "MBA",
    Grade: "A",
    PassingOfYear: "2012",
  });
};

// Seed Family Info
const seedFamilyInfo = async (employeeId) => {
  await FamilyInfo.create({
    EmployeeId: employeeId,
    Name: "John Doe",
    Relationship: "Father",
    DOB: new Date("1965-05-15"),
    Occupation: "Businessman",
  });
};

// Seed Work Experience
// Seed Work Experience
const seedWorkExperience = async (employeeId) => {
    await WorkExperience.create({
      EmployeeId: employeeId,
      CompanyName: "Tech Solutions Ltd",
      Designation: "Software Engineer", // Include the Designation field
      FromDate: new Date("2015-06-01"),
      ToDate: new Date("2022-12-31"),
      Responsibilities: "Developed software solutions.", // Optional field
    });
  };
// Seed Leave Application
const seedLeaveApplication = async (employeeId) => {
  await LeaveApplication.create({
    EmployeeId: employeeId,
    Leavetype: "Sick Leave",
    FromDate: new Date("2024-01-10"),
    ToDate: new Date("2024-01-12"),
    Reasonforleave: "Fever",
    Status: "Pending",
  });
};

seedData();  // Call seed function
