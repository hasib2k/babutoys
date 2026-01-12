'use client';

import { useState } from 'react';
import styles from './OrderForm.module.css';

export default function OrderForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: 1,
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      address: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'নাম প্রয়োজন';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'নাম কমপক্ষে ৩ অক্ষর হতে হবে';
    }

    const phoneRegex = /^01[0-9]{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'মোবাইল নাম্বার প্রয়োজন';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'সঠিক মোবাইল নাম্বার দিন (01XXXXXXXXX)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'ঠিকানা প্রয়োজন';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'সম্পূর্ণ ঠিকানা দিন';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone && !newErrors.address;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically send the order to your backend
    const orderData = {
      ...formData,
      subtotal,
      shippingCost,
      total,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Order submitted:', orderData);
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        address: '',
        quantity: 1,
      });
      setErrors({
        name: '',
        phone: '',
        address: '',
      });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleQuantityChange = (increment: number) => {
    setFormData({
      ...formData,
      quantity: Math.max(1, Math.min(10, formData.quantity + increment)),
    });
  };

  const productPrice = 1490;
  const shippingCost = 100;
  const subtotal = productPrice * formData.quantity;
  const total = subtotal + shippingCost;

  if (submitted) {
    return (
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>✓</div>
        <h3>অর্ডার সফল হয়েছে!</h3>
        <p>আপনার অর্ডার নং: #{Math.floor(Math.random() * 900000) + 100000}</p>
        <p>আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
        <div className={styles.orderSummary}>
          <p><strong>নাম:</strong> {formData.name}</p>
          <p><strong>ফোন:</strong> {formData.phone}</p>
          <p><strong>পরিমাণ:</strong> {formData.quantity} পিস</p>
          <p><strong>মোট:</strong> ৳{total}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderForm}>
      <div className={styles.productSummary}>
        <div className={styles.productHeader}>
          <img src="/product-main.svg" alt="Product" className={styles.productThumb} />
          <div>
            <h3>(Combo) Relax Massage Gun + EMS Mini Massager + Hot Water Bag</h3>
            <p className={styles.price}>৳{productPrice}</p>
          </div>
        </div>

        <div className={styles.quantitySelector}>
          <label>পরিমাণ (Quantity)</label>
          <div className={styles.quantityControls}>
            <button 
              type="button" 
              onClick={() => handleQuantityChange(-1)}
              className={styles.quantityBtn}
              disabled={formData.quantity <= 1}
            >
              -
            </button>
            <span className={styles.quantityValue}>{formData.quantity}</span>
            <button 
              type="button" 
              onClick={() => handleQuantityChange(1)}
              className={styles.quantityBtn}
              disabled={formData.quantity >= 10}
            >
              +
            </button>
          </div>
          <small className={styles.maxNote}>সর্বোচ্চ ১০ পিস অর্ডার করতে পারবেন</small>
        </div>

        <div className={styles.priceBreakdown}>
          <div className={styles.priceRow}>
            <span>Subtotal ({formData.quantity} পিস)</span>
            <span>৳{subtotal}</span>
          </div>
          <div className={styles.priceRow}>
            <span>Shipping</span>
            <span>৳{shippingCost}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>Billing Details</h3>
        
        <div className={styles.formGroup}>
          <label htmlFor="name">নাম *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="আপনার সম্পূর্ণ নাম"
            className={errors.name ? styles.inputError : ''}
          />
          {errors.name && <span className={styles.errorText}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">মোবাইল নাম্বার *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01XXXXXXXXX"
            maxLength={11}
            className={errors.phone ? styles.inputError : ''}
          />
          {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">সম্পূর্ণ ঠিকানা *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={4}
            placeholder="বাসা নং, রোড নং, এলাকা, জেলা"
            className={errors.address ? styles.inputError : ''}
          />
          {errors.address && <span className={styles.errorText}>{errors.address}</span>}
        </div>

        <div className={styles.paymentMethod}>
          <h4>Select a payment type</h4>
          <div className={styles.paymentOption}>
            <input type="radio" id="cod" name="payment" defaultChecked />
            <label htmlFor="cod">💵 Cash on delivery</label>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-large"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'প্রসেসিং...' : '🛒 Order Now'}
        </button>

        <p className={styles.note}>
          আমরা ক্যাশ অন ডেলিভারি সিস্টেম এ কাজ করি। পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।
        </p>
      </form>
    </div>
  );
}
