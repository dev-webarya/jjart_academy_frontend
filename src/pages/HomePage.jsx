import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import PopularActivities from "../components/PopularActivities";
import WhatWeOffer from "../components/WhatWeOffer";
import Benefits from "../components/Benefits";
import FollowUsOnInstagram from "../components/FollowUsOnInstagram";
import CallToAction from "../components/CallToAction";
import GalleryHome from "../components/GalleryHome";
import EventsPopup from "../components/events/EventsPopup";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Features />
      <PopularActivities />
      <WhatWeOffer />
      <GalleryHome />
      <Benefits />
      <FollowUsOnInstagram />
      <CallToAction />

      {/* Events Popup - shows after 2 seconds */}
      <EventsPopup
        autoShow={true}
        delay={2000}
        maxEvents={3}
        dismissHours={24}
      />
    </div>
  );
};
export default HomePage;
