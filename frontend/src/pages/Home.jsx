import { Link } from "react-router-dom";

const perks = [
  {
    title: "Verified fleet",
    text: "Every vehicle is inspected and maintenance-tracked before it goes live.",
  },
  {
    title: "No hidden fees",
    text: "The price per day you see is the price you pay — total is calculated up front.",
  },
  {
    title: "Cancel with ease",
    text: "Plans change. Cancel eligible bookings in a couple of taps, no phone calls.",
  },
];

const steps = [
  { label: "Search", text: "Filter by brand, price, seats, or transmission to find your match." },
  { label: "Book", text: "Pick your dates. We check availability instantly, no back and forth." },
  { label: "Drive", text: "Show up, grab the keys, and go. Track everything from My Trips." },
];

function Home() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal text-cream">
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            <path d="M-50 500 Q 200 400 400 480 T 850 420" stroke="white" strokeWidth="2" fill="none" strokeDasharray="14 14"/>
            <path d="M-50 350 Q 250 250 450 330 T 900 280" stroke="white" strokeWidth="2" fill="none" strokeDasharray="14 14"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="max-w-2xl">
            <p className="text-sunset font-medium text-sm tracking-wide mb-4">Rentals for wherever you're headed</p>
            <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] mb-6">
              Find your next<br />ride, book it<br />in minutes.
            </h1>
            <p className="text-cream/70 text-lg mb-8 max-w-lg">
              From weekend getaways to weekday errands — browse a fleet that's ready
              when you are, with pricing that's clear from the start.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/vehicles"
                className="bg-sunset hover:bg-sunset-dark text-charcoal font-semibold px-7 py-3.5 rounded-full transition-colors"
              >
                Browse the fleet
              </Link>
              <Link
                to="/register"
                className="border border-cream/25 hover:border-cream/50 text-cream font-medium px-7 py-3.5 rounded-full transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap gap-x-10 gap-y-3 text-sm text-cream/60">
            <span>Automatic &amp; manual</span>
            <span>Petrol, diesel, hybrid, electric</span>
            <span>Daily rates, no surprises</span>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-10">
          {perks.map((perk) => (
            <div key={perk.title}>
              <div className="w-10 h-10 rounded-full bg-sage/15 flex items-center justify-center mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-sage-dark"></div>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{perk.title}</h3>
              <p className="text-charcoal/60 leading-relaxed">{perk.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-asphalt text-cream py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-3xl font-semibold mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.label} className="relative pl-6 border-l border-white/15">
                <span className="font-display text-sunset text-sm">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-lg font-semibold mt-2 mb-2">{step.label}</h3>
                <p className="text-cream/60 leading-relaxed text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Ready to hit the road?</h2>
        <p className="text-charcoal/60 mb-8 max-w-md mx-auto">
          Browse available vehicles near you and lock in your dates today.
        </p>
        <Link
          to="/vehicles"
          className="inline-block bg-charcoal hover:bg-asphalt text-cream font-semibold px-8 py-3.5 rounded-full transition-colors"
        >
          View available vehicles
        </Link>
      </section>
    </div>
  );
}

export default Home;
