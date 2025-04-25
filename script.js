document.addEventListener("DOMContentLoaded", () => {
  const scrapeBtn = document.getElementById("scrapeBtn");
  const keywordInput = document.getElementById("keyword");
  const resultsSection = document.getElementById("resultsSection");
  const loadingState = document.getElementById("loadingState");
  const errorState = document.getElementById("errorState");
  const resultsGrid = document.getElementById("resultsGrid");
  const emptyState = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");
  const productCardTemplate = document.getElementById("productCardTemplate");

  const mockProducts = [
    {
      title:
        "Apple AirPods Pro (2nd Generation) Wireless Earbuds, Up to 2X More Active Noise Cancelling, Adaptive Transparency, Personalized Spatial Audio, MagSafe Charging Case, Bluetooth Headphones for iPhone",
      rating: 4.5,
      reviews: 14523,
      imageUrl:
        "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_UL320_.jpg",
      productUrl: "https://www.amazon.com/dp/B0CHWXQ8YN",
    },
    {
      title:
        "Sony WH-1000XM5 Wireless Industry Leading Headphones with Auto Noise Canceling Optimizer, Crystal Clear Hands-Free Calling, and Alexa Voice Control, Black",
      rating: 4.6,
      reviews: 8765,
      imageUrl:
        "https://m.media-amazon.com/images/I/61uByyD3mVL._AC_UL320_.jpg",
      productUrl: "https://www.amazon.com/dp/B09XS7JWHH",
    },
    {
      title:
        "Bose QuietComfort Ultra Wireless Noise Cancelling Headphones with Spatial Audio, Black",
      rating: 4.3,
      reviews: 3421,
      imageUrl:
        "https://m.media-amazon.com/images/I/51R1ROj0kVL._AC_UL320_.jpg",
      productUrl: "https://www.amazon.com/dp/B0C8H8X6K1",
    },
    {
      title:
        "Sennheiser MOMENTUM 4 Wireless Headphones, Adaptive Noise Cancellation, 60-Hour Battery Life, Bluetooth 5.2, Built-in Microphone, Black",
      rating: 4.4,
      reviews: 5234,
      imageUrl:
        "https://m.media-amazon.com/images/I/61o6Vty9QIL._AC_UL320_.jpg",
      productUrl: "https://www.amazon.com/dp/B0B7S8S6PD",
    },
    {
      title:
        "JBL Tune 760NC Wireless Over-Ear Active Noise Cancelling Headphones - Black",
      rating: 4.2,
      reviews: 7654,
      imageUrl:
        "https://m.media-amazon.com/images/I/61QRAU+cRVL._AC_UL320_.jpg",
      productUrl: "https://www.amazon.com/dp/B09VK3Y2H1",
    },
    {
      title:
        "Beats Studio Pro - Wireless Bluetooth Noise Cancelling Headphones - Personalized Spatial Audio, USB-C Lossless Audio - Black",
      rating: 4.1,
      reviews: 4321,
      imageUrl:
        "https://m.media-amazon.com/images/I/51m0D5+QNVL._AC_UL320_.jpg",
      productUrl: "https://www.amazon.com/dp/B0CBQ5BZQ9",
    },
  ];

  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = "";

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHTML += '<i class="fas fa-star"></i>';
      } else if (i === fullStars && hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
      } else {
        starsHTML += '<i class="far fa-star"></i>';
      }
    }

    return starsHTML;
  }

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function displayProducts(products) {
    resultsGrid.innerHTML = "";

    // biome-ignore lint/complexity/noForEach: <explanation>
    products.forEach((product) => {
      const productCard = productCardTemplate.content.cloneNode(true);

      productCard.querySelector("#productTitle").textContent = product.title;
      productCard.querySelector("#productImage").src = product.imageUrl;
      productCard.querySelector("#productImage").alt = product.title;
      productCard.querySelector("#productRatingStars").innerHTML = renderStars(
        product.rating
      );
      productCard.querySelector("#productRatingCount").textContent =
        product.rating.toFixed(1);
      productCard.querySelector(
        "#productReviews"
      ).textContent = `${formatNumber(product.reviews)} reviews`;
      productCard.querySelector("a").href = product.productUrl;

      resultsGrid.appendChild(productCard);
    });

    resultCount.textContent = `${products.length} products found`;
  }

  function showError(title, message) {
    errorState.classList.remove("hidden");
    document.getElementById("errorTitle").textContent = title;
    document.getElementById("errorMessage").textContent = message;
  }

  function hideError() {
    errorState.classList.add("hidden");
  }

  async function scrapeProducts(keyword) {
    // In a real implementation, this would call your Bun backend
    // For now, we'll use mock data with a delay to simulate API call

    return new Promise((resolve) => {
      setTimeout(() => {
        if (keyword.toLowerCase().includes("error")) {
          resolve({ error: "Invalid keyword provided" });
        } else {
          resolve({ products: mockProducts });
        }
      }, 1500);
    });
  }

  scrapeBtn.addEventListener("click", async () => {
    const keyword = keywordInput.value.trim();

    if (!keyword) {
      showError(
        "Missing keyword",
        "Please enter a search keyword before scraping."
      );
      return;
    }

    hideError();
    emptyState.classList.add("hidden");
    resultsSection.classList.remove("hidden");
    loadingState.classList.remove("hidden");
    resultsGrid.innerHTML = "";

    try {
      const response = await scrapeProducts(keyword);

      if (response.error) {
        showError("Scraping Error", response.error);
        displayProducts([]);
      } else {
        displayProducts(response.products);
      }
    } catch (error) {
      showError(
        "Network Error",
        "Failed to connect to the scraping service. Please try again later."
      );
      console.error("Scraping error:", error);
    } finally {
      loadingState.classList.add("hidden");
    }
  });

  // Allow pressing Enter in the input field to trigger scraping
  keywordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      scrapeBtn.click();
    }
  });
});
