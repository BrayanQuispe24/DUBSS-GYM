// src/features/landing/pages/LandingPage.tsx
import React from 'react';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import MobileShowcase from '../components/MobileShowcase';
import CategoryBar from '@/features/gyms/components/CategoryBar';
import GymListings from '@/features/gyms/components/GymListings';
import InteractiveMap from '@/features/gyms/components/InteractiveMap';
import EcosystemRoles from '../components/EcosystemRoles';
import PricingPlans from '../components/PricingPlans';
import CtaBanner from '../components/CtaBanner';
import BookingModal from '@/features/booking/components/BookingModal';

const LandingPage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <CategoryBar />
      <GymListings />
      <HowItWorks />
      <MobileShowcase />
      <InteractiveMap />
      <EcosystemRoles />
      <PricingPlans />
      <CtaBanner />
      <BookingModal />
    </>
  );
};

export default LandingPage;
