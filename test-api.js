// Simple API Test Script
// Run with: node test-api.js

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: GET all testimonials
    console.log('1️⃣ Testing GET /api/testimonials');
    const getResponse = await fetch(`${BASE_URL}/testimonials`);
    const testimonials = await getResponse.json();
    console.log('✅ GET Success:', testimonials.length, 'testimonials found');
    console.log('Data:', testimonials);
    console.log('');

    // Test 2: POST new testimonial
    console.log('2️⃣ Testing POST /api/testimonials');
    const postResponse = await fetch(`${BASE_URL}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        role: 'Tester',
        message: 'This is a test testimonial!'
      })
    });
    const newTestimonial = await postResponse.json();
    console.log('✅ POST Success:', newTestimonial);
    console.log('');

    // Test 3: DELETE testimonial (using the ID from POST)
    if (newTestimonial.id) {
      console.log('3️⃣ Testing DELETE /api/testimonials/' + newTestimonial.id);
      const deleteResponse = await fetch(`${BASE_URL}/testimonials/${newTestimonial.id}`, {
        method: 'DELETE'
      });
      const deleteResult = await deleteResponse.json();
      console.log('✅ DELETE Success:', deleteResult);
      console.log('');
    }

    // Test 4: GET student details
    console.log('4️⃣ Testing GET /api/students (first 3)');
    const studentsResponse = await fetch(`${BASE_URL}/students`);
    const studentsData = await studentsResponse.json();
    if (studentsData.success && studentsData.data.length > 0) {
      console.log('✅ Students found:', studentsData.data.length);
      console.log('First student:', studentsData.data[0]);
      
      // Test student details endpoint
      const studentId = studentsData.data[0].id;
      console.log('\n5️⃣ Testing GET /api/students/' + studentId + '/details');
      const detailsResponse = await fetch(`${BASE_URL}/students/${studentId}/details`);
      const detailsData = await detailsResponse.json();
      console.log('✅ Student details:', detailsData.success ? 'Success' : 'Failed');
      if (detailsData.success) {
        console.log('Stats:', detailsData.data.stats);
      }
    }
    console.log('');

    // Test 5: GET companies
    console.log('6️⃣ Testing GET /api/companies');
    const companiesResponse = await fetch(`${BASE_URL}/companies`);
    const companies = await companiesResponse.json();
    console.log('✅ Companies found:', companies.length);
    if (companies.length > 0) {
      console.log('First company:', companies[0]);
      
      // Test company details
      const companyId = companies[0].id;
      console.log('\n7️⃣ Testing GET /api/companies/' + companyId + '/details');
      const companyDetailsResponse = await fetch(`${BASE_URL}/companies/${companyId}/details`);
      const companyDetails = await companyDetailsResponse.json();
      console.log('✅ Company details:', companyDetails.success ? 'Success' : 'Failed');
      if (companyDetails.success) {
        console.log('Stats:', companyDetails.data.stats);
      }
    }
    console.log('');

    // Test 6: GET enrollments
    console.log('8️⃣ Testing GET /api/enrollments (if any exist)');
    const enrollmentsResponse = await fetch(`${BASE_URL}/debug/database-state`);
    const dbState = await enrollmentsResponse.json();
    console.log('✅ Database state:', dbState);
    console.log('');

    console.log('🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testAPI();