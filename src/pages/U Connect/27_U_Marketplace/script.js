// CU_Marketplace JS goes here
const products = [
  {
    name: "DSA Book",
    student: "Kabir Sabharwal",
    phone: "9876543210",
    price: "₹399",
    description: "Master Data Structures and Algorithms.",
    image: "https://codingwithsagar.in/wp-content/uploads/2023/07/hardcover-book-mockup-2-1-768x899.png",
  },
  {
    name: "Used Bicycle",
    student: "Simran Kaur",
    phone: "9123456780",
    price: "₹1500",
    description: "Sturdy cycle, barely used. Great condition.",
    image: "https://tse1.mm.bing.net/th?id=OIP.JMOwlQQdjzJK1PyCGSvCHwHaFj&pid=Api&P=0&h=180"
  },
  {
    name: "Hoodie",
    student: "Rohit Sharma",
    phone: "9988776655",
    price: "₹499",
    description: "Official U Hoodie, size L, brand new.",
    image: "https://tse3.mm.bing.net/th?id=OIP.B0X5dJI00Gu2jwuzBqInKQHaHa&pid=Api&P=0&h=180"
  }
];

const productList = document.getElementById("product-list");

products.forEach(product => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <h3 class="product-name">${product.name}</h3>
    <p class="student-name">By ${product.student}</p>
    <p class="student-phone">📞 ${product.phone}</p>
    <p class="product-description">${product.description}</p>
    <div class="product-price">${product.price}</div>
    <button class="buy-button">Buy Now</button>
  `;
  productList.appendChild(card);
});