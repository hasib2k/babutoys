'use client';

import { useState, useRef } from 'react';
import styles from './ProductDetail.module.css';
import CountdownTimer from './CountdownTimer';

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('1 kg');
  const [activeTab, setActiveTab] = useState('rating');
  const orderFormRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    name: '',
    email: '',
    rating: 5,
    review: ''
  });

  const scrollToOrder = () => {
    orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const images = [
    '/orange-main.svg',
    '/orange-sliced.svg',
    '/orange-bunch.svg',
    '/orange-half.svg'
  ];

  const reviews = [
    {
      name: 'Hasib Ahmed',
      date: '2 months ago',
      rating: 5,
      title: 'Premium Fresh and Delicious Oranges',
      text: 'The oranges are super fresh and juicy! Perfect sweetness and great quality. My family loved them. Will definitely order again. Highly recommend for juice making.',
      images: ['/orange-main.svg', '/orange-sliced.svg', '/orange-bunch.svg'],
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Toriqul Islam Tushar',
      date: '2 months ago',
      rating: 5,
      title: 'Super Fresh Orange',
      text: 'Really good quality oranges. They were fresh and sweet. Good for making juice. Delivery was on time. Price is reasonable for the quality you get.',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      name: 'Rashed Khan',
      date: '3 months ago',
      rating: 5,
      title: 'Best Quality Oranges',
      text: 'Excellent oranges! Very fresh and tasty. The vitamin C content is great. My kids love eating these. Fast delivery and good packaging. Will order again soon.',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    {
      name: 'Sahed Rahman',
      date: '3 months ago',
      rating: 4,
      title: 'Amazing Fresh Orange',
      text: 'Perfect oranges! Sweet, juicy and fresh. Great for daily vitamin C intake. Highly satisfied with the purchase.',
      avatar: 'https://randomuser.me/api/portraits/men/12.jpg'
    }
  ];

  const productPrice = 490;
  const originalPrice = 600;

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, Math.min(10, quantity + delta)));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Review submitted:', reviewData);
    setShowReviewForm(false);
    setReviewData({ name: '', email: '', rating: 5, review: '' });
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      address: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    const phoneRegex = /^01[0-9]{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Enter valid phone number (01XXXXXXXXX)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Enter complete address';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone && !newErrors.address;
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Create WhatsApp message with order details
    const totalAmount = (productPrice * quantity).toFixed(2);
    const message = `*New Order Details:*%0A%0A` +
      `*Product:* Fresh Premium Oranges%0A` +
      `*Weight:* ${selectedWeight}%0A` +
      `*Quantity:* ${quantity}%0A` +
      `*Total Amount:* ৳${totalAmount}%0A%0A` +
      `*Customer Details:*%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Address:* ${formData.address}%0A%0A` +
      `I want to place this order. Please confirm.`;

    // Redirect to WhatsApp
    const whatsappURL = `https://wa.me/8801870451231?text=${message}`;
    window.open(whatsappURL, '_blank');

    // Show success message
    setOrderSubmitted(true);
    
    setTimeout(() => {
      setOrderSubmitted(false);
      setFormData({ name: '', phone: '', address: '' });
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Unlock Your Best Self – Naturally!
          </h1>
          <CountdownTimer />
          <button className={styles.heroBtn} onClick={scrollToOrder}>
            Order Now
          </button>
        </div>
      </section>

      <div className={styles.container}>
        {/* Product Detail Section */}
        <div className={styles.productSection}>
          {/* Image Gallery */}
          <div className={styles.imageGallery}>
            <div className={styles.mainImage}>
              <img src={images[selectedImage]} alt="Product" />
            </div>
            <div className={styles.thumbnails}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`${styles.thumbnail} ${selectedImage === idx ? styles.active : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className={styles.productInfo}>
            <div className={styles.badge}>In Stock</div>
            <h1 className={styles.productTitle}>Fresh Premium Oranges</h1>
            
            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>৳{productPrice.toFixed(2)}</span>
              <span className={styles.originalPrice}>৳{originalPrice.toFixed(2)}</span>
              <span className={styles.discount}>18.33% Off</span>
            </div>

            <div className={styles.ratingInfo}>
              <div className={styles.stars}>
                {'⭐'.repeat(5)}
              </div>
              <span className={styles.reviewCount}>32 Review</span>
            </div>

            <p className={styles.description}>
              Fresh, juicy premium oranges directly from the farm. Rich in Vitamin C,
              perfect for juice or eating fresh. Sweet and tangy flavor guaranteed.
            </p>

            {/* Weight Selection */}
            <div className={styles.weightSection}>
              <label>Weight:</label>
              <div className={styles.weightOptions}>
                {['1 kg', '2 kg', '5 kg'].map((weight) => (
                  <button
                    key={weight}
                    className={`${styles.weightBtn} ${selectedWeight === weight ? styles.active : ''}`}
                    onClick={() => setSelectedWeight(weight)}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className={styles.actionSection}>
              <div className={styles.quantityControl}>
                <button onClick={() => handleQuantityChange(-1)}>−</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
              <button className={styles.orderNowBtn} onClick={scrollToOrder}>
                Order Now
              </button>
            </div>

            {/* Additional Info */}
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <strong>Category:</strong> <span>Fresh Fruits</span>
              </div>
              <div className={styles.infoItem}>
                <strong>Tag:</strong> <span>Orange Citrus Fresh Vitamin C Healthy Organic Farm Fresh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className={styles.tabsSection}>
          <div className={styles.tabHeaders}>
            <button
              className={`${styles.tabHeader} ${activeTab === 'rating' ? styles.active : ''}`}
              onClick={() => setActiveTab('rating')}
            >
              Rating & Reviews
            </button>
            <button
              className={`${styles.tabHeader} ${activeTab === 'description' ? styles.active : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
          </div>

          {activeTab === 'rating' && (
            <div className={styles.reviewsContent}>
              {/* Rating Overview */}
              <div className={styles.ratingOverview}>
                <div className={styles.ratingScore}>
                  <div className={styles.scoreNumber}>4.5</div>
                  <div className={styles.stars}>{'⭐'.repeat(5)}</div>
                  <div className={styles.totalReviews}>32 Reviews</div>
                </div>

                <div className={styles.ratingBars}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className={styles.ratingBar}>
                      <span>{star} Star</span>
                      <div className={styles.barContainer}>
                        <div
                          className={styles.barFill}
                          style={{ width: `${star === 5 ? 80 : star === 4 ? 60 : star === 3 ? 40 : star === 2 ? 20 : 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className={styles.reviewsList}>
                <div className={styles.reviewsHeader}>
                  <h3>Review List</h3>
                  <span>Showing 1-4 of 32 results</span>
                </div>

                {reviews.map((review, idx) => (
                  <div key={idx} className={styles.reviewItem}>
                    <div className={styles.reviewerInfo}>
                      <div className={styles.reviewerAvatar}>
                        {review.avatar ? (
                          <img src={review.avatar} alt={review.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                        ) : (
                          review.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4>{review.name}</h4>
                        <span className={styles.reviewDate}>{review.date}</span>
                      </div>
                    </div>
                    <h5 className={styles.reviewTitle}>{review.title}</h5>
                    <p className={styles.reviewText}>{review.text}</p>
                    <div className={styles.reviewStars}>
                      {'⭐'.repeat(review.rating)}
                    </div>
                    {review.images && (
                      <div className={styles.reviewImages}>
                        {review.images.map((img, i) => (
                          <img key={i} src={img} alt={`Review ${i + 1}`} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'description' && (
            <div className={styles.descriptionContent}>
              <h3>Product Description</h3>
              <p>
                Our premium fresh oranges are carefully selected from the finest farms. Each orange is 
                hand-picked to ensure maximum sweetness and juiciness. Rich in Vitamin C, these oranges 
                are perfect for boosting your immune system and maintaining good health.
              </p>
              <p>
                Perfect for fresh juice, fruit salads, or eating as a healthy snack. Our oranges are 
                naturally sweet with the perfect balance of tanginess. We ensure farm-to-table freshness 
                with proper storage and quick delivery. Available in 1kg, 2kg, and 5kg packages.
              </p>
              <h4>Benefits:</h4>
              <ul>
                <li>Rich in Vitamin C - Boosts immunity</li>
                <li>Natural antioxidants for healthy skin</li>
                <li>Good source of fiber for digestion</li>
                <li>Fresh and juicy - Perfect for juice</li>
                <li>Farm fresh quality guaranteed</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Order Form Section */}
      <div className={styles.orderSection} ref={orderFormRef}>
        <div className={styles.orderContainer}>
          <div className={styles.orderImageSection}>
            <img src="/orange-main.svg" alt="Fresh Premium Oranges" className={styles.orderProductImage} />
          </div>
          
          <div className={styles.orderFormSection}>
            {orderSubmitted ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>Order Placed Successfully!</h3>
                <p>Order #{Math.floor(Math.random() * 900000) + 100000}</p>
                <p>We will contact you soon.</p>
                <div className={styles.orderSummary}>
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Quantity:</strong> {quantity} {selectedWeight}</p>
                  <p><strong>Total:</strong> ৳{(productPrice * quantity).toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <>
                <h2 className={styles.orderFormTitle}>Place Your Order</h2>
                <div className={styles.orderProductInfo}>
                  <h3>Fresh Premium Oranges - {selectedWeight}</h3>
                  <div className={styles.orderPrice}>
                    <span className={styles.orderCurrentPrice}>৳{productPrice.toFixed(2)}</span>
                    <span className={styles.orderOriginalPrice}>৳{originalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handleOrderSubmit} className={styles.orderForm}>
                  <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className={errors.name ? styles.inputError : ''}
                    />
                    {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className={errors.phone ? styles.inputError : ''}
                    />
                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Complete Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House no, Road no, Area, District"
                      rows={4}
                      className={errors.address ? styles.inputError : ''}
                    />
                    {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Quantity</label>
                    <div className={styles.quantityControlForm}>
                      <button type="button" onClick={() => handleQuantityChange(-1)}>−</button>
                      <span>{quantity}</span>
                      <button type="button" onClick={() => handleQuantityChange(1)}>+</button>
                    </div>
                  </div>

                  <div className={styles.orderTotal}>
                    <span>Total Amount:</span>
                    <span className={styles.totalPrice}>৳{(productPrice * quantity).toFixed(2)}</span>
                  </div>

                  <button type="submit" className={styles.submitOrderBtn}>
                    Place Order (Cash on Delivery)
                  </button>

                  <p className={styles.orderNote}>
                    🛒 Cash on Delivery available. Pay when you receive the product.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className={styles.floatingButtons}>
        <a 
          href="https://wa.me/8801870451231" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.whatsappBtn}
          title="Chat on WhatsApp"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
            <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.45zm-8.475 18.3c-1.778 0-3.52-.478-5.035-1.377l-.36-.214-3.742.98 1-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.887 9.885z" fill="currentColor"/>
          </svg>
        </a>
        <a 
          href="tel:+8801870451231" 
          className={styles.callBtn}
          title="Call us"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="currentColor"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
