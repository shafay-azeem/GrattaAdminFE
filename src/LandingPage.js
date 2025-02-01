import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0533] to-[#000000]">
    <nav className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <img
              src="https://ucarecdn.com/e65937ae-5fea-4158-9bde-d5b039e3b211/-/format/auto/"
              alt="Grattia logo"
              className="h-12 w-auto"
            />
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/loginpage"
              className="text-[#FFFFFF] px-6 py-2 rounded-full hover:text-[#FC36FF] transition-colors"
            >
              Log In
            </a>
            <a
              href="/SignUpPage"
              className="bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] text-[#FFFFFF] px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <div className="relative">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] rounded-full filter blur-3xl opacity-20"></div>
          <h1 className="text-6xl font-bold text-[#FFFFFF] mb-6 relative">
            Recognize & Reward
            <br />
            Your Team
          </h1>
          <p className="text-xl text-[#9996AA] mb-10 max-w-2xl mx-auto">
            Build a culture of appreciation with instant peer recognition and
            meaningful rewards that make your team feel valued.
          </p>
          <div className="flex justify-center">
            <a
              href="/SignUpPage"
              className="bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] text-[#FFFFFF] px-8 py-4 rounded-full hover:opacity-90 transition-opacity text-lg"
            >
              Get Started
            </a>
          </div>
        </div>
        <div className="mt-32" id="features">
          <h2 className="text-4xl font-bold text-[#FFFFFF] mb-16">
            Why Teams Love Grattia
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0F0533] bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm hover:bg-opacity-70 transition-all border border-[#7AFBF7]/20">
              <div className="text-[#7AFBF7] text-4xl mb-6">
                <i className="fas fa-gift"></i>
              </div>
              <h3 className="text-2xl font-semibold text-[#FFFFFF] mb-4">
                Instant Recognition
              </h3>
              <p className="text-[#9996AA]">
                Send points in real-time to celebrate wins, big and small.
              </p>
            </div>
            <div className="bg-[#0F0533] bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm hover:bg-opacity-70 transition-all border border-[#7AFBF7]/20">
              <div className="text-[#7AFBF7] text-4xl mb-6">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-2xl font-semibold text-[#FFFFFF] mb-4">
                Track Impact
              </h3>
              <p className="text-[#9996AA]">
                Measure engagement and see how recognition drives team
                performance.
              </p>
            </div>
            <div className="bg-[#0F0533] bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm hover:bg-opacity-70 transition-all border border-[#7AFBF7]/20">
              <div className="text-[#7AFBF7] text-4xl mb-6">
                <i className="fas fa-store"></i>
              </div>
              <h3 className="text-2xl font-semibold text-[#FFFFFF] mb-4">
                Reward Store
              </h3>
              <p className="text-[#9996AA]">
                Choose from hundreds of gift cards and experiences to redeem
                points.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32" id="how-it-works">
        <h2 className="text-4xl font-bold text-[#FFFFFF] text-center mb-16">
          Simple & Effective
        </h2>
        <div className="grid md:grid-cols-4 gap-12">
          <div className="relative">
            <div className="bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] w-12 h-12 rounded-full flex items-center justify-center text-[#FFFFFF] text-xl font-bold mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold text-[#FFFFFF] mb-3">
              Give Recognition
            </h3>
            <p className="text-[#9996AA]">
              Instantly send points with a personal message
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] w-12 h-12 rounded-full flex items-center justify-center text-[#FFFFFF] text-xl font-bold mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold text-[#FFFFFF] mb-3">
              Collect Points
            </h3>
            <p className="text-[#9996AA]">
              Watch your points grow with each recognition
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] w-12 h-12 rounded-full flex items-center justify-center text-[#FFFFFF] text-xl font-bold mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold text-[#FFFFFF] mb-3">
              Choose Rewards
            </h3>
            <p className="text-[#9996AA]">
              Browse our curated reward catalog
            </p>
          </div>
          <div>
            <div className="bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] w-12 h-12 rounded-full flex items-center justify-center text-[#FFFFFF] text-xl font-bold mb-6">
              4
            </div>
            <h3 className="text-xl font-semibold text-[#FFFFFF] mb-3">
              Redeem & Enjoy
            </h3>
            <p className="text-[#9996AA]">
              Get your rewards instantly delivered
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20" id="pricing">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Pricing
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-[#0F0533] bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm transform scale-105 relative border-2 border-[#7AFBF7]">
            <h3 className="text-2xl font-semibold text-[#FFFFFF] mb-4">
              Basic Plan
            </h3>
            <div className="text-4xl font-bold text-[#FFFFFF] mb-4">
              $99<span className="text-lg text-[#9996AA]">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-[#9996AA]">
                <i className="fas fa-check text-[#7AFBF7] mr-3"></i>
                <span>Up to 100 users</span>
              </li>
              <li className="flex items-center text-[#9996AA]">
                <i className="fas fa-check text-[#7AFBF7] mr-3"></i>
                <span>Basic rewards catalog</span>
              </li>
              <li className="flex items-center text-[#9996AA]">
                <i className="fas fa-check text-[#7AFBF7] mr-3"></i>
                <span>Priority support</span>
              </li>
              <li className="flex items-center text-[#9996AA]">
                <i className="fas fa-check text-[#7AFBF7] mr-3"></i>
                <span>Advanced analytics</span>
              </li>
            </ul>
            <a
              href="/SignUpPage"
              className="block w-full bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] text-[#FFFFFF] px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-center"
            >
              Get Started
            </a>
          </div>
          <div className="bg-[#0F0533] bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm border border-[#7AFBF7]/20">
            <h3 className="text-2xl font-semibold text-[#FFFFFF] mb-4">
              Enterprise
            </h3>
            <div className="text-4xl font-bold text-[#FFFFFF] mb-4">
              Custom
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-[#9996AA]">
                <i className="fas fa-check text-[#7AFBF7] mr-3"></i>
                <span>Unlimited users</span>
              </li>
              <li className="flex items-center text-[#9996AA]">
                <i className="fas fa-check text-[#7AFBF7] mr-3"></i>
                <span>Custom rewards</span>
              </li>
              <li className="flex items-center text-[#9996AA]">
                <i className="fas fa-check text-[#7AFBF7] mr-3"></i>
                <span>24/7 support</span>
              </li>
              <li className="flex items-center text-[#9996AA]">
                <i className="fas fa-check text-[#7AFBF7] mr-3"></i>
                <span>Custom integration</span>
              </li>
            </ul>
            <button className="w-full bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] text-[#FFFFFF] px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>

    <footer className="mt-32 border-t border-[#7AFBF7]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center">
          <img
            src="https://ucarecdn.com/e65937ae-5fea-4158-9bde-d5b039e3b211/-/format/auto/"
            alt="Grattia logo"
            className="h-12 w-auto mb-4"
          />
          <p className="text-[#9996AA]">
            Making employee appreciation meaningful and rewarding.
          </p>
          <div className="border-t border-[#7AFBF7]/20 mt-12 pt-8 text-[#9996AA]">
            © 2025 Grattia. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  </div>
  );
};

export default LandingPage;
