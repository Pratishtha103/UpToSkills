// Create a test student
const axios = require('axios');

(async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test Student',
      email: 'test@student.com', 
      phone: '1234567890',
      password: 'password123',
      role: 'student'
    });
    
    console.log('✅ Test student created:', response.data);
    console.log('Login credentials:');
    console.log('Email: test@student.com');
    console.log('Password: password123');
    console.log('Role: student');
    
  } catch (error) {
    if (error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️ Test student already exists');
      console.log('Login credentials:');
      console.log('Email: test@student.com');
      console.log('Password: password123'); 
      console.log('Role: student');
    } else {
      console.error('❌ Error creating student:', error.response?.data || error.message);
    }
  }
})();