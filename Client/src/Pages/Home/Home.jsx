import ContactUs from "./ContactUs";
import FAQ from "./FAQ";
import FeaturedSection from "./FeaturedSection";
import Header from "./Header";
import PartnersSupporters from "./PartnersSupporters";
import Testimonials from "./Testimonials";
import Volunteer from "./Volunteer";

export default function Home() {
  return (
    <div>
      <Header></Header>
      <FeaturedSection></FeaturedSection>
      <Testimonials></Testimonials>
      <PartnersSupporters></PartnersSupporters>
      <FAQ></FAQ>
      <Volunteer></Volunteer>
      <ContactUs></ContactUs>
    </div>
  );
}
