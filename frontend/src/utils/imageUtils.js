/**
 * getImage(product) — consistent keyword-based image mapping
 * Used in Shop, ProductDetails, and Cart so images remain identical.
 */

const imageMap = {
  milk:       "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",
  egg:        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
  bread:      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  rice:       "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
  oat:        "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_730,h_548/k%2FPhoto%2FRecipes%2F2025-02-overnight-oats%2Fovernight-oats-484",
  almond:     "https://heerson.com/cdn/shop/files/Almond-Big-dry-fruit-nut-mixture.jpg?v=1718448561&width=1200",
  walnut:        "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80",
  banana:     "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
  apple:      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80",
  protein:    "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
  whey:       "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
  spinach:    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",
  yogurt:     "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
  chocolate:  "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80",
  orange:     "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80",
  juice:      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80",
  vitamin:    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
  supplement: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
  multivitamin: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
  carrot: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80",
  broccoli: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80",
  beetroot: "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=400&q=80",
  "green tea": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  "Coconut Water": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80",
};

const categoryMap = {
  proteins:     "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&q=80",
  vegetables:   "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
  snacks:       "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80",
  drinks:       "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
  supplements:  "https://images.unsplash.com/photo-1550572017-37b4f882b6f8?w=400&q=80",
};

const fallback = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80";

export function getImage(product) {
  if (!product) return fallback;

  const name = (product.productName || "").toLowerCase();

  for (const keyword of Object.keys(imageMap)) {
    if (name.includes(keyword)) {
      return imageMap[keyword];
    }
  }

  const cat = (product.category || "").toLowerCase();
  if (categoryMap[cat]) return categoryMap[cat];

  return fallback;
}
