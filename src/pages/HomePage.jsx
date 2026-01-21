import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import PopularActivities from "../components/PopularActivities";
import WhatWeOffer from "../components/WhatWeOffer";
import Benefits from "../components/Benefits";
import FollowUsOnInstagram from "../components/FollowUsOnInstagram";
import CallToAction from "../components/CallToAction";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Features />
      <PopularActivities />
      <WhatWeOffer />
      <Benefits />
      <FollowUsOnInstagram />
      <CallToAction />
    </div>
  );
};
export default HomePage;
