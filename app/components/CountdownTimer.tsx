'use client';

import React, { useEffect, useState } from 'react';
import styles from './CountdownTimer.module.css';

interface CountdownTimerProps {
  targetDate?: string;
}

const getTimeRemaining = (endTime: number) => {
  const total = endTime - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  // Default: 3 days from now
  const endTime = targetDate ? new Date(targetDate).getTime() : Date.now() + 3 * 24 * 60 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.total <= 0) {
    return (
      <div className={styles.timerWrapper}>
        <span style={{ color: '#ff6b35', fontWeight: 600 }}>Offer ended!</span>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.timerHeading}>
        Limited Time Offer Ends In:
      </div>
      <div className={styles.timerWrapper}>
        <div className={styles.timeBox}>
          <span className={styles.timeValue}>{timeLeft.days}</span>
          <span className={styles.timeLabel}>Days</span>
        </div>
        <div className={styles.timeBox}>
          <span className={styles.timeValue}>{timeLeft.hours}</span>
          <span className={styles.timeLabel}>Hours</span>
        </div>
        <div className={styles.timeBox}>
          <span className={styles.timeValue}>{timeLeft.minutes}</span>
          <span className={styles.timeLabel}>Minutes</span>
        </div>
        <div className={styles.timeBox}>
          <span className={styles.timeValue}>{timeLeft.seconds}</span>
          <span className={styles.timeLabel}>Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
