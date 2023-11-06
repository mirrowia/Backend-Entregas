// GENERATE 100 MOCKS PRODUCTS
function getMockProducts(req, res) {
    const mockProducts = [];
    const categories = ["Acción", "Aventura", "Deportes", "Estrategia", "FPS", "Horror", "Multijugador", "RPG", "Simulación", "Terror"]
    
    for (let i = 1; i <= 100; i++) {
      mockProducts.push({
        _id: generateCustomId(),
        name: `Product N°${i}`,
        description: `Descripción del producto N°${i}`,
        category: categories[0],
        stock: Math.floor(Math.random() * 100) + 1,
        price: Math.floor(Math.random() * 100) + 1,
        image_url: "https://www.trecebits.com/wp-content/uploads/2021/09/Steam.jpg",
      });
    }
    res.status(200).send(mockProducts);
  }

  // GENERATE RANDOMS _ID
  function generateCustomId() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 24; 
  
    let id = '';
    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }
  
    return id;
  }

  module.exports = {
    getMockProducts
  };