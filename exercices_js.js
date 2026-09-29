// 1. Destructuring: rename role to status and use "visitor" when role is absent.
const user = { name: 'Aya' };
const { name, role: status = 'visitor' } = user;
console.log('Destructuring:', { name, status });

// 2. Spread: create a new array while leaving the original array unchanged.
const originalArticles = [
  { id: 1, title: 'Introduction to MERN' },
  { id: 2, title: 'Async JavaScript' },
];
const articlesWithNewItem = [...originalArticles, { id: 3, title: 'Express REST APIs' }];
console.log('Original articles:', originalArticles);
console.log('Updated articles:', articlesWithNewItem);

// 3. Filter passing students, then map them to uppercase display strings.
const students = [
  { name: 'Youssef', grade: 16 },
  { name: 'Aya', grade: 18 },
  { name: 'Karim', grade: 11 },
];
const honors = students
  .filter((student) => student.grade >= 15)
  .map((student) => `${student.name.toUpperCase()}: ${student.grade}`);
console.log('Honors students:', honors);

// 4. Simulate an asynchronous read with error handling.
const retrieveData = async () => {
  try {
    const data = await new Promise((resolve) => {
      setTimeout(() => resolve({ message: 'Data retrieved after 500 ms' }), 500);
    });
    console.log('Async retrieval:', data);
    return data;
  } catch (error) {
    console.error('Data retrieval failed:', error.message);
    return null;
  }
};

retrieveData();
